// Fase 1 — Contención.
// El docente puede editar estos textos y acciones sin tocar la lógica.
// La actividad pide construir una secuencia (PASO 1..3) y ejecutarla.

export const PHASE1 = {
  fase: 'FASE 1',
  titulo: 'CONTENER LA AMENAZA',

  mensajeSistema1: 'El atacante todavía podría mantener acceso a tu cuenta.',
  mensajeSistema2: 'Debemos recuperar el control.',
  pregunta: '¿En qué orden debemos ejecutar estas acciones?',

  // Orden conceptualmente CORRECTO. La lógica mezcla el ORDEN VISUAL,
  // pero nunca cambia cuál es la secuencia válida.
  correctOrder: ['bloquear', 'cambiar', 'verificacion'],

  actions: [
    {
      id: 'bloquear',
      label: 'Bloquear accesos',
      detail: 'Cerrar los accesos que el atacante podría usar',
    },
    {
      id: 'cambiar',
      label: 'Cambiar contraseñas',
      detail: 'Renovar las credenciales comprometidas',
    },
    {
      id: 'verificacion',
      label: 'Activar códigos de verificación',
      detail: 'Añadir una segunda capa de autenticación',
    },
  ],

  // Etiquetas de construcción de la secuencia
  construirTitulo: 'ORDEN DE RESPUESTA',
  pasoEtiqueta: 'PASO',
  ejecutarBoton: 'EJECUTAR PROTOCOLO',
  limpiarBoton: 'Limpiar',
  placeholderPaso: 'selecciona una acción',
  avisoConstruccion: 'Toca cada tarjeta para colocarla en el orden. Antes de ejecutar puedes modificar tu selección.',

  // Respuesta correcta: secuencia de sistema mostrada sobre terminal falsa
  exitoTitulo: 'AMENAZA CONTENIDA',
  exitoMensaje: 'El protocolo se ejecutó en el orden correcto.',
  exitoBoton: 'CONTINUAR',
  secuenciaOk: [
    { texto: 'Cerrando sesiones sospechosas', estado: 'OK' },
    { texto: 'Bloqueando accesos', estado: 'OK' },
    { texto: 'Actualizando credenciales', estado: 'OK' },
    { texto: 'Activando verificación adicional', estado: 'OK' },
  ],

  // Respuesta incorrecta: consecuencia narrativa + terminal falsa
  errorProcesando: 'Procesando acciones...',
  errorTitulo: 'ERROR',
  errorMensaje: 'Sesión maliciosa todavía activa.',
  terminalLines: [
    '> session_control: FAILED',
    '> unauthorized_session: ACTIVE',
    '> privilege escalation detected',
    '> SYSTEM COMPROMISED',
  ],
  gameOverTitle: 'SISTEMA COMPROMETIDO',
  gameOverMessage: 'El atacante aprovechó una sesión que permanecía activa.',
  gameOverFeedback:
    'Antes de cambiar credenciales o configurar nuevas defensas, debes impedir que el atacante continúe utilizando los accesos existentes.',
  retry: 'REINICIAR SIMULACIÓN',
};
