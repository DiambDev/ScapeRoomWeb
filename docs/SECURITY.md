# Revisión de seguridad — Cyber Escape Room

La aplicación es una **simulación educativa**. No realiza ninguna acción real sobre el sistema.

## Garantías implementadas
- **Sin acceso al filesystem**: no hay `fs`, File System API, ni manejo de archivos. Las rutas `C:\...` son texto dentro del DOM.
- **Sin ejecución de comandos**: no se usan `child_process`, `fetch` de recursos, ni APIs del sistema. La "terminal" es HTML/CSS.
- **Sin credenciales reales**: nunca se piden contraseñas ni códigos reales. El código de 6 dígitos se genera y muestra localmente con fines didácticos.
- **Sin navegación externa**: el enlace sospechoso es un `<button>` con `preventDefault` (no un `<a href>`); abre una ventana interna.
- **Sin ventanas reales**: los pop-ups son elementos del DOM (`position: fixed`), sin `window.open` ni APIs de pop-up del navegador.
- **Sin formularios que capturan datos**: no se envían datos a ningún servidor; no hay backend.
- **Sin secretos en el repositorio**: no hay tokens, claves ni credenciales. El único "código" es una constante interna de la actividad (`docenteCodigo` en `src/data/config.js`), con valor exclusivamente pedagógico.
- **Inyección de contenido mitigada** (verificado): `utils/dom.js` usa `textContent`/`createElement`, no concatenación de HTML. Ningún módulo de pantalla pasa datos de usuario a `innerHTML` (escaneo realizado sin coincidencias).
- **Sin permisos innecesarios**: el único contexto es una página estática.

## Auditoría realizada (2026-09-02)
- Grep de `password=`, `api_key`, `secret`, `token`, claves privadas → **sin coincidencias**.
- Grep de `innerHTML`, `eval`, `document.write`, `localStorage`, `fetch` → solo la utilidad `dom.js` (uso interno opcional, sin datos de usuario).
- El código docente vive en `src/data/config.js` y es **inspeccionable** por ser una app estática; documentado como no-secreto en el propio archivo y en el README.

## Restricciones cumplidas
No se implementa: keylogging, captura de credenciales, cifrado real, malware, descargas automáticas, comportamiento persistente, ni acceso a PowerShell/CMD real.

## Veredicto
Aprobado para uso educativo en aula. La experiencia es totalmente simulada y segura.
