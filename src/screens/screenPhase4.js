// FASE 4 — Restauración final.
// Simula la restauración completa del sistema antes de declarar la victoria.
import { el } from '../utils/dom.js';
import { registerTimeout } from '../utils/timers.js';
import { renderStatusBar } from '../components/statusbar.js';

const RESTORE_LINES = [
  { texto: 'Restaurando sesión...', estado: 'OK' },
  { texto: 'Aplicando políticas de seguridad...', estado: 'OK' },
  { texto: 'Restaurando archivos...', estado: 'OK' },
  { texto: 'Reactivar cuenta...', estado: 'OK' },
  { texto: 'Verificación final...', estado: 'OK' },
];

export function renderPhase4(root, game) {
  renderStatusBar(root, 'fase4');

  const panel = el('div', { class: 'screen phase4' }, [
    el('h2', { class: 'phase-title' }, ['FASE 4 — RESTAURACIÓN FINAL']),
    el('p', { class: 'phase-intro' }, ['Restaurando el sistema a un estado seguro...']),
    el('div', { class: 'integrity' }, [el('div', { class: 'integrity-body' })]),
  ]);
  root.appendChild(panel);

  const body = panel.querySelector('.integrity-body');
  let idx = 0;

  const step = () => {
    if (idx < RESTORE_LINES.length) {
      const l = RESTORE_LINES[idx];
      body.appendChild(
        el('div', { class: 'integrity-line' }, [
          el('span', {}, [l.texto]),
          el('span', { class: 'integrity-ok' }, [l.estado]),
        ])
      );
      idx++;
      registerTimeout(step, 450);
    } else {
      const done = el('div', { class: 'final-ready' }, [
        el('p', { class: 'feedback-ok' }, ['RESTAURACIÓN COMPLETADA']),
        el('button', { class: 'btn btn-primary', type: 'button' }, ['FINALIZAR']),
      ]);
      body.appendChild(done);
      done.querySelector('button').addEventListener('click', () => game.restaurarFinal());
    }
  };

  step();
}
