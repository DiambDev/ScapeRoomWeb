"""Driver CDP minimo para Chrome headless usando sockets puros (sin websockets-pip).
Permite abrir una pagina, evaluar JS, esperar selectores, hacer clic y leer consola.
Su objetivo es permitir QA automatizado de la simulacion con temporizadores reales.
"""

import base64
import json
import os
import socket
import struct
import subprocess
import threading
import time
import urllib.request

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


class WebSocketClient:
    """Cliente WebSocket (RFC 6455) minimo cliente->servidor, mensajes JSON."""

    def __init__(self, url, timeout=30):
        self.sock = socket.create_connection((self._host(url), self._port(url)), timeout=timeout)
        self.buffer = b""
        self.url = url
        self._handshake(url)
        self._lock = threading.Lock()
        self._recv_thread = threading.Thread(target=self._reader, daemon=True)
        self._recv_thread.start()

    @staticmethod
    def _host(url):
        import re
        m = re.match(r"wss?://([^:/]+)", url)
        return m.group(1)

    @staticmethod
    def _port(url):
        import re
        m = re.search(r":(\d+)", url.split("/", 3)[2])
        return int(m.group(1))

    def _handshake(self, url):
        path = url.split("/", 3)[3] if "/" in url.split("//", 1)[1] else "/"
        key = base64.b64encode(os.urandom(16)).decode()
        req = (
            f"GET /{path} HTTP/1.1\r\n"
            f"Host: {self._host(url)}:{self._port(url)}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(req.encode())
        resp = b""
        while b"\r\n\r\n" not in resp:
            resp += self.sock.recv(4096)
        if b"101" not in resp.split(b"\r\n", 1)[0]:
            raise RuntimeError("Handshake fallo: " + resp[:200].decode(errors="replace"))

    def _send_frame(self, payload: bytes):
        mask = os.urandom(4)
        header = bytearray([0x81])
        n = len(payload)
        if n < 126:
            header.append(0x80 | n)
        elif n < 65536:
            header.append(0x80 | 126)
            header += struct.pack(">H", n)
        else:
            header.append(0x80 | 127)
            header += struct.pack(">Q", n)
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        with self._lock:
            self.sock.sendall(bytes(header) + mask + masked)

    def _reader(self):
        while True:
            try:
                opcode, data = self._read_frame()
            except Exception:
                break
            if opcode == 0x8:  # close
                break
            if opcode in (0x1, 0x2):  # text/binary
                self.on_message(data)

    def _read_frame(self):
        # primer byte
        b1 = self.sock.recv(1)
        if not b1:
            raise ConnectionError("cerrado")
        first = b1[0]
        opcode = first & 0x0F
        b2 = self.sock.recv(1)[0]
        masked = bool(b2 & 0x80)
        length = b2 & 0x7F
        if length == 126:
            length = struct.unpack(">H", self._recv_exact(2))[0]
        elif length == 127:
            length = struct.unpack(">Q", self._recv_exact(8))[0]
        mask = b""
        if masked:
            mask = self._recv_exact(4)
        payload = self._recv_exact(length)
        if masked:
            payload = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        return opcode, payload

    def _recv_exact(self, n):
        data = b""
        while len(data) < n:
            chunk = self.sock.recv(n - len(data))
            if not chunk:
                raise ConnectionError("cerrado")
            data += chunk
        return data

    def send(self, data: dict):
        self._send_frame(json.dumps(data).encode())

    def on_message(self, data):
        # lo sobrescribe el driver
        pass

    def close(self):
        try:
            self.sock.close()
        except Exception:
            pass


class Chrome:
    """Lanza Chrome headless con debugging y da acceso a un target."""

    def __init__(self, port=9222, user_data=None):
        self.port = port
        self.user_data = user_data or os.path.join(os.environ["TEMP"], "dchrome")
        os.makedirs(self.user_data, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                CHROME,
                "--headless=new",
                "--disable-gpu",
                "--no-sandbox",
                "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding",
                "--disable-backgrounding-occluded-windows",
                "--remote-debugging-port=%d" % port,
                "--user-data-dir=" + self.user_data,
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        time.sleep(1.5)

    def targets(self):
        import json as J
        with urllib.request.urlopen(f"http://localhost:{self.port}/json") as r:
            return J.loads(r.read().decode())

    def page_ws(self, kind="page"):
        for t in self.targets():
            if t["type"] == kind:
                return t["webSocketDebuggerUrl"]
        return None

    def close(self):
        try:
            self.proc.terminate()
        except Exception:
            pass


class Session:
    """Conexion a un target + helpers CDP sincronos."""

    def __init__(self, ws_url, timeout=60):
        self.ws = WebSocketClient(ws_url, timeout)
        self.id = 0
        self._pending = {}
        self._events = []
        self.errors = []
        self.ws.on_message = self._on_message
        # espera para que el reader arranque
        self.ready()

    def _on_message(self, data):
        try:
            msg = json.loads(data.decode())
        except Exception:
            return
        if "id" in msg:
            self._pending.pop(msg["id"], None)
            self._events.append(("result", msg))
        elif "method" in msg:
            if msg["method"] == "Runtime.exceptionThrown":
                try:
                    self.errors.append(msg["params"]["exceptionDetails"].get("text", "?"))
                except Exception:
                    pass
            if msg["method"] == "Runtime.consoleAPICalled":
                try:
                    args = msg["params"]["args"]
                    txt = " ".join(a.get("value", a.get("description", "")) for a in args)
                    if msg["params"]["type"] == "error":
                        self.errors.append(txt)
                except Exception:
                    pass
            self._events.append(("event", msg))

    def get_errors(self):
        errs = list(self.errors)
        self.errors = []
        return errs

    def ready(self):
        time.sleep(0.3)

    def send(self, method, params=None):
        self.id += 1
        mid = self.id
        self._events.clear()
        self.ws.send({"id": mid, "method": method, "params": params or {}})
        deadline = time.time() + 30
        while time.time() < deadline:
            for tag, msg in list(self._events):
                if tag == "result" and msg["id"] == mid:
                    self._events.remove((tag, msg))
                    if "error" in msg:
                        raise RuntimeError(f"CDP error {method}: {msg['error']}")
                    return msg.get("result", {})
            time.sleep(0.02)
        raise TimeoutError(f"CDP timeout {method}")

    def enable_runtime(self):
        self.send("Runtime.enable")
        self.send("Page.enable")

    def navigate(self, url):
        # espera load event
        self.send("Page.navigate", {"url": url})
        deadline = time.time() + 30
        while time.time() < deadline:
            for tag, msg in list(self._events):
                if tag == "event" and msg.get("method") == "Page.loadEventFired":
                    return
            time.sleep(0.05)

    def evaluate(self, expr, await_promise=True):
        res = self.send(
            "Runtime.evaluate",
            {"expression": expr, "awaitPromise": await_promise, "returnByValue": True},
        )
        val = res.get("result", {}).get("value")
        if res.get("exceptionDetails"):
            raise RuntimeError(f"JS error: {res['exceptionDetails']}")
        return val

    def js(self, expr, await_promise=False):
        return self.evaluate(expr, await_promise=await_promise)

    def wait_selector(self, selector, timeout=30):
        deadline = time.time() + timeout
        while time.time() < deadline:
            if self.js(f"!!document.querySelector({json.dumps(selector)})"):
                return True
            time.sleep(0.05)
        raise TimeoutError(f"selector no aparecio: {selector}")

    def click(self, selector):
        self.js(
            f"(()=>{{const e=document.querySelector({json.dumps(selector)});if(!e)throw new Error('no el');"
            f"e.click();return true;}})()"
        )

    def click_index(self, selector, index):
        self.js(
            f"(()=>{{const es=document.querySelectorAll({json.dumps(selector)});"
            f"const e=es[{index}];if(!e)throw new Error('no el '+{index});"
            f"e.click();return true;}})()"
        )

    def click_by_text(self, selector, text, index=0):
        """Hace clic en el elemento `selector` cuyo textContent contiene `text`."""
        return self.js(
            f"(()=>{{const es=[...document.querySelectorAll({json.dumps(selector)})]"
            f".filter(e=>e.textContent.trim().includes({json.dumps(text)}));"
            f"const e=es[{index}];if(!e)throw new Error('no match text '+{json.dumps(text)});"
            f"e.click();return true;}})()"
        )

    def count(self, selector):
        return self.js(f"document.querySelectorAll({json.dumps(selector)}).length")

    def wait_text_button(self, container, text, timeout=20):
        """Espera a que exista un button dentro de `container` cuyo texto incluya
        `text`, y le hace clic. Devuelve True."""
        deadline = time.time() + timeout
        while time.time() < deadline:
            found = self.js(
                f"(function(){{let hit=false;"
                f"document.querySelectorAll({json.dumps(container)}).forEach(c=>{{"
                f"c.querySelectorAll('button').forEach(b=>{{"
                f"if(b.textContent.includes({json.dumps(text)})){{b.click();hit=true;}}}});"
                f"}});return hit;}})()"
            )
            if found:
                return True
            time.sleep(0.3)
        raise TimeoutError(f"no aparecio button '{text}' en {container}")

    def button_disabled_by_text(self, container, text):
        return self.js(
            f"(function(){{let d=null;"
            f"document.querySelectorAll({json.dumps(container)}).forEach(c=>{{"
            f"c.querySelectorAll('button').forEach(b=>{{"
            f"if(b.textContent.includes({json.dumps(text)}))d=!!b.disabled;}});"
            f"}});return d;}})()"
        )

    def exists(self, selector):
        return self.js(f"!!document.querySelector({json.dumps(selector)})")

    def body_text(self):
        return self.js("document.getElementById('app').innerText")

    def set_value(self, selector, value):
        self.js(
            f"(()=>{{const e=document.querySelector({json.dumps(selector)});if(!e)throw new Error('no input');"
            f"const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;"
            f"setter.call(e,{json.dumps(value)});e.dispatchEvent(new Event('input',{{bubbles:true}}));return true;}})()"
        )

    def teardown(self):
        try:
            self.ws.close()
        except Exception:
            pass
