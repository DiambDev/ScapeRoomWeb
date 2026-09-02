import { el } from '../utils/dom.js';
import { registerTimeout } from '../utils/timers.js';
import { PHASE1 } from '../data/fase1.js';
import { renderStatusBar } from '../components/statusbar.js';

export function renderPhase1(root, game) {
  const acciones = game.getFase1Acciones();
  renderStatusBar(root, 'fase1');

  const titulo = el('h2', { class: 'phase-title' }, [`${PHASE1.fase} — ${PHASE1.titulo}`]);
  const intro = el('p', { class: 'phase-intro' }, [PHASE1.pregunta]);

  const slotsWrap = el('div', { class: 'seq-wrap' }, [
    el('h3', { class: 'seq-title' }, [PHASE1.construirTitulo]),
    el('div', { class: 'seq-slots' }),
  ]);
  const slotsRow = slotsWrap.querySelector('.seq-slots');

  const tarjetas = el('div', { class: 'action-grid' });
  const feedback = el('div', { class: 'feedback', 'aria-live': 'polite' });

  const ejecutarBtn = el('button', {
    class: 'btn btn-primary seq-execute',
    type: 'button',
    disabled: '',
  }, [PHASE1.ejecutarBoton]);
  const limpiarBtn = el('button', { class: 'btn btn-ghost', type: 'button' }, [PHASE1.limpiarBoton]);
  const aviso = el('p', { class: 'link-nota' }, [PHASE1.avisoConstruccion]);

  const panel = el('div', { class: 'screen phase1' }, [
    titulo, intro, slotsWrap,
    el('div', { class: 'seq-actions' }, [ejecutarBtn, limpiarBtn, aviso]),
    tarjetas, feedback,
  ]);
  root.appendChild(panel);

  function renderSlots() {
    slotsRow.textContent = '';
    for (let i = 0; i < PHASE1.correctOrder.length; i++) {
      const id = game.sequence[i];
      const accion = id ? acciones.find((a) => a.id === id) : null;
      const slot = el('div', { class: 'seq-slot' + (id ? ' filled' : '') }, [
        el('span', { class: 'seq-step' }, [`PASO ${i + 1}`]),
        el('span', { class: 'seq-value' }, [id && accion ? accion.label : PHASE1.placeholderPaso]),
      ]);
      slotsRow.appendChild(slot);
    }
  }

  function renderTarjetas() {
    tarjetas.textContent = '';
    for (const accion of acciones) {
      const usada = game.sequence.includes(accion.id);
      const card = el(
        'button',
        { class: 'action-card' + (usada ? ' used' : ''), type: 'button', disabled: usada ? '' : null },
        [el('span', { class: 'action-label' }, [accion.label]),
         el('span', { class: 'action-detail' }, [accion.detail])]
      );
      if (!usada) {
        card.addEventListener('click', () => {
          game.construirSecuencia(accion.id);
          const slotIdx = game.sequence.length - 1;
          animateCardToSlot(card, slotIdx);
          renderSlots();
          renderTarjetas();
          updateControls();
        });
      }
      tarjetas.appendChild(card);
    }
  }

  function animateCardToSlot(card, slotIdx) {
    card.classList.add('card-digitalizing');
    registerTimeout(() => card.classList.remove('card-digitalizing'), 400);
  }

  function animateRemoveFromSlot(slotEl) {
    slotEl.classList.add('slot-removing');
    registerTimeout(() => slotEl.classList.remove('slot-removing'), 400);
  }

  function updateControls() {
    ejecutarBtn.disabled = !game.secuenciaCompleta();
  }

  limpiarBtn.addEventListener('click', () => {
    const slots = slotsRow.querySelectorAll('.seq-slot.filled');
    slots.forEach((s, i) => {
      registerTimeout(() => animateRemoveFromSlot(s), i * 80);
    });
    registerTimeout(() => {
      game.limpiarSecuencia();
      renderSlots();
      renderTarjetas();
      updateControls();
      feedback.textContent = '';
    }, slots.length * 80 + 100);
  });

  slotsRow.addEventListener('click', (e) => {
    const slot = e.target.closest('.seq-slot');
    if (!slot) return;
    const pasoIdx = Array.prototype.indexOf.call(slotsRow.children, slot);
    const seq = game.sequence;
    if (pasoIdx >= 0 && pasoIdx < seq.length) {
      animateRemoveFromSlot(slot);
      registerTimeout(() => {
        game.quitarDeSecuencia(seq[pasoIdx]);
        renderSlots();
        renderTarjetas();
        updateControls();
      }, 400);
    }
  });

  ejecutarBtn.addEventListener('click', () => {
    if (!game.secuenciaCompleta()) return;
    const result = game.ejecutarProtocolo();
    if (!result.ok) {
      playDefeatAnimation(panel, root, game);
    }
  });

  renderSlots();
  renderTarjetas();
  updateControls();
}

function playDefeatAnimation(panel, root, game) {
  panel.classList.add('defeat-freeze');
  const pieces = panel.querySelectorAll('.seq-slot, .action-card');
  pieces.forEach((p, i) => {
    registerTimeout(() => p.classList.add('defeat-piece'), i * 60);
  });
  const malicious = el('div', { class: 'malicious-overlay' });
  root.appendChild(malicious);
  const msgs = ['ERROR', 'BREACH', 'FAILED', 'DENIED', 'MALWARE', 'TROJAN', 'VIRUS', 'ALERT', 'CRITICAL', 'FATAL'];
  for (let i = 0; i < 30; i++) {
    const m = el('div', { class: 'malicious-code', style: `left:${Math.random()*90}%;top:${Math.random()*90}%` },
      [msgs[Math.floor(Math.random() * msgs.length)] + ' ' + Math.floor(Math.random() * 9999)]);
    malicious.appendChild(m);
    registerTimeout(() => m.classList.add('mc-active'), i * 40);
  }
  registerTimeout(() => {
    panel.classList.add('defeat-darken');
  }, 600);
  registerTimeout(() => {
    root.innerHTML = '';
    const goPanel = el('div', { class: 'screen game-over defeat-result' }, [
      el('div', { class: 'terminal defeat-terminal' }, [
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
    goPanel.querySelector('button').addEventListener('click', () => game.volverAlInicio());
    root.appendChild(goPanel);
  }, 1800);
}
