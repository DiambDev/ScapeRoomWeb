// Fase 2 — Ingeniería Social.
// Contenido editable por el docente.
//
// Modelo de cada mensaje/intento:
//   numero            → 1..3
//   nombre            → etiqueta del intento
//   mensaje           → mensaje del supuesto soporte en el chat
//   botonVerificar    → texto del enlace sintético
//   availableSignals  → todas las etiquetas que se ofrecen en pantalla
//   correctSignals    → cuáles de esas son señales reales de ESE mensaje
//   sistema (opcional)→ observación del sistema tras la respuesta del alumno

export const PHASE2 = {
  fase: 'FASE 2',
  titulo: 'INGENIERÍA SOCIAL',
  introduccion:
    'El soporte externo afirma haber detectado el mismo incidente y te contacta para "ayudarte".',

  // Decisión principal
  decisionTitulo: 'SE HA DETECTADO UNA SOLICITUD EXTERNA.',
  decisionPregunta: '¿Qué deseas hacer?',
  opcionConfiar: 'CONFÍO EN EL SOPORTE',
  opcionDesconfiar: 'DESCONFÍO DE LA SOLICITUD',

  // Camino "CONFIAR" → pedir el código simulado
  caminoConfiarIntro: 'Introduce el código solicitado por soporte.',
  caminoConfiarPlaceholder: 'Código de 6 dígitos',
  caminoConfiarBoton: 'ENVIAR CÓDIGO',
  caminoConfiarRecibido: 'Perfecto. Código recibido.',
  caminoConfiarAcceso: 'Acceso confirmado.',

  // Modal del código simulado
  modalTitulo: 'VERIFICACIÓN DE SEGURIDAD',
  modalSubtitulo: 'CÓDIGO TEMPORAL',
  modalNota: 'Este código forma parte de la simulación.',
  modalCopiar: 'COPIAR CÓDIGO',
  modalCopiado: 'Código copiado.',
  modalCerrar: 'CERRAR',

  // Camino "DESCONFIAR" → identificar señales
  promptSeñales: 'Identifica las señales que hacen sospechoso el mensaje.',
  avisoExactas: 'Selecciona exactamente las señales correctas para este mensaje.',
  confirmarBoton: 'CONFIRMAR SEÑALES',
  errorSeñales: 'Revisa la selección: hay señales que no corresponden a este mensaje.',
  señalCorrecta: 'Solicitud sospechosa identificada.',

  // Final de la fase si se rechazan los 3 intentos
  bloqueoContactoTitulo: 'BLOQUEAR CONTACTO',
  bloqueoContactoLineas: [
    'Contacto bloqueado.',
    'Solicitud rechazada.',
    'Canal externo cerrado.',
  ],
  amenazaDecreciendo: 'AMENAZA DISMINUYENDO...',

  // God de señales para GAME OVER (3er intento fallido)
  gameOverFeedback:
    'Las técnicas de ingeniería social suelen utilizar urgencia, autoridad, miedo o solicitudes inusuales para evitar que analices la situación.',

  maxIntentos: 3,

  // Mensajes y señales por intento. Las señales correctas dependen del mensaje.
  intentos: [
    {
      numero: 1,
      nombre: 'INTENTO 1',
      mensaje:
        'Hola. Soy del soporte externo. Detectamos el ataque que está afectando tu equipo.\n' +
        'Necesitamos validar tu sesión inmediatamente.\n' +
        'Abre este enlace de recuperación para evitar que se pierda el acceso.\n' +
        'Cuando aparezca el código de seguridad, envíamelo por este chat para completar el bloqueo.',
      botonVerificar: '[ Verificar sesión ]',
      availableSignals: [
        'URGENCIA',
        'ENLACE',
        'SOLICITUD DE CÓDIGO',
        'AMENAZA',
        'SALUDO EXCESIVO',
        'IDENTIFICACIÓN DEL USUARIO',
        'PRESIÓN',
        'HORA',
      ],
      correctSignals: ['URGENCIA', 'ENLACE', 'SOLICITUD DE CÓDIGO', 'IDENTIFICACIÓN DEL USUARIO'],
      sistemaAcierto: 'Solicitud sospechosa identificada.',
    },
    {
      numero: 2,
      nombre: 'INTENTO 2',
      mensaje:
        'Creo que hubo una confusión, pero no puedo retrasar la validación.\n' +
        'Si no verificas la sesión AHORA, es posible que tu cuenta sea bloqueada.\n' +
        'Reenvíame el código que aparece al abrir este enlace de respaldo oficial.',
      botonVerificar: '[ Enlace de respaldo ]',
      availableSignals: [
        'URGENCIA',
        'ENLACE',
        'SOLICITUD DE CÓDIGO',
        'AMENAZA',
        'SALUDO EXCESIVO',
        'IDENTIFICACIÓN DEL USUARIO',
        'PRESIÓN',
        'HORA',
      ],
      correctSignals: ['URGENCIA', 'ENLACE', 'SOLICITUD DE CÓDIGO', 'PRESIÓN', 'AMENAZA'],
      sistemaAcierto: 'El contacto está insistiendo.',
      sistemaError: 'El contacto está insistiendo.',
    },
    {
      numero: 3,
      nombre: 'INTENTO 3',
      mensaje:
        'Esta es la última oportunidad para verificar tu cuenta.\n' +
        'Si no completas el proceso en 5 minutos, perderás acceso permanentemente.\n' +
        'Es tu responsabilidad. Enviame el código ahora.',
      botonVerificar: '[ Solicitud urgente ]',
      availableSignals: [
        'URGENCIA',
        'ENLACE',
        'SOLICITUD DE CÓDIGO',
        'AMENAZA',
        'SALUDO EXCESIVO',
        'IDENTIFICACIÓN DEL USUARIO',
        'PRESIÓN',
        'HORA',
      ],
      correctSignals: ['URGENCIA', 'SOLICITUD DE CÓDIGO', 'AMENAZA', 'PRESIÓN', 'HORA'],
      sistemaAcierto: 'Manipulación por miedo y urgencia detectada.',
    },
  ],

  feedbackFinalCorrecto:
    'Has rechazado los tres intentos de ingeniería social. La cuenta permanece protegida.',
};
