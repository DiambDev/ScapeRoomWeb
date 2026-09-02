// Componente: ventana emergente SIMULADA (dentro del DOM).
// Nunca abre ventanas reales del navegador.
import { el } from '../utils/dom.js';
import { randomPopupStyle } from '../core/random.js';
import { registerInterval, clearTimer } from '../utils/timers.js';

// Crea UN pop-up interno con texto dado, en posición/tamaño aleatorio.
export function addPopup(container, texto) {
  const { w, h, x, y } = randomPopupStyle();
  const pop = el(
    'div',
    {
      class: 'fake-popup',
      'data-popup': '',
      style: `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`,
    },
    [
      el('div', { class: 'fake-popup-bar' }, [el('span', {}, ['Alerta del sistema']), el('span', {}, ['✕'])]),
      el('div', { class: 'fake-popup-body' }, [texto]),
    ]
  );
  container.appendChild(pop);
  return pop;
}

// Crea múltiples pop-ups que cubren la pantalla progresivamente.
export function populate(container, mensajes, { onComplete } = {}) {
  let i = 0;
  let timer;
  // El intervalo queda registrado para poder limpiarse en un reinicio.
  timer = registerInterval(() => {
    if (i < mensajes.length) {
      addPopup(container, mensajes[i]);
      i++;
    } else {
      clearTimer(timer);
      if (onComplete) onComplete();
    }
  }, 350);
}
