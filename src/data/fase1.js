export const PHASE1 = {
  fase: 'FASE 1',
  titulo: 'CONTENER LA AMENAZA',
  pregunta: 'Un hacker se ha infiltrado en el sistema, tu cuenta está comprometida, ¿qué acciones debemos ejecutar?',

  correctOrder: ['bloquear', 'cambiar', 'verificacion'],
  actions: [
    { id: 'bloquear', label: 'Bloquear accesos', detail: 'Cerrar los accesos que el atacante podría usar' },
    { id: 'cambiar', label: 'Cambiar credenciales', detail: 'Renovar las credenciales comprometidas' },
    { id: 'verificacion', label: 'Activar verificación', detail: 'Añadir una segunda capa de autenticación' },
  ],

  construirTitulo: 'ORDEN DE RESPUESTA',
  pasoEtiqueta: 'PASO',
  ejecutarBoton: 'EJECUTAR PROTOCOLO',
  limpiarBoton: 'Limpiar',
  placeholderPaso: 'selecciona una acción',
  avisoConstruccion: 'Toca cada tarjeta para colocarla en el orden. Antes de ejecutar puedes modificar tu selección.',

  exitoTitulo: 'AMENAZA CONTENIDA',
  exitoMensaje: 'El protocolo se ejecutó en el orden correcto.',
  exitoBoton: 'CONTINUAR',
  secuenciaOk: [
    { texto: 'Cerrando sesiones sospechosas', estado: 'OK' },
    { texto: 'Bloqueando accesos', estado: 'OK' },
    { texto: 'Actualizando credenciales', estado: 'OK' },
    { texto: 'Activando verificación adicional', estado: 'OK' },
  ],

  errorProcesando: 'Procesando acciones...',
  errorTitulo: 'ERROR',
  errorMensaje: 'Sesión maliciosa todavía activa.',
  terminalLines: [
    '> control_de_sesión: FALLIDO',
    '> sesión_no_autorizada: ACTIVA',
    '> escalada_de_privilegios: DETECTADA',
    '> SISTEMA COMPROMETIDO',
  ],
  gameOverTitle: 'SISTEMA COMPROMETIDO',
  gameOverMessage: 'El atacante aprovechó una sesión que permanecía activa.',
  gameOverFeedback:
    'Antes de cambiar credenciales o configurar nuevas defensas, debes impedir que el atacante continúe utilizando los accesos existentes.',
  retry: 'REINICIAR SIMULACIÓN',
};
