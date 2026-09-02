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

export const WARNING = {
  alertaTitulo: 'ALERTA DE SEGURIDAD',
  tituloPrincipal: 'TU COMPUTADORA ESTÁ COMPROMETIDA',
  descripcion: 'Un hacker se ha infiltrado en el sistema e intenta tomar el control de tus cuentas y del equipo.',
  simulacionLeyenda: 'SIMULACIÓN EDUCATIVA · Actividad autorizada por TECSUP · No existe riesgo real para este equipo.',
  instruccion: 'No cierres esta pestaña durante la misión.',
  boton: 'RESPONDER AL ATAQUE',
};

export const TRANSITION = {
  titulo: 'INICIANDO PROTOCOLO DE RESPUESTA...',
  lineas: [
    'Analizando accesos...',
    'Detectando sesiones activas...',
    'Protegiendo credenciales...',
    'Aislando incidente...',
  ],
};

export const GAME_OVER_CODIGO = {
  feedback:
    'Nunca compartas códigos de autenticación con otra persona. Estos códigos pueden permitir que alguien complete un acceso que tú no autorizaste.',
  popups: [
    'ERROR', 'ACCESS DENIED', 'SESSION FAILED', 'SYSTEM ERROR',
    'UNAUTHORIZED', 'SECURITY BREACH', 'AUTH FAILED', 'FATAL ERROR',
    'CREDENTIAL EXPOSED', 'TOKEN INVALID', 'BREACH DETECTED', 'LOCKOUT',
    'PERMISSION DENIED', 'MALWARE DETECTED', 'ROOT ACCESS', 'BACKDOOR',
    'DATA EXFILTRATION', 'RANSOMWARE', 'KEYLOGGER', 'PHISHING',
    'BRUTE FORCE', 'SQL INJECTION', 'DDoS ATTACK', 'ZERO-DAY',
    'TROJAN HORSE', 'WORM DETECTED', 'SPYWARE', 'ADWARE',
    'CRYPTO MINER', 'BOTNET', 'C2 SERVER', 'COMMAND INJECTION',
    'BUFFER OVERFLOW', 'RACE CONDITION', 'MEMORY CORRUPTION',
    'STACK SMASHING', 'HEAP SPRAY', 'USE AFTER FREE',
  ],
};

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
  finalTitulo: 'MISIÓN FINALIZADA',
  finalMensaje: 'Buen trabajo, operador.',
  finalCredito: 'Actividad educativa — Tecsup',
  nuevaSimulacion: 'NUEVA SIMULACIÓN',
};

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
