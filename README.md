# Cyber Escape Room — Simulación Educativa de Respuesta ante Incidentes

Aplicación web educativa tipo "Escape Room Virtual" para una clase de **Seguridad Informática**.
El estudiante debe recuperar el control de un sistema aparentemente comprometido mediante una
experiencia interactiva. Refuerza: **contener, proteger, identificar ingeniería social, rechazar
solicitudes sospechosas, usar autenticación adicional, mantener respaldos y recuperar**.

> **IMPORTANTE: TODO ES UNA SIMULACIÓN.** La aplicación no modifica archivos, no ejecuta comandos,
> no abre terminales reales, no solicita credenciales y no almacena información sensible. Todos los
> elementos de "terminal", "hackeo", "pop-ups" y "archivos" son HTML/CSS/JS dentro de la propia página.

## Objetivo educativo
Practicar qué hacer frente a una amenaza real:

**DETECTAR → CONTENER → PROTEGER → RECUPERAR**

## Stack
- HTML + CSS + JavaScript vanilla (módulos ES nativos).
- Sin framework, sin build step, sin dependencias de terceros.
- Despliegue directo a **GitHub Pages**.

## Estructura
```
index.html
assets/css/        (base, layout, components, animations, features)
src/
  main.js          (bootstrap)
  core/            (state, game, random)
  screens/         (boot, warning, transition, phase1..phase4,
                    gameover, victory, debrief, screenManager)
  components/      (chat, pop-ups, statusbar)
  data/            (contenido editable por el docente)
  utils/           (dom, timers)
tests/             (QA automatizado con Chrome headless, no requerido en producción)
docs/              (ARCHITECTURE, GAME_DESIGN, TEST_PLAN, SECURITY)
```

## Instalación
No requiere instalación de dependencias.

## Ejecución local
Los módulos ES requieren un servidor local (restricción de CORS del navegador):

- **VS Code Live Server**: botón derecho sobre `index.html` → "Open with Live Server".
- **Python**: `python -m http.server 8000` y abrir `http://localhost:8000/`.

No uses rutas `file://` directamente con módulos ES.

## Construcción
No hay proceso de build. La versión desplegable es la propia raíz del repositorio.

## Despliegue en GitHub Pages
1. Sube el repositorio a GitHub (rama `main` o `gh-pages`).
2. En el repositorio: **Settings → Pages → Source**: selecciona la rama y carpeta `/ (root)`.
3. La app queda en `https://<usuario>.github.io/<repositorio>/`.

Las rutas son **relativas** y funcionan bajo el subdirectorio de GitHub Pages sin cambios.

## Cómo modificar preguntas y mensajes
Todo el contenido editable está en `src/data/`:
- `config.js`: código docente, nombre del contacto y duración de secuencias automáticas.
- `fase1.js`: acciones y orden correcto de la secuencia de la Fase 1.
- `fase2.js`: mensajes, señales correctas por intento y textos del chat.
- `fase3.js`: textos, opciones, feedback y validación docente de la Fase 3.
- `gameOver.js`: boot, advertencia, transición, game over, victoria y debrief.

Edita estos archivos y vuelve a subir; no se requiere recompilar.

## Sección del docente
La actividad incluye un mecanismo de validación que el docente puede usar para desbloquear
la continuación en el escenario "sin respaldo". El código está en `src/data/config.js`
(`docenteCodigo`, por defecto `TECSUP-2026`).

> **Nota de seguridad (importante):** como el código viaja en una página 100% estática
> (GitHub Pages), es **inspeccionable** en el navegador (Herramientas de desarrollo →
> *Sources*). No es un secreto real: es un mecanismo pedagógico para la dinámica de aula.
> No lo uses para proteger nada real.

## QA automatizado
La carpeta `tests/` contiene un harness que recorre la aplicación con **Chrome headless**
(driver CDP propio, sin dependencias). No es necesario para el despliegue.
Ejecuta el servidor local y luego:
```
python -m http.server 8321            # desde la raíz del proyecto
python tests\qa.py                     # 20 escenarios de la batería
```
Requiere Python y Chrome instalados. Ver `docs/TEST_PLAN.md`.

## Cómo reiniciar
Cada pantalla de GAME OVER y la pantalla final "MISIÓN FINALIZADA" permiten volver a empezar;
restablecen por completo el estado, temporizadores, pop-ups y animaciones, y regeneran los
elementos aleatorios (orden de acciones, señales, códigos). También puedes recargar la página.

## Limitaciones
- Es una simulación sin ningún efecto sobre el sistema real del estudiante.
- Los códigos y "verificaciones" son ficticios y solo con fines didácticos.

## Advertencia
Toda la actividad es una **simulación educativa con fines de aprendizaje**, aprobada para su uso
en el aula. No representa ninguna amenaza real para el equipo.
