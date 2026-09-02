import { el } from '../utils/dom.js';
import { PHASE1 } from '../data/fase1.js';
import { PHASE2 } from '../data/fase2.js';
import { GAME_OVER_CODIGO } from '../data/gameOver.js';
import { registerInterval, clearTimer } from '../utils/timers.js';
import { randomCode6 } from '../core/random.js';

let _popupTimer = null;

export function stopPopups() {
  clearTimer(_popupTimer);
  _popupTimer = null;
}

export function renderGameOver(root, game, data) {
  const motivo = data.motivo;
  if (motivo === 'fase1') {
    renderTerminal(root, game);
  } else {
    renderPopups(root, game, motivo);
  }
}

function renderTerminal(root, game) {
  const panel = el('div', { class: 'screen game-over' }, [
    el('div', { class: 'terminal' }, [
      el('div', { class: 'terminal-title' }, [PHASE1.gameOverTitle]),
      el('div', { class: 'terminal-body' }, [
        ...PHASE1.terminalLines.map((l) => el('div', { class: 'term-line' }, [l])),
      ]),
    ]),
    el('h2', { class: 'go-title' }, [PHASE1.gameOverTitle]),
    el('p', { class: 'go-message' }, [PHASE1.gameOverMessage]),
    el('p', { class: 'go-feedback' }, [PHASE1.gameOverFeedback]),
    el('button', { class: 'btn btn-primary', type: 'button' }, [PHASE1.retry]),
  ]);
  panel.querySelector('button').addEventListener('click', () => game.volverAlInicio());
  root.appendChild(panel);
}

function renderPopups(root, game, motivo) {
  const overlay = el('div', { class: 'popup-layer', 'data-overlay': '' });
  root.appendChild(overlay);

  const feedback = motivo === 'señales' ? PHASE2.gameOverFeedback : GAME_OVER_CODIGO.feedback;
  const msgs = GAME_OVER_CODIGO.popups;

  const panel = el('div', { class: 'screen game-over' }, [
    el('h1', { class: 'go-title' }, ['SISTEMA COMPROMETIDO']),
    el('p', { class: 'go-message' }, ['Acceso no autorizado completado. Credenciales expuestas.']),
    el('p', { class: 'go-feedback' }, [feedback]),
    el('button', { class: 'btn btn-primary go-retry', type: 'button', style: 'visibility:hidden;' }, ['REINICIAR SIMULACIÓN']),
  ]);
  const btn = panel.querySelector('.go-retry');
  btn.addEventListener('click', () => {
    stopPopups();
    game.volverAlInicio();
  });
  root.appendChild(panel);

  let i = 0;
  _popupTimer = registerInterval(() => {
    if (i < msgs.length) {
      const txt = msgs[i] + ' — ' + randomCode6();
      const { w, h, x, y } = randomPos();
      const pop = el('div', {
        class: 'fake-popup',
        'data-popup': '',
        style: `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`,
      }, [
        el('div', { class: 'fake-popup-bar' }, [
          el('span', {}, ['Alerta del sistema']),
          el('span', {}, ['✕']),
        ]),
        el('div', { class: 'fake-popup-body' }, [txt]),
      ]);
      overlay.appendChild(pop);
      i++;
    } else {
      clearTimer(_popupTimer);
      _popupTimer = null;
      btn.style.visibility = 'visible';
    }
  }, 120);
}

function randomPos() {
  const w = 180 + Math.floor(Math.random() * 200);
  const h = 80 + Math.floor(Math.random() * 120);
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const x = Math.random() * Math.max(vw - w, 0) * 0.85;
  const y = Math.random() * Math.max(vh - h, 0) * 0.85;
  return { w, h, x, y };
}
