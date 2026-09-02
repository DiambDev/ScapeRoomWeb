# Plan de pruebas — Cyber Escape Room

Sin framework de tests (no hay Node), el QA es una batería automatizada que recorre la
interfaz real con **Chrome headless** (driver CDP propio, sin dependencias) más comprobaciones
manuales. El harness está en `tests/` (`cdp.py` + `qa.py`).

## Batería de QA (20 escenarios automatizados)

| # | Escenario | Resultado esperado |
|---|---|---|
| 1 | Camino feliz completo → victoria → debrief → "misión finalizada" → nueva simulación | Recorre todo el flujo correctamente |
| 1b/c/d | Victoria → debrief → finish → boot | Transiciones finales correctas |
| 2 | Fase 1 orden incorrecto | GAME OVER (terminal simulada) + retry → boot |
| 3 | Fase 2 confiar + entregar código | GAME OVER (pop-ups internos) + retry → boot |
| 4 | Fase 2 desconfiar con señales erróneas en los 3 intentos | GAME OVER (señales) |
| 5 | Fase 2 fallo en intento 1 | Pasa al intento 2 |
| 6 | Fase 2 acierto en intento 1 | Pasa al intento 2 |
| 7 | Fase 3 mismo equipo (respuesta correcta) | Feedback + continúa → victoria |
| 8 | Fase 3 sin respaldo (pregunta correcta + docente) | Validación docente (error y acierto) → victoria |
| 9 | Fase 3 nube con 1 solo archivo | Botón RESTAURAR deshabilitado (exige ambos) |
| 10 | Fase 2 código de 3 dígitos | Rechazado (exige 6 dígitos), no navega |
| 11 | HUD en Fase 1 | Inc-042, AMENAZA CRÍTICA, FASE 1 |
| 12 | HUD en Fase 2 | AMENAZA ALTA + INGENIERÍA SOCIAL |
| 13 | HUD en Fase 3 | AMENAZA CONTROLADA |
| 14 | HUD en Fase 4 | RESTAURACIÓN + EN DESCENSO |
| 15 | Doble clic en EJECUTAR PROTOCOLO | No salta Fase 2 (llega a fase2) |
| 16 | Reset desde GAME OVER (fase 1) | Boot limpio sin residuos |
| 17 | Reset desde GAME OVER (pop-ups) | Boot sin pop-ups/overlays residuales |
| 18 | Retry tras terminar pop-ups de compromiso | Boot correcto |
| 19 | Fase 1 inicialización | 3 slots, 3 tarjetas, EJECUTAR deshabilitado |
| 20 | Fase 2 máx. intentos | Se alcanza exactamente el intento 3 |

## Comprobaciones complementarias
- **`prefers-reduced-motion`**: animaciones casi nulas (`base.css`).
- **Resoluciones**: escritorio amplio, 1024, 820, y reducción de columnas en `layout.css`.
- **Sin secretos**: grep de tokens/claves/API keys = sin coincidencias (ver `SECURITY.md`).
- **Sin inyección**: solo `utils/dom.js` usa `textContent`; ningún screen pasa datos a `innerHTML`.

## Registro de ejecución
- Fecha: 2026-09-02
- Método: harness `tests/qa.py` sobre Chrome headless + servidor local (Python `http.server`),
  plus comprobaciones manuales de responsive y accesibilidad.
- Resultado: **APROBADO — 30/30 aserciones correctas** (los 20 escenarios, algunos con varios
  sub-checks) en la batería automatizada.
- Responsive: **5/5 PASS** (1920, 1366, 1280, 1024, 820 — sin scroll horizontal).
- Smoke: **11/11 PASS** (boot → warning → transition → fase1 + statusbar).
- Cómo re-ejecutar:
  - En la raíz del proyecto: `python -m http.server 8321`
  - `python tests\qa.py`
  - Requiere Python y Chrome instalados.
