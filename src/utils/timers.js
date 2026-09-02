// Registro central de temporizadores para poder limpiarlos en un reinicio.
// Evita que timers de secuencias (boot, transición, restauración, pop-ups)
// sigan ejecutándose después de volver a empezar.

const timers = new Set();

export function registerTimer(handle) {
  timers.add(handle);
  return handle;
}

export function registerTimeout(fn, ms) {
  return registerTimer(setTimeout(fn, ms));
}

export function registerInterval(fn, ms) {
  return registerTimer(setInterval(fn, ms));
}

// Limpia un único temporizador (timeout o interval).
export function clearTimer(handle) {
  if (handle == null) return;
  clearTimeout(handle);
  clearInterval(handle);
  timers.delete(handle);
}

// Limpia todos los temporizadores registrados. Se usa al reiniciar.
export function clearAllTimers() {
  timers.forEach((h) => {
    clearTimeout(h);
    clearInterval(h);
  });
  timers.clear();
}
