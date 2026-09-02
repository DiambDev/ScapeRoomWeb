// CONFIG — Configuración central de la actividad.
// El docente puede modificar aquí los valores globales de la simulación.
//
// ADVERTENCIA DE SEGURIDAD:
// Esta es una aplicación 100% estática (GitHub Pages). Todo el código fuente
// es público e inspeccionable en el navegador. Por tanto, el "código docente"
// que aparece aquí NO es un secreto real: un estudiante técnicamente avanzado
// podría verlo abriendo el inspector. Es aceptable porque solo sirve como
// mecanismo pedagógico para la dinámica de aula. No lo uses para proteger
// nada real.

export const CONFIG = {
  // Identificador del incidente simulado
  incident: 'INC-042',

  // Código de recuperación del docente (mecanismo pedagógico, no un secreto)
  docenteCodigo: 'TECSUP-2026',

  // Nombre del supuesto contacto/soporte de la Fase 2
  contactoNombre: 'External IT Support',
  contactoRol: 'Support Agent · External Provider',

  // Duración (ms) de secuencias automáticas
  bootDuration: 1800,         // arranque normal
  transitionDuration: 3200,   // protocolo de respuesta
};
