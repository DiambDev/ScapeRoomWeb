"""Smoke test del flujo inicial: boot -> warning -> transition -> fase1."""
import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))
from cdp import Chrome, Session  # noqa: E402

BASE = "http://localhost:8321/index.html"
PASS = 0
FAIL = 0


def check(name, cond):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  PASS  {name}")
    else:
        FAIL += 1
        print(f"  FAIL  {name}")


def main():
    chrome = Chrome(port=9223)
    try:
        ws = chrome.page_ws()
        if not ws:
            print("No se encontro target de pagina")
            return 2
        s = Session(ws)
        s.enable_runtime()
        s.navigate(BASE)
        time.sleep(1.0)

        check("boot visible", s.js("!!document.querySelector('.screen.boot')"))
        check("boot titulo TECSUP",
              s.js("document.body.textContent.includes('TECSUP Secure Workspace')"))

        s.wait_selector(".screen.warning", timeout=15)
        check("warning visible tras boot", True)
        check("warning titulo comprometida",
              s.js("document.body.textContent.includes('TU COMPUTADORA ESTÁ COMPROMETIDA')"))

        time.sleep(0.6)
        s.click(".btn-cta")
        s.wait_selector(".screen.transition", timeout=10)
        check("transition visible", True)
        check("transition titulo",
              s.js("document.body.textContent.includes('INICIANDO PROTOCOLO DE RESPUESTA')"))

        s.wait_selector(".screen.phase1", timeout=15)
        check("fase1 visible", True)
        check("fase1 titulo CONTENER",
              s.js("document.body.textContent.includes('CONTENER LA AMENAZA')"))
        check("fase1 construccion slots",
              s.js("document.querySelectorAll('.seq-slot').length === 3"))
        check("fase1 tarjetas acciones",
              s.js("document.querySelectorAll('.action-card').length === 3"))
        check("statusbar presente",
              s.js("!!document.querySelector('.statusbar')"))

        s.teardown()
    finally:
        chrome.close()

    print(f"\nSmoke: PASS={PASS} FAIL={FAIL}")
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
