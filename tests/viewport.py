"""Respnsive: verifica que no haya scroll horizontal en resoluciones de aula."""
import sys, os, time, json
sys.path.insert(0, os.path.dirname(__file__))
from cdp import Chrome, Session

BASE = "http://localhost:8321/index.html"
WIDTHS = [1920, 1366, 1280, 1024, 820]
RESULTS = []


def report(name, ok):
    RESULTS.append((name, ok))
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")


def main():
    chrome = Chrome(port=9233)
    try:
        s = Session(chrome.page_ws())
        s.enable_runtime()
        for w in WIDTHS:
            h = int(w * 9 / 16)
            s.send("Emulation.setDeviceMetricsOverride", {"width": w, "height": h, "deviceScaleFactor": 1, "mobile": False})
            s.navigate(BASE + f"?v={w}")
            s.wait_selector(".screen.boot", timeout=20)
            # ir a fase1 para comprobar el layout de la fase
            s.wait_selector(".screen.warning", timeout=15)
            time.sleep(0.6)
            s.click(".btn-start")
            s.wait_selector(".screen.phase1", timeout=15)
            overflow = s.js("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            report(f"{w}x{h} fase1 sin scroll horizontal", not overflow)
        s.teardown()
    finally:
        chrome.close()
    passed = sum(1 for _, k in RESULTS if k)
    print(f"\nRespnsive: {passed}/{len(RESULTS)}")
    return 1 if passed == len(RESULTS) else 0


if __name__ == "__main__":
    sys.exit(main())
