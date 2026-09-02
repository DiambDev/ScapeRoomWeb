// Fase 3 — Recuperación.
// Contenido editorial editable por el docente.

export const PHASE3 = {
  fase: 'FASE 3',
  titulo: 'RECUPERACIÓN',

  estadoBloqueado: 'Los accesos maliciosos fueron bloqueados.',
  estadoRechazado: 'El atacante no consiguió completar el acceso.',

  analisisTitulo: 'ANALIZANDO INTEGRIDAD DEL SISTEMA...',
  // Cada fila del análisis de integridad
  analisis: [
    { texto: 'Archivos disponibles', estado: 'OK' },
    { texto: 'Credenciales', estado: 'OK' },
    { texto: 'Configuraciones', estado: 'OK' },
    { texto: 'Archivos importantes', estado: 'ERROR' },
  ],

  perdidaTitulo: '2 ARCHIVOS NO ENCONTRADOS',

  archivos: [
    { ruta: 'C:\\Escritorio\\IMPORTANTE\\Tarea1', nombre: 'Tarea1' },
    { ruta: 'C:\\Escritorio\\IMPORTANTE\\Tesis1', nombre: 'Tesis1' },
  ],

  aclaracionRutas:
    'Estas rutas son únicamente texto dentro de la simulación. La aplicación no intenta acceder a ellas.',

  preguntaRespaldo: '¿Dónde guardaste tu copia de respaldo?',
  opcionesRespaldo: [
    { id: 'nube', icono: '☁️', label: 'Almacenamiento en la nube' },
    { id: 'mismo', icono: '💻', label: 'En este mismo equipo' },
    { id: 'ninguno', icono: '❌', label: 'No tengo respaldo' },
  ],

  // ---- CAMINO A: NUBE ----
  nube: {
    titulo: 'RESPALDO EXTERNO DISPONIBLE',
    intro: 'Selecciona LOS DOS archivos desde el respaldo:',
    archivosRespaldo: [
      { ref: 'a', nombre: 'Tarea1.backup' },
      { ref: 'b', nombre: 'Tesis1.backup' },
    ],
    botonRestaurar: 'RESTAURAR ARCHIVOS',
    avisoSeleccion: 'Debes seleccionar ambos archivos antes de restaurar.',
    // pasos de la barra de restauración
    barraPasos: [
      'Conectando al respaldo...',
      'Verificando archivos...',
      'Restaurando Tarea1...',
      'Restaurando Tesis1...',
      'Validando integridad...',
    ],
    barraCompleta: '100%',
    tituloExito: 'ARCHIVOS RECUPERADOS',
  },

  // Validación docente (común)
  docente: {
    boton: 'VALIDACIÓN DEL DOCENTE',
    label: 'Código de recuperación',
    placeholder: 'Código de la actividad',
    botonValidar: 'VALIDAR',
    error: 'Código incorrecto. Solicita a tu docente el código de la actividad.',
    ok: 'Código válido. Continúa la simulación.',
    continuar: 'CONTINUAR',
  },

  // ---- CAMINO B: MISMO EQUIPO ----
  mismoEquipo: {
    advertenciaTitulo: 'ADVERTENCIA DE RECUPERACIÓN',
    advertenciaTexto: 'El respaldo estaba almacenado en el mismo dispositivo afectado.',
    pregunta: '¿Por qué esto representa un riesgo?',
    opciones: [
      { id: 'a', label: 'A. Porque el mismo incidente puede afectar al archivo original y al respaldo.' },
      { id: 'b', label: 'B. Porque los respaldos solamente pueden guardarse en USB.' },
      { id: 'c', label: 'C. Porque Windows elimina automáticamente todos los respaldos.' },
    ],
    correcta: 'a',
    feedbackError:
      'Esa no es la razón correcta. Revisa de nuevo: el riesgo está en que la copia depende del mismo equipo afectado.',
    feedbackOk:
      'Correcto. Si un incidente compromete el equipo, puede afectar al mismo tiempo al archivo original y al respaldo si ambos viven en el mismo dispositivo.',
  },

  // ---- CAMINO C: SIN RESPALDO ----
  ninguno: {
    titulo: 'NO SE ENCONTRÓ RESPALDO',
    mensaje: 'En un incidente real, recuperar estos archivos podría no ser posible.',
    pregunta: '¿Cuándo debe prepararse un respaldo?',
    opciones: [
      { id: 'antes', label: 'Antes de que ocurra el incidente.' },
      { id: 'despues', label: 'Después de perder los archivos.' },
      { id: 'falla', label: 'Solo cuando el equipo presenta fallas.' },
    ],
    correcta: 'antes',
    feedbackError:
      'No es correcto. Reflexiona: un respaldo debe existir antes de necesitarlo.',
    feedbackOk:
      'Un plan de recuperación debe existir antes de necesitarlo. El respaldo no puede crearse después de perder la información.',
  },
};
