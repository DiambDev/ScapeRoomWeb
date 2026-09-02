// GAME OVER — pantalla de derrota.
// Según el motivo: terminal simulada (fase1) o pop-ups internos (código/señales).
import { el } from '../utils/dom.js';
import { PHASE1 } from '../data/fase1.js';
import { PHASE2 } from '../data/fase2.js';
import { GAME_OVER_CODIGO } from '../data/gameOver.js';
import { populate } from '../components/populate.js';
import { randomCode6 } from '../core/random.js';

// El ciclo de pop-ups usa un intervalo registrado en el recolector global,
// por lo que se limpia automáticamente en un reinicio (clearAllTimers).
export function stopPopups() {
  // Sin estado propio: la limpieza real la hace clearAllTimers en el reset.
}

export function renderGameOver(root, game, data) {
  const motivo = data.motivo; // 'fase1' | 'codigo' | 'señales'

  if (motivo === 'fase1') {
    renderTerminal(root, game);
    return;
  }

  renderPopups(root, game, motivo);
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
  const btn = panel.querySelector('button');
  btn.addEventListener('click', () => game.volverAlInicio());
  root.appendChild(panel);
}

function renderPopups(root, game, motivo) {
  const overlay = el('div', { class: 'popup-layer', 'data-overlay': '' });
  root.appendChild(overlay);

  const feedback = motivo === 'señales' ? PHASE2.gameOverFeedback : GAME_OVER_CODIGO.feedback;

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

  const msgs = GAME_OVER_CODIGO.popups.map((m) => `${m} — ${randomCode6()}`);
  populate(overlay, msgs, { onComplete: () => (btn.style.visibility = 'visible') });

  root.appendChild(panel);
}
