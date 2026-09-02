import { el } from '../utils/dom.js';
import { WARNING } from '../data/gameOver.js';

export function renderWarning(root, game) {
  const panel = el('div', { class: 'screen warning' }, [
    el('div', { class: 'warning-alert-line' }),
    el('div', { class: 'warning-content' }, [
      el('div', { class: 'warning-icon' }, ['⚠']),
      el('h1', { class: 'warning-title' }, [WARNING.tituloPrincipal]),
      el('p', { class: 'warning-desc' }, [WARNING.descripcion]),
      el('button', { class: 'btn btn-cta', type: 'button' }, [WARNING.boton]),
    ]),
    el('div', { class: 'warning-footer' }, [
      el('p', { class: 'warning-leyenda' }, [WARNING.simulacionLeyenda]),
      el('p', { class: 'warning-instruccion' }, [WARNING.instruccion]),
    ]),
  ]);

  panel.querySelector('.btn-cta').addEventListener('click', () => game.iniciarMision());
  root.appendChild(panel);
}
