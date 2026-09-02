// Contenido de pantallas globales: arranque, warnings, game-over, victoria, debrief.

// ---- ARRANQUE NORMAL (boot) ----
export const BOOT = {
  titulo: 'TECSUP Secure Workspace',
  subtitulo: 'Sistema operativo funcionando normalmente.',
  estados: [
    ['Sistema', 'OK'],
    ['Red', 'Conectada'],
    ['Cuenta', 'Activa'],
    ['Protección', 'Activa'],
  ],
};

// ---- DETECCIÓN DEL ATAQUE (warning) ----
export const WARNING = {
  alertaTitulo: 'ALERTA DE SEGURIDAD',
  linea1: 'Actividad maliciosa detectada.',
  linea2: 'Se detectó acceso no autorizado.',
  simulacion: 'SIMULACIÓN EDUCATIVA',
  textoPequeno:
    'Esta actividad simula un incidente de seguridad informática. No existe ningún riesgo real para este equipo.',
  instruccion: 'No cierres la pestaña durante la misión.',
  boton: 'INICIAR RESPUESTA AL INCIDENTE',
};

// ---- PROTOCOLO DE RESPUESTA (transition) ----
export const TRANSITION = {
  titulo: 'INICIANDO PROTOCOLO DE RESPUESTA...',
  lineas: [
    'Analizando accesos...',
    'Detectando sesiones activas...',
    'Protegiendo credenciales...',
    'Aislando incidente...',
  ],
};

// ---- GAME OVER POR CÓDIGO ----
export const GAME_OVER_CODIGO = {
  feedback:
    'Nunca compartas códigos de autenticación con otra persona. Estos códigos pueden permitir que alguien complete un acceso que tú no autorizaste.',
  popups: [
    'SESSION ERROR',
    'CREDENTIAL TOKEN EXPOSED',
    'ACCESS DENIED',
    'SECURITY CONTROL DISABLED',
    'SYSTEM COMPROMISED',
  ],
};

// ---- DEBRIEF / INFORME POST-INCIDENTE ----
export const DEBRIEF = {
  titulo: 'INFORME POST-INCIDENTE',
  items: [
    { titulo: '1 — DETECTAR', texto: 'Reconocer que existe actividad sospechosa.' },
    { titulo: '2 — CONTENER', texto: 'Evitar que el atacante mantenga acceso.' },
    { titulo: '3 — PROTEGER', texto: 'Actualizar credenciales y añadir mecanismos de seguridad.' },
    { titulo: '4 — RECUPERAR', texto: 'Utilizar respaldos para restaurar información.' },
  ],
  cadena: 'DETECTAR → CONTENER → PROTEGER → RECUPERAR',
  mensaje:
    'Un incidente no termina cuando bloqueas al atacante. Termina cuando recuperas el control y puedes continuar trabajando de forma segura.',
  boton: 'FINALIZAR',

  // Pantalla posterior "MISIÓN FINALIZADA"
  finalTitulo: 'MISIÓN FINALIZADA',
  finalMensaje: 'Buen trabajo, operador.',
  finalCredito: 'Actividad educativa — Tecsup',
  nuevaSimulacion: 'NUEVA SIMULACIÓN',
};

// ---- VICTORIA ----
export const VICTORY = {
  titulo: 'INCIDENTE RESUELTO',
  informe: [
    ['Estado del sistema', 'PROTEGIDO'],
    ['Accesos maliciosos', 'BLOQUEADOS'],
    ['Ingeniería social', 'RECHAZADA'],
    ['Archivos afectados', '2'],
    ['Archivos recuperados', '2'],
    ['Estado', 'OPERATIVO'],
  ],
  completada: 'MISIÓN COMPLETADA',
  mensaje:
    'La seguridad informática no consiste únicamente en impedir ataques.\n\n' +
    'También consiste en saber responder y recuperar el control cuando ocurre un incidente.',
  boton: 'VER INFORME DE MISIÓN',
};
