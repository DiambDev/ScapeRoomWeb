// VICTORIA — informe final del incidente resuelto.
import { el } from '../utils/dom.js';
import { VICTORY } from '../data/gameOver.js';

export function renderVictory(root, game) {
  const panel = el('div', { class: 'screen victory' }, [
    el('div', { class: 'victory-card' }, [
      el('div', { class: 'victory-badge' }, [VICTORY.completada]),
      el('h1', { class: 'victory-title' }, [VICTORY.titulo]),
      el('div', { class: 'victory-informe' }, [
        ...VICTORY.informe.map(([k, v]) =>
          el('div', { class: 'informe-row' }, [
            el('span', { class: 'informe-key' }, [k]),
            el('span', { class: 'informe-val' }, [v]),
          ])
        ),
      ]),
      el('div', { class: 'victory-line' }),
      el('p', { class: 'victory-mensaje', style: 'white-space:pre-line;' }, [VICTORY.mensaje]),
      el('button', { class: 'btn btn-primary', type: 'button' }, [VICTORY.boton]),
    ]),
  ]);

  const btn = panel.querySelector('button');
  btn.addEventListener('click', () => game.finalizarMision());

  root.appendChild(panel);
}
