// Máquina de estados central. Pura: sin manipulación de DOM.
// Define los estados y las transiciones válidas.
// Estados:
//   boot (arranque normal), warning (detección del ataque),
//   transition (protocolo de respuesta), fase1, fase2, fase3,
//   recuperacion, fase4 (restauración final), game_over, victoria, debrief

export const STATE = {
  BOOT: 'boot',
  WARNING: 'warning',
  TRANSITION: 'transition',
  FASE1: 'fase1',
  FASE2: 'fase2',
  FASE3: 'fase3',
  RECUPERACION: 'recuperacion',
  FASE4: 'fase4',
  GAME_OVER: 'game_over',
  VICTORIA: 'victoria',
  DEBRIEF: 'debrief',
};

// Tabla de transiciones permitidas. Cada estado mapea "evento" -> "siguiente estado".
// 'reset' es global: desde cualquier estado se vuelve a boot.
const TRANSITIONS = {
  [STATE.BOOT]: { warning: STATE.WARNING, reset: STATE.BOOT },
  [STATE.WARNING]: { iniciar: STATE.TRANSITION, reset: STATE.BOOT },
  [STATE.TRANSITION]: { ok: STATE.FASE1, reset: STATE.BOOT },
  [STATE.FASE1]: { ok: STATE.FASE2, game_over: STATE.GAME_OVER, reset: STATE.BOOT },
  [STATE.FASE2]: { ok: STATE.FASE3, game_over: STATE.GAME_OVER, reset: STATE.BOOT },
  [STATE.FASE3]: { elegir: STATE.RECUPERACION, reset: STATE.BOOT },
  [STATE.RECUPERACION]: {
    ok: STATE.FASE4,
    game_over: STATE.GAME_OVER,
    reset: STATE.BOOT,
  },
  [STATE.FASE4]: { ok: STATE.VICTORIA, reset: STATE.BOOT },
  [STATE.GAME_OVER]: { reset: STATE.BOOT },
  [STATE.VICTORIA]: { debrief: STATE.DEBRIEF, reset: STATE.BOOT },
  [STATE.DEBRIEF]: { reset: STATE.BOOT },
};

let current = STATE.BOOT;

export function getState() {
  return current;
}

// Devuelve true si la transición es válida y actualiza el estado.
export function transition(event) {
  const map = TRANSITIONS[current] || {};
  const next = map[event];
  if (next === undefined) {
    // reset es siempre válido
    if (event === 'reset' && current !== STATE.BOOT) {
      current = STATE.BOOT;
      return true;
    }
    return false;
  }
  current = next;
  return true;
}

export function forceSet(state) {
  current = state;
}
