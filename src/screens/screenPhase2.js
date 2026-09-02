// FASE 2 — Ingeniería Social.
// Split: chat del soporte externo (izquierda) + interfaz SO (derecha).
// Flujo por intento:
//   - Confiar  : abre el modal del código de 6 dígitos (simulado); al entregarlo
//                en el chat → GAME OVER (camino del error).
//   - Desconfiar: identificar las señales correctas del mensaje; al acertar los
//                 tres se bloquea al contacto y se pasa a Fase 3.
import { el } from '../utils/dom.js';
import { renderChat, addMessage } from '../components/chat.js';
import { renderStatusBar } from '../components/statusbar.js';
import { PHASE2 } from '../data/fase2.js';
import { CONFIG } from '../data/config.js';

export function renderPhase2(root, game, data) {
  const intento = data.intento;   // objeto crudo de PHASE2.intentos
  const numero = data.numero;
  const nombre = data.nombre;
  const señales = data.señales;   // orden mezclado

  renderStatusBar(root, 'fase2');

  const header = el('div', { class: 'status-strip' }, [
    el('span', { class: 'status-pill status-active' }, [`FASE 2 · INGENIERÍA SOCIAL · ${nombre.toUpperCase()}`]),
    el('span', { class: 'status-progress' }, [`Intento ${numero} de ${PHASE2.maxIntentos}`]),
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

  // --- Izquierda: chat ---
  const chat = renderChat(left, {
    titulo: CONFIG.contactoNombre,
    rol: CONFIG.contactoRol,
    mensaje: intento.mensaje,
  });
  const chatBody = chat.querySelector('.chat-body');

  // --- Derecha: OS + enlace sospechoso ---
  const os = el('div', { class: 'os-window' }, [
    el('div', { class: 'os-topbar' }, [
      el('span', {}, ['Sistema — Usuario: Estudiante']),
      el('span', { class: 'os-clock' }, ['Estado: CONECTADO']),
    ]),
    el('div', { class: 'os-content' }, [
      el('div', { class: 'os-notice' }, [
        el('p', {}, ['Has recibido un mensaje del "soporte" en el chat.']),
      ]),
      el('div', { class: 'link-block' }, [
        el('span', { class: 'link-label' }, ['El contacto te envió un enlace:']),
        el('button', { class: 'link-fake', type: 'button' }, [intento.botonVerificar]),
      ]),
    ]),
  ]);
  right.appendChild(os);

  // --- Zona de decisión ---
  const interact = el('div', { class: 'phase2-interact' });
  panel.appendChild(interact);

  function renderDecision() {
    interact.textContent = '';
    interact.appendChild(
      el('div', { class: 'qa-block' }, [
        el('h3', { class: 'qa-title' }, [PHASE2.decisionTitulo]),
        el('p', { class: 'qa-aviso' }, [PHASE2.decisionPregunta]),
        el('div', { class: 'qa-options decision-btns' }, [
          el('button', { class: 'btn btn-danger', type: 'button' }, [PHASE2.opcionConfiar]),
          el('button', { class: 'btn btn-primary', type: 'button' }, [PHASE2.opcionDesconfiar]),
        ]),
      ])
    );
    const [confiar, desconfiar] = interact.querySelectorAll('.decision-btns button');
    confiar.addEventListener('click', () => {
      addMessage(chatBody, intento.botonVerificar + ' (enlace abierto)');
      renderConfiar();
    });
    desconfiar.addEventListener('click', () => {
      addMessage(chatBody, 'No confío en esta solicitud.');
      renderSeñales();
    });
  }

  // --- Camino desconfiar: identificar señales ---
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

    // Permitir reabrir el enlace para inspeccionar.
    const reopen = el('button', { class: 'btn btn-ghost reopen', type: 'button' }, ['Reabrir enlace']);
    reopen.addEventListener('click', () => abrirModal());
    container.appendChild(reopen);

    confirmBtn.addEventListener('click', () => {
      const res = game.validarSeñales([...seleccionadas]);
      if (!res.ok && !res.gameOver) {
        feed.textContent = PHASE2.errorSeñales;
        feed.classList.add('feedback-error');
      }
    });

    interact.appendChild(container);
  }

  // --- Camino confiar: entrega del código → GAME OVER ---
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
      // Pequeña pausa antes del game over para que se vea la respuesta del soporte
      setTimeout(() => game.entregarCodigo(), 900);
    });

    interact.appendChild(container);
  }

  // --- Modal del código simulado (6 dígitos) ---
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

  // Elimina cualquier modal residual antes de abrir uno nuevo.
  function recolectarModalExistente() {
    root.querySelectorAll('[data-overlay]').forEach((o) => {
      if (o.classList.contains('popup-layer')) return;
      o.remove();
    });
  }

  renderDecision();
}
