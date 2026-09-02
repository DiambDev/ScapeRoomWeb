// FASE 1 — Contención: construir una secuencia de respuesta (PASO 1..3).
// El estudiante elige/ordena 3 acciones y las confirma con EJECUTAR PROTOCOLO.
// El orden correcto está fijado en data; el orden de las tarjetas se mezcla.
import { el } from '../utils/dom.js';
import { PHASE1 } from '../data/fase1.js';
import { renderStatusBar } from '../components/statusbar.js';

export function renderPhase1(root, game) {
  const acciones = game.getFase1Acciones();

  renderStatusBar(root, 'fase1');

  const titulo = el('h2', { class: 'phase-title' }, [`${PHASE1.fase} — ${PHASE1.titulo}`]);
  const intro = el('p', { class: 'phase-intro' }, [
    PHASE1.mensajeSistema1 + ' ' + PHASE1.mensajeSistema2 + ' ' + PHASE1.pregunta,
  ]);

  // --- Zona de construcción (slots PASO 1..3) ---
  const slotsWrap = el('div', { class: 'seq-wrap' }, [
    el('h3', { class: 'seq-title' }, [PHASE1.construirTitulo]),
    el('div', { class: 'seq-slots' }),
  ]);
  const slotsRow = slotsWrap.querySelector('.seq-slots');

  // --- Tarjetas de acciones (mezcladas) ---
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
    titulo,
    intro,
    slotsWrap,
    el('div', { class: 'seq-actions' }, [ejecutarBtn, limpiarBtn, aviso]),
    tarjetas,
    feedback,
  ]);
  root.appendChild(panel);

  // --- Render de slots (PASO 1..3) ---
  function renderSlots() {
    slotsRow.textContent = '';
    for (let i = 0; i < PHASE1.correctOrder.length; i++) {
      const seq = game.sequence;
      const id = seq[i];
      const accion = acciones.find((a) => a.id === id);
      const slot = el('div', { class: 'seq-slot' + (id ? ' filled' : '') }, [
        el('span', { class: 'seq-step' }, [`PASO ${i + 1}`]),
        el('span', { class: 'seq-value' }, [id ? accion.label : PHASE1.placeholderPaso]),
      ]);
      slotsRow.appendChild(slot);
    }
  }

  // --- Render de tarjetas ---
  function renderTarjetas() {
    tarjetas.textContent = '';
    for (const accion of acciones) {
      const usada = game.sequence.includes(accion.id);
      const card = el(
        'button',
        { class: 'action-card' + (usada ? ' used' : ''), type: 'button', disabled: usada ? '' : null },
        [el('span', { class: 'action-label' }, [accion.label]), el('span', { class: 'action-detail' }, [accion.detail])]
      );
      if (!usada) {
        card.addEventListener('click', () => {
          game.construirSecuencia(accion.id);
          renderSlots();
          renderTarjetas();
          updateControls();
        });
      }
      tarjetas.appendChild(card);
    }
  }

  function updateControls() {
    const completa = game.secuenciaCompleta();
    ejecutarBtn.disabled = !completa;
  }

  limpiarBtn.addEventListener('click', () => {
    game.limpiarSecuencia();
    renderSlots();
    renderTarjetas();
    updateControls();
    feedback.textContent = '';
  });

  // El botón permite QUITAR una acción ya colocada tocándola.
  slotsRow.addEventListener('click', (e) => {
    const slot = e.target.closest('.seq-slot');
    if (!slot) return;
    const pasoIdx = Array.prototype.indexOf.call(slotsRow.children, slot);
    const seq = game.sequence;
    if (pasoIdx >= 0 && pasoIdx < seq.length) {
      game.quitarDeSecuencia(seq[pasoIdx]);
      renderSlots();
      renderTarjetas();
      updateControls();
    }
  });

  ejecutarBtn.addEventListener('click', () => {
    if (!game.secuenciaCompleta()) return;
    game.ejecutarProtocolo();
  });

  renderSlots();
  renderTarjetas();
  updateControls();
}
