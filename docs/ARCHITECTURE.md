# Arquitectura — Cyber Escape Room

## Stack
- HTML + CSS + JavaScript vanilla, con módulos ES nativos (`<script type="module">`).
- Sin framework, sin build step, sin dependencias de terceros. Despliegue directo a GitHub Pages.

## Motivación
- Máxima simplicidad para un proyecto educativo.
- GitHub Pages entrega estáticos sin compilar.
- El entorno no dispone de Node/npm, por lo que ningún stack con build es viable.
- Mantenimiento: modularidad ES sin herramientas.

## Estructura de módulos
| Carpeta | Responsabilidad |
|---|---|
| `src/core/state.js` | Máquina de estados pura (transiciones válidas). |
| `src/core/game.js` | GameEngine: lógica, validación, progresión, intentos, navegación (con debounce anti doble clic). Sin DOM. |
| `src/core/random.js` | Shuffle, código 6 dígitos, geometría de pop-ups. |
| `src/screens/*` | Render de cada pantalla + binding; delega decisiones a `Game`. |
| `src/components/*` | Chat, pop-ups, barra de estado persistente: piezas visuales reutilizables. |
| `src/data/*` | Contenido editable (mensajes, señales, respuestas, feedback, código docente). |
| `src/utils/dom.js` | Creación/limpieza de nodos. |
| `src/utils/timers.js` | Registro central de temporizadores para limpiarlos en el reinicio. |
| `assets/css/*` | Estética SOC comprometido, responsive, accesibilidad. |
| `src/main.js` | Bootstrap que ensambla ScreenManager + Game. |

## Modelo de estados
Estados: `boot → warning → transition → fase1 → fase2 → fase3 → recuperacion → fase4 → victoria → debrief`, con `game_over` accesible desde `fase1`, `fase2` y `recuperacion`. `reset` y `volverAlInicio()` llevan siempre a `boot`.

## Comunicación presentación-lógica
- Las pantallas nunca mutan el estado ni validan respuestas.
- `Game` es el único autor de decisiones y emite `onScreen(pantalla, data)`.
- `ScreenManager` registra renderers y muestra la pantalla; limpia pop-ups/overlays residuales en cada transición.

## Navegación y anti doble clic
- `Game._goto` usa un *debounce* temporal (300 ms): ignora navegaciones demasiado juntas (doble clic) pero permite las secuencias impulsadas por temporizadores (boot, transición, restauración).

## Reinicio
`Game.reset()` restablece todos los campos y llama a `onReset()`, que detiene pop-ups y limpia **todos** los temporizadores registrados (`clearAllTimers`). Cada screen de GAME OVER ofrece volver a empezar y la pantalla final "MISIÓN FINALIZADA" ofrece "NUEVA SIMULACIÓN" → `game.volverAlInicio()`.

## Decisiones clave
- El orden correcto de Fase 1 vive en `data/fase1.js`; la lógica solo mezcla el **orden visual** de las tarjetas, no la respuesta.
- Las señales correctas por intento viven en `data/fase2.js`; la validación compara conjuntos exactos.
- El código docente vive en `data/config.js` (`docenteCodigo`), sin función de seguridad real (documentado).
- El estado de amenaza se deriva de la fase (CRÍTICA → ALTA → CONTROLADA → EN DESCENSO) en `components/statusbar.js`.
- Rutas relativas en todo el código para funcionar bajo el subdirectorio de GitHub Pages.
