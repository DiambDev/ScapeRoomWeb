// WARNING — pantalla roja de detección del ataque.
// Muestra la alerta con pulsos controlados y un aviso educativo de simulación.
import { el } from '../utils/dom.js';
import { WARNING } from '../data/gameOver.js';

export function renderWarning(root, game) {
  const panel = el('div', { class: 'screen warning' }, [
    el('div', { class: 'warning-badge' }, [WARNING.alertaTitulo]),
    el('h1', { class: 'warning-title' }, [WARNING.alertaTitulo]),
    el('p', { class: 'warning-sub' }, [WARNING.linea1]),
    el('p', { class: 'warning-sub' }, [WARNING.linea2]),
    el('div', { class: 'warning-sim' }, [WARNING.simulacion]),
    el('p', { class: 'warning-small' }, [WARNING.textoPequeno]),
    el('p', { class: 'warning-small' }, [WARNING.instruccion]),
    el('button', { class: 'btn btn-start', type: 'button' }, [WARNING.boton]),
  ]);

  const btn = panel.querySelector('.btn-start');
  btn.addEventListener('click', () => game.iniciarMision());

  root.appendChild(panel);
}
