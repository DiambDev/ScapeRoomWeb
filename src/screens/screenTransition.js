// TRANSITION — "INICIANDO PROTOCOLO DE RESPUESTA...".
// Terminal animada con pasos que desfilan antes de entrar a Fase 1.
import { el } from '../utils/dom.js';
import { registerTimeout } from '../utils/timers.js';
import { TRANSITION } from '../data/gameOver.js';
import { CONFIG } from '../data/config.js';

export function renderTransition(root, game) {
  const body = el('div', { class: 'transition-body' });
  const panel = el('div', { class: 'screen transition' }, [
    el('h1', { class: 'transition-title' }, [TRANSITION.titulo]),
    body,
  ]);
  root.appendChild(panel);

  let idx = 0;
  const step = () => {
    if (idx < TRANSITION.lineas.length) {
      body.appendChild(el('div', { class: 'transition-line' }, ['> ' + TRANSITION.lineas[idx]]));
      idx++;
      registerTimeout(step, 500);
    } else {
      body.appendChild(el('div', { class: 'transition-line transition-done' }, ['> ' + 'LISTO']));
      registerTimeout(() => game.protocoloListo(), 500);
    }
  };
  step();
}
