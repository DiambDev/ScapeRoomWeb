"""QA automatizado de la simulacion Cyber Escape Room (20 escenarios).

Reutiliza una sola instancia de Chrome y recarga la pagina antes de cada
escenario para garantizar un estado limpio (el modulo se reinicia al recargar).
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))
from cdp import Chrome, Session  # noqa: E402

BASE = "http://localhost:8321/index.html"

RESULTS = []

# señales correctas por intento (idempotente con src/data/fase2.js)
CORRECT_SIGNALS = [
    ["URGENCIA", "ENLACE", "SOLICITUD DE CÓDIGO", "IDENTIFICACIÓN DEL USUARIO"],
    ["URGENCIA", "ENLACE", "SOLICITUD DE CÓDIGO", "PRESIÓN", "AMENAZA"],
    ["URGENCIA", "SOLICITUD DE CÓDIGO", "AMENAZA", "PRESIÓN", "HORA"],
]
FASE1_OK = ["Bloquear accesos", "Cambiar contraseñas", "Activar códigos de verificación"]
FASE1_ERR = ["Cambiar contraseñas", "Bloquear accesos", "Activar códigos de verificación"]


def report(name, cond, detail=""):
    RESULTS.append((name, bool(cond)))
    tag = "PASS" if cond else "FAIL"
    print(f"  [{tag}] {name}" + (f"  -- {detail}" if detail else ""))


def settle(t=0.6):
    time.sleep(t)


def reload(s, n):
    s.navigate(f"{BASE}?scenario={n}")
    s.wait_selector(".screen.boot", timeout=25)


def to_fase1(s, n):
    reload(s, n)
    s.wait_selector(".screen.warning", timeout=15)
    settle(0.6)
    s.click(".btn-start")
    s.wait_selector(".screen.phase1", timeout=20)


def click_fase1(s, labels):
    for lab in labels:
        s.click_by_text(".action-card", lab)
        settle(0.1)
    settle(0.4)


def usar_señales(s, seleccion):
    s.click_by_text(".decision-btns button", "DESCONFÍO")
    s.wait_selector(".signal-chip", timeout=10)
    settle(0.3)
    for chip in seleccion:
        s.click_by_text(".signal-chip", chip)
        settle(0.05)
    settle(0.3)
    s.click(".confirm-signals")


def desconfiar_correcto(s):
    for i in range(3):
        s.wait_selector(".screen.phase2", timeout=15)
        settle(0.6)
        usar_señales(s, CORRECT_SIGNALS[i])
        if i < 2:
            s.wait_selector(".screen.phase2", timeout=12)
    s.wait_selector(".screen.phase3", timeout=12)


def desconfiar_todas_erroneas(s):
    for i in range(3):
        s.wait_selector(".screen.phase2", timeout=15)
        settle(0.6)
        usar_señales(s, [])  # selección vacía = incorrecta
        if i < 2:
            s.wait_selector(".screen.phase2", timeout=12)
    s.wait_selector(".screen.game-over", timeout=12)


def main():
    chrome = Chrome(port=9230)
    try:
        s = Session(chrome.page_ws())
        s.enable_runtime()
        sc = {"n": 0}

        def nxt():
            sc["n"] += 1
            return sc["n"]

        # ---------- 1. Camino feliz completo ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            desconfiar_correcto(s)
            # fase3 -> nube
            s.wait_selector(".respaldo-card", timeout=20)
            settle(0.4)
            s.click_by_text(".respaldo-card", "nube")
            s.wait_selector(".screen.phase3", timeout=10)
            settle(0.4)
            s.click_by_text(".respaldo-card", "Tarea1.backup")
            settle(0.1)
            s.click_by_text(".respaldo-card", "Tesis1.backup")
            settle(0.2)
            s.click_by_text(".recovery button", "RESTAURAR ARCHIVOS")
            s.wait_text_button(".recovery", "CONTINUAR", timeout=8)
            s.wait_selector(".screen.phase4", timeout=12)
            s.wait_selector(".final-ready", timeout=20)
            settle(0.4)
            s.click_by_text(".final-ready button", "FINALIZAR")
            s.wait_selector(".screen.victory", timeout=15)
            report("1. Camino feliz -> victory", s.exists(".screen.victory"))

            settle(0.6)
            s.click_by_text("button", "VER INFORME DE MISIÓN")
            s.wait_selector(".screen.debrief", timeout=10)
            report("1b. victory -> debrief", s.exists(".screen.debrief"))

            settle(0.5)
            s.click_by_text(".debrief button", "FINALIZAR")
            s.wait_selector(".screen.finish", timeout=10)
            report("1c. debrief -> finish", s.exists(".screen.finish"))

            settle(0.5)
            s.click_by_text(".finish button", "NUEVA SIMULACIÓN")
            s.wait_selector(".screen.boot", timeout=10)
            report("1d. finish -> boot", s.exists(".screen.boot"))
        except Exception as e:
            report("1. Camino feliz", False, str(e))

        # ---------- 2. Fase1 orden incorrecto -> game over + retry ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_ERR)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.game-over", timeout=12)
            report("2a. Fase1 error -> game over", s.exists(".screen.game-over"))
            report("2b. texto SISTEMA COMPROMETIDO", "SISTEMA COMPROMETIDO" in s.body_text())
            settle(0.5)
            s.click_by_text("button", "REINICIAR SIMULACIÓN")
            s.wait_selector(".screen.boot", timeout=10)
            report("2c. retry -> boot", s.exists(".screen.boot"))
        except Exception as e:
            report("2. Fase1 error", False, str(e))

        # ---------- 3. Fase2 confiar + entregar codigo -> game over ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            settle(0.6)
            s.click_by_text(".decision-btns button", "CONFÍO")
            s.wait_selector(".qa-block .text-input", timeout=10)
            settle(0.3)
            s.set_value(".qa-block .text-input", "123456")
            settle(0.2)
            s.click_by_text(".qa-block button", "ENVIAR CÓDIGO")
            s.wait_selector(".screen.game-over", timeout=12)
            report("3a. confiar+entregar -> game over", s.exists(".screen.game-over"))
            report("3b. popup-layer presente", s.exists(".popup-layer"))
            settle(2.5)
            s.click(".go-retry")
            s.wait_selector(".screen.boot", timeout=10)
            report("3c. retry popups -> boot", s.exists(".screen.boot"))
        except Exception as e:
            report("3. confiar codigo", False, str(e))

        # ---------- 4. Fase2 señales erroneas x3 -> game over ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            desconfiar_todas_erroneas(s)
            report("4. 3 señales erroneas -> game over", s.exists(".screen.game-over"))
        except Exception as e:
            report("4. señales erroneas x3", False, str(e))

        # ---------- 5. Fase2 fallo en intento 1 -> pasa al intento 2 ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            settle(0.6)
            usar_señales(s, [])
            s.wait_selector(".screen.phase2", timeout=12)
            txt = s.body_text()
            report("5. fallo intento1 -> intento2", "INTENTO 2" in txt)
        except Exception as e:
            report("5. fallo intento1", False, str(e))

        # ---------- 6. Fase2 acierto intento1 -> intento2 ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            settle(0.6)
            usar_señales(s, CORRECT_SIGNALS[0])
            s.wait_selector(".screen.phase2", timeout=12)
            report("6. acierto intento1 -> intento2", "INTENTO 2" in s.body_text())
        except Exception as e:
            report("6. acierto intento1", False, str(e))

        # ---------- 7. Fase3 mismo equipo (respuesta correcta) ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            desconfiar_correcto(s)
            s.wait_selector(".respaldo-card", timeout=20)
            settle(0.4)
            s.click_by_text(".respaldo-card", "mismo")
            s.wait_selector(".screen.phase3", timeout=10)
            settle(0.4)
            s.click_by_text(".qa-options .btn-ghost", "A.")
            settle(0.4)
            report("7a. mismo respuesta A -> feedback ok", "Correcto" in s.body_text() or "correcto" in s.body_text().lower())
            s.click_by_text(".recovery button", "CONTINUAR")
            s.wait_selector(".screen.phase4", timeout=12)
            s.wait_selector(".final-ready", timeout=20)
            settle(0.4)
            s.click_by_text(".final-ready button", "FINALIZAR")
            s.wait_selector(".screen.victory", timeout=15)
            report("7b. mismo -> victory", s.exists(".screen.victory"))
        except Exception as e:
            report("7. mismo equipo", False, str(e))

        # ---------- 8. Fase3 sin respaldo (docente) ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            desconfiar_correcto(s)
            s.wait_selector(".respaldo-card", timeout=20)
            settle(0.4)
            s.click_by_text(".respaldo-card", "No tengo respaldo")
            s.wait_selector(".screen.phase3", timeout=10)
            settle(0.4)
            s.click_by_text(".qa-options .btn-ghost", "Antes de")
            settle(0.4)
            s.click_by_text("button", "VALIDACIÓN DEL DOCENTE")
            s.wait_selector(".docente-form", timeout=10)
            settle(0.3)
            s.set_value(".docente-form .text-input", "0000")
            s.click_by_text(".docente-form button", "VALIDAR")
            settle(0.3)
            report("8a. codigo docente incorrecto -> error", "incorrecto" in s.body_text().lower())
            s.set_value(".docente-form .text-input", "TECSUP-2026")
            s.click_by_text(".docente-form button", "VALIDAR")
            settle(0.3)
            report("8b. codigo docente correcto -> ok", "válido" in s.body_text().lower() or "valido" in s.body_text().lower())
            s.click_by_text(".docente-form button", "CONTINUAR")
            s.wait_selector(".screen.phase4", timeout=12)
            s.wait_selector(".final-ready", timeout=20)
            settle(0.4)
            s.click_by_text(".final-ready button", "FINALIZAR")
            s.wait_selector(".screen.victory", timeout=15)
            report("8c. sin respaldo -> victory", s.exists(".screen.victory"))
        except Exception as e:
            report("8. sin respaldo", False, str(e))

        # ---------- 9. Fase3 nube: requerir AMBOS archivos ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            desconfiar_correcto(s)
            s.wait_selector(".respaldo-card", timeout=20)
            settle(0.4)
            s.click_by_text(".respaldo-card", "nube")
            s.wait_selector(".screen.phase3", timeout=10)
            settle(0.4)
            # solo 1 archivo -> restaurar debe estar deshabilitado
            s.click_by_text(".respaldo-card", "Tarea1.backup")
            settle(0.2)
            restore_disabled = s.button_disabled_by_text(".recovery", "RESTAURAR")
            report("9. con 1 archivo RESTAURAR deshabilitado", restore_disabled is True)
        except Exception as e:
            report("9. nube ambos archivos", False, str(e))

        # ---------- 10. Codigo requiere 6 digitos ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            settle(0.6)
            s.click_by_text(".decision-btns button", "CONFÍO")
            s.wait_selector(".qa-block .text-input", timeout=10)
            settle(0.3)
            s.set_value(".qa-block .text-input", "123")
            s.click_by_text(".qa-block button", "ENVIAR CÓDIGO")
            settle(0.4)
            still_phase2 = s.exists(".screen.phase2")
            has_error = "6 dígitos" in s.body_text()
            report("10. codigo de 3 digitos -> rechazado en fase2", still_phase2 and has_error)
        except Exception as e:
            report("10. codigo 6 digitos", False, str(e))

        # ---------- 11. HUD fase1 ----------
        try:
            to_fase1(s, nxt())
            txt = s.body_text()
            report("11. HUD fase1 CRÍTICA + FASE 1", "CRÍTICA" in txt and "FASE 1" in txt and "INC-042" in txt)
        except Exception as e:
            report("11. HUD fase1", False, str(e))

        # ---------- 12. HUD fase2 ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            txt = s.body_text()
            report("12. HUD fase2 ALTA + INGENIERÍA", "ALTA" in txt and "INGENIERÍA SOCIAL" in txt)
        except Exception as e:
            report("12. HUD fase2", False, str(e))

        # ---------- 13. HUD fase3 ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            desconfiar_correcto(s)
            s.wait_selector(".respaldo-card", timeout=20)
            txt = s.body_text()
            report("13. HUD fase3 CONTROLADA", "CONTROLADA" in txt)
        except Exception as e:
            report("13. HUD fase3", False, str(e))

        # ---------- 14. HUD fase4 ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            desconfiar_correcto(s)
            s.wait_selector(".respaldo-card", timeout=20)
            settle(0.4)
            s.click_by_text(".respaldo-card", "nube")
            s.wait_selector(".screen.phase3", timeout=10)
            settle(0.4)
            s.click_by_text(".respaldo-card", "Tarea1.backup")
            settle(0.1)
            s.click_by_text(".respaldo-card", "Tesis1.backup")
            settle(0.2)
            s.click_by_text(".recovery button", "RESTAURAR ARCHIVOS")
            s.wait_text_button(".recovery", "CONTINUAR", timeout=8)
            s.wait_selector(".screen.phase4", timeout=12)
            txt = s.body_text()
            report("14. HUD fase4 RESTAURACIÓN", "RESTAURACIÓN" in txt and "DESCENSO" in txt)
        except Exception as e:
            report("14. HUD fase4", False, str(e))

        # ---------- 15. Doble clic EJECUTAR no salta fase2 ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            # doble clic sobre el MISMO elemento (simula doble clic real)
            s.js("(function(){const b=document.querySelector('.seq-execute');b.click();b.click();return true;})()")
            s.wait_selector(".screen.phase2", timeout=12)
            report("15. doble clic EJECUTAR -> fase2 (no salta)", s.exists(".screen.phase2"))
        except Exception as e:
            report("15. doble clic ejecutar", False, str(e))

        # ---------- 16. Reset desde game over fase1 -> boot limpio ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_ERR)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.game-over", timeout=12)
            settle(0.4)
            s.click_by_text("button", "REINICIAR SIMULACIÓN")
            s.wait_selector(".screen.boot", timeout=10)
            clean = s.count(".screen") == 1 and s.count("[data-popup]") == 0 and s.count("[data-overlay]") == 0
            report("16. reset gameover -> boot sin residuos", s.exists(".screen.boot") and clean)
        except Exception as e:
            report("16. reset gameover", False, str(e))

        # ---------- 17. Reset desde game over codigo -> sin popups ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            settle(0.6)
            s.click_by_text(".decision-btns button", "CONFÍO")
            s.wait_selector(".qa-block .text-input", timeout=10)
            settle(0.3)
            s.set_value(".qa-block .text-input", "123456")
            s.click_by_text(".qa-block button", "ENVIAR CÓDIGO")
            s.wait_selector(".screen.game-over", timeout=12)
            # reset antes de que terminen los popups (inmediato)
            settle(0.3)
            s.click(".go-retry")
            s.wait_selector(".screen.boot", timeout=10)
            clean = s.count("[data-popup]") == 0 and s.count("[data-overlay]") == 0
            report("17. reset popups -> boot sin residuos", clean)
        except Exception as e:
            report("17. reset codigo", False, str(e))

        # ---------- 18. Retry desde game over codigo (despues de popups) ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            settle(0.6)
            s.click_by_text(".decision-btns button", "CONFÍO")
            s.wait_selector(".qa-block .text-input", timeout=10)
            settle(0.3)
            s.set_value(".qa-block .text-input", "123456")
            s.click_by_text(".qa-block button", "ENVIAR CÓDIGO")
            s.wait_selector(".screen.game-over", timeout=12)
            settle(3.0)
            s.click(".go-retry")
            s.wait_selector(".screen.boot", timeout=10)
            report("18. retry tras popups -> boot", s.exists(".screen.boot"))
        except Exception as e:
            report("18. retry popups", False, str(e))

        # ---------- 19. Fase1 comienza correctamente (slots + ejecutar deshabilitado) ----------
        try:
            to_fase1(s, nxt())
            slots3 = s.count(".seq-slot") == 3
            tarjetas3 = s.count(".action-card") == 3
            exec_disabled = s.js("document.querySelector('.seq-execute').disabled === true")
            report("19. fase1 init (3 slots, 3 tarjetas, ejecutar off)",
                   slots3 and tarjetas3 and exec_disabled)
        except Exception as e:
            report("19. fase1 init", False, str(e))

        # ---------- 20. Fase2 exactamente 3 intentos (maximo respetado) ----------
        try:
            to_fase1(s, nxt())
            click_fase1(s, FASE1_OK)
            settle(0.3)
            s.click(".seq-execute")
            s.wait_selector(".screen.phase2", timeout=15)
            # acierta intento1 e intento2
            settle(0.6)
            usar_señales(s, CORRECT_SIGNALS[0])
            s.wait_selector(".screen.phase2", timeout=12)
            settle(0.6)
            usar_señales(s, CORRECT_SIGNALS[1])
            s.wait_selector(".screen.phase2", timeout=12)
            # ahora estamos en intento 3
            txt3 = s.body_text()
            report("20. intento 3 alcanzado", "INTENTO 3" in txt3)
        except Exception as e:
            report("20. 3 intentos", False, str(e))

        s.teardown()
    finally:
        chrome.close()

    passed = sum(1 for _, c in RESULTS if c)
    print(f"\n=== RESULTADO: {passed}/{len(RESULTS)} ===")
    return 1 if passed == len(RESULTS) else 0


if __name__ == "__main__":
    sys.exit(main())
