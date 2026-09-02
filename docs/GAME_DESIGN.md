# Diseño del juego — Cyber Escape Room

## Filosofía
Experiencia tipo misión, no examen. Refuerza: contener, proteger, identificar ingeniería social, rechazar solicitudes sospechosas, usar autenticación adicional, mantener respaldos y recuperar.

Concepto: **DETECTAR → CONTENER → PROTEGER → RECUPERAR**

## Fases y objetivos pedagógicos

### Arranque (boot)
- Simula un inicio normal "TECSUP Secure Workspace" (≈2 s) para contrastar la calma inicial con la alerta que llega después.
- Mecánica: pantalla de arranque con estados "OK" que se auto-avanza.

### Fase 0 — Advertencia
- Objetivo: generar conciencia de que existe una amenaza simulada y encuadrar el ejercicio como seguro.
- Mecánica: pantalla de alerta con pulsos controlados y botón "INICIAR RESPUESTA AL INCIDENTE".
- Tras pulsar, muestra una transición "INICIANDO PROTOCOLO DE RESPUESTA..." (terminal) que conduce a la Fase 1.
- Regla: no se puede omitir el aviso de simulación.

### Fase 1 — Contención (construcción de secuencia)
- Objetivo: el orden correcto ante una amenaza es **primero cortar el acceso**, luego renovar credenciales y finalmente añadir autenticación adicional.
- Mecánica: construir una secuencia de 3 pasos tocando tarjetas (orden visual aleatorio), con slots PASO 1..3, botón EJECUTAR PROTOCOLO y "Limpiar".
- Regla: fallo de secuencia → GAME OVER (terminal simulada con feedback correctivo).
- Resultado esperado: Bloquear accesos → Cambiar contraseñas → Activar verificación.

### Fase 2 — Ingeniería social (confiar / desconfiar)
- Objetivo: reconocer señales de ingeniería social y rechazar solicitudes sospechosas (especialmente códigos OTP).
- Mecánica:
  - Chat corporativo del "External IT Support" (izquierda) + interfaz SO con un enlace sospechoso simulado (derecha).
  - Decisión: **CONFÍO EN EL SOPORTE** o **DESCONFÍO DE LA SOLICITUD**.
  - Confiar → el enlace abre un modal con un código de 6 dígitos (local y simulado); entregarlo en el chat → GAME OVER (pop-ups internos).
  - Desconfiar → identificar **exactamente** las señales correctas de cada mensaje.
- 3 intentos con mensajes que cambian las señales (amable → insistente → amenaza).
- Regla:
  - Entregar el código → GAME OVER.
  - Fallar señales en el intento 3 → GAME OVER.
  - Fallar en intentos 1-2 → pasa al siguiente intento.
  - Acertar los 3 → se bloquea el contacto y se baja la amenaza.
- Resultado esperado: rechazar los 3 intentos identificando las señales correctas de cada mensaje.

### Fase 3 — Recuperación
- Objetivo: los respaldos deben existir ANTES del incidente y estar separados del equipo principal.
- Mecánica: análisis de integridad animado, pérdida de 2 archivos y pregunta por el respaldo.
- Escenarios:
  - Nube → seleccionar LOS DOS archivos en el respaldo y restablecer con una barra de progreso → continúa.
  - Mismo equipo → pregunta de opción múltiple (correcta: A) con feedback educativo → continúa.
  - No tengo respaldo → pregunta de opción múltiple (correcta: antes) + **validación del docente** → continúa.
- La validación del docente es un botón discreto que abre un campo de código; solo se ofrece en el camino sin respaldo.

### Fase 4 — Restauración final
- Objetivo: cerrar el ciclo visualizando la restauración completa del sistema.
- Mecánica: terminal de restauración que desfila filas "OK" y un botón FINALIZAR → victoria.

## Final y debrief
- Victoria → informe "INCIDENTE RESUELTO" → botón "VER INFORME DE MISIÓN" → debrief de 4 fases (Detectar → Contener → Proteger → Recuperar) → "MISIÓN FINALIZADA" → "NUEVA SIMULACIÓN" reinicia.
