import { el } from '../utils/dom.js';
import { registerTimeout } from '../utils/timers.js';
import { renderChat, addMessage } from '../components/chat.js';
import { renderStatusBar } from '../components/statusbar.js';
import { PHASE2 } from '../data/fase2.js';
import { CONFIG } from '../data/config.js';

const RISK_COLORS = ['var(--warning)', '#f97316', 'var(--danger)'];
const RISK_LABELS = ['AMARILLO', 'NARANJA', 'ROJO'];

export function renderPhase2(root, game, data) {
  const intento = data.intento;
  const numero = data.numero;
  const señales = data.señales;
  const riskIdx = Math.min(numero - 1, 2);

  renderStatusBar(root, 'fase2');

  const header = el('div', { class: 'status-strip phase2-header' }, [
    el('span', { class: 'status-pill', style: `background:${RISK_COLORS[riskIdx]}22;color:${RISK_COLORS[riskIdx]};border:1px solid ${RISK_COLORS[riskIdx]}` },
      [`FASE 2 · ATAQUE EN CURSO`]),
    el('span', { class: 'status-progress', style: `color:${RISK_COLORS[riskIdx]}` },
      [`INTENTO ${numero} DE ${PHASE2.maxIntentos}`]),
  ]);

  const intro = el('p', { class: 'phase-intro' }, [PHASE2.introduccion]);
  const panel = el('div', { class: 'screen phase2' }, [header, intro]);
  root.appendChild(panel);

  const split = el('div', { class: 'phase2-split' });
  const left = el('div', { class: 'phase2-left' });
  const right = el('div', { class: 'phase2-right' });
  split.appendChild(left);
  split.appendChild(right);
  panel.appendChild(split);

  const chat = renderChat(left, {
    titulo: CONFIG.contactoNombre,
    rol: CONFIG.contactoRol,
    mensaje: intento.mensaje,
    riskLevel: riskIdx,
  });
  const chatBody = chat.querySelector('.chat-body');

  const sysLines = [
    '> external_access: DETECTED',
    '> account_security: VULNERABLE',
    '> authentication: AT RISK',
    '> threat_level: CRITICAL',
    '> unauthorized_activity: ACTIVE',
  ];
  const os = el('div', { class: 'os-window os-critical' }, [
    el('div', { class: 'os-topbar' }, [
      el('span', {}, ['SYSTEM STATUS']),
      el('span', { class: 'os-clock', style: 'color:var(--danger)' }, ['CRITICAL']),
    ]),
    el('div', { class: 'os-content' }, [
      ...sysLines.map((l) => el('div', { class: 'os-line os-red' }, [l])),
    ]),
  ]);
  right.appendChild(os);

  const interact = el('div', { class: 'phase2-interact' });
  panel.appendChild(interact);

  function renderDecision() {
    interact.textContent = '';
    interact.appendChild(
      el('div', { class: 'qa-block' }, [
        el('h3', { class: 'qa-title' }, [PHASE2.decisionTitulo]),
        el('p', { class: 'qa-aviso' }, [PHASE2.decisionPregunta]),
        el('div', { class: 'decision-row' }, [
          el('button', { class: 'btn btn-ghost', type: 'button' }, [PHASE2.opcionConfiar]),
          el('button', { class: 'btn btn-primary', type: 'button' }, [PHASE2.opcionDesconfiar]),
        ]),
      ])
    );
    const [confiar, desconfiar] = interact.querySelectorAll('.decision-row button');
    confiar.addEventListener('click', () => {
      addMessage(chatBody, intento.botonVerificar + ' (enlace abierto)');
      renderConfiar();
    });
    desconfiar.addEventListener('click', () => {
      addMessage(chatBody, 'No confío en esta solicitud.');
      renderSeñales();
    });
  }

  function renderSeñales() {
    interact.textContent = '';
    const seleccionadas = new Set();
    const container = el('div', { class: 'qa-block' }, [
      el('h3', { class: 'qa-title' }, [PHASE2.promptSeñales]),
      el('p', { class: 'qa-aviso' }, [PHASE2.avisoExactas]),
      el('div', { class: 'signals-grid' }),
      el('div', { class: 'feedback', 'aria-live': 'polite' }),
      el('button', { class: 'btn btn-primary confirm-signals', type: 'button' }, [PHASE2.confirmarBoton]),
    ]);
    const grid = container.querySelector('.signals-grid');
    const feed = container.querySelector('.feedback');
    const confirmBtn = container.querySelector('.confirm-signals');

    for (const s of señales) {
      const chip = el('button', { class: 'signal-chip', type: 'button' }, [s]);
      chip.addEventListener('click', () => {
        if (seleccionadas.has(s)) {
          seleccionadas.delete(s);
          chip.classList.remove('selected');
        } else {
          seleccionadas.add(s);
          chip.classList.add('selected');
        }
      });
      grid.appendChild(chip);
    }

    const reopen = el('button', { class: 'btn btn-ghost reopen', type: 'button' }, ['Reabrir enlace']);
    reopen.addEventListener('click', () => abrirModal());
    container.appendChild(reopen);

    confirmBtn.addEventListener('click', () => {
      const selected = [...seleccionadas];
      const result = game.calcularResultadoSeñales(selected);

      feed.textContent = '';
      feed.classList.remove('feedback-error', 'feedback-ok');

      if (result.ok) {
        feed.textContent = PHASE2.señalCorrecta;
        feed.classList.add('feedback-ok');
        markAllSignalsCorrect(grid, intento.correctSignals);
        confirmBtn.disabled = true;
        grid.querySelectorAll('.signal-chip').forEach((c) => c.style.pointerEvents = 'none');
        if (result.ultimo) {
          registerTimeout(() => showBloqueoContacto(container, feed), 1200);
          registerTimeout(() => game.avanzarSeñales(result), 2400);
        } else {
          registerTimeout(() => game.avanzarSeñales(result), 1200);
        }
      } else {
        const correctCount = selected.filter((s) => intento.correctSignals.includes(s)).length;
        feed.textContent = `Señales correctas: ${correctCount}/4. ${PHASE2.errorSeñales}`;
        feed.classList.add('feedback-error');
        markCorrectSignals(grid, intento.correctSignals);
        registerTimeout(() => game.avanzarSeñales(result), 1200);
      }
    });

    interact.appendChild(container);
  }

  function markAllSignalsCorrect(grid, correct) {
    grid.querySelectorAll('.signal-chip').forEach((c) => {
      if (correct.includes(c.textContent)) {
        c.classList.add('signal-correct');
      }
    });
  }

  function markCorrectSignals(grid, correct) {
    grid.querySelectorAll('.signal-chip').forEach((c) => {
      if (correct.includes(c.textContent)) {
        c.classList.add('signal-highlight');
      }
    });
  }

  function showBloqueoContacto(container, feed) {
    feed.textContent = '';
    const bloqueo = el('div', { class: 'qa-block bloqueo-block' }, [
      el('h3', { class: 'qa-title', style: 'color:var(--ok)' }, [PHASE2.bloqueoContactoTitulo]),
      ...PHASE2.bloqueoContactoLineas.map((l) =>
        el('div', { class: 'transition-line transition-done' }, ['> ' + l])),
      el('p', { class: 'feedback-ok' }, [PHASE2.amenazaDecreciendo]),
    ]);
    container.appendChild(bloqueo);
  }

  function renderConfiar() {
    interact.textContent = '';
    const container = el('div', { class: 'qa-block' }, [
      el('h3', { class: 'qa-title' }, [PHASE2.caminoConfiarIntro]),
      el('input', { class: 'text-input', type: 'text', placeholder: PHASE2.caminoConfiarPlaceholder, maxlength: '6' }),
      el('button', { class: 'btn btn-danger', type: 'button' }, [PHASE2.caminoConfiarBoton]),
      el('button', { class: 'btn btn-ghost', type: 'button' }, ['Ver código (simulado)']),
      el('div', { class: 'feedback', 'aria-live': 'polite' }),
    ]);
    const input = container.querySelector('.text-input');
    const sendBtn = container.querySelector('.btn-danger');
    const showCodeBtn = container.querySelector('.btn-ghost');
    const feed = container.querySelector('.feedback');

    showCodeBtn.addEventListener('click', () => abrirModal());

    sendBtn.addEventListener('click', () => {
      const val = input.value;
      if (val.length !== 6) {
        feed.textContent = 'El código entregado debe tener 6 dígitos.';
        feed.classList.add('feedback-error');
        return;
      }
      addMessage(chatBody, PHASE2.caminoConfiarRecibido);
      addMessage(chatBody, PHASE2.caminoConfiarAcceso);
      input.disabled = true;
      sendBtn.disabled = true;
      showCodeBtn.disabled = true;
      feed.textContent = '';
      setTimeout(() => game.entregarCodigo(), 900);
    });

    interact.appendChild(container);
  }

  function abrirModal() {
    recolectarModalExistente();
    const codigo = game.generarCodigoSimulado();
    const overlay = el('div', { class: 'modal-overlay', 'data-overlay': '' }, [
      el('div', { class: 'modal-window' }, [
        el('div', { class: 'modal-head' }, [
          el('span', {}, [PHASE2.modalTitulo]),
          el('button', { class: 'modal-close', type: 'button' }, ['✕']),
        ]),
        el('div', { class: 'modal-body' }, [
          el('p', {}, [PHASE2.modalSubtitulo]),
          el('div', { class: 'modal-code' }, [codigo]),
          el('p', { class: 'modal-note' }, [PHASE2.modalNota]),
          el('button', { class: 'btn btn-primary modal-copy', type: 'button' }, [PHASE2.modalCopiar]),
        ]),
      ]),
    ]);
    overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
    overlay.querySelector('.modal-copy').addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard && navigator.clipboard.writeText(codigo);
      const copy = overlay.querySelector('.modal-copy');
      copy.textContent = PHASE2.modalCopiado;
      setTimeout(() => { if (copy.isConnected) copy.textContent = PHASE2.modalCopiar; }, 1500);
    });
    root.appendChild(overlay);
  }

  function recolectarModalExistente() {
    root.querySelectorAll('[data-overlay]').forEach((o) => {
      if (o.classList.contains('popup-layer')) return;
      o.remove();
    });
  }

  renderDecision();
}
