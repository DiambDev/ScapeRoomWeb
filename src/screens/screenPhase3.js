// FASE 3 — Recuperación.
// Muestra el análisis de integridad (animado), la pérdida de 2 archivos y la
// pregunta por el respaldo. Según la opción se despliega el escenario.
import { el } from '../utils/dom.js';
import { registerTimeout, registerInterval, clearTimer } from '../utils/timers.js';
import { PHASE3 } from '../data/fase3.js';
import { renderStatusBar } from '../components/statusbar.js';

export function renderPhase3(root, game) {
  renderStatusBar(root, 'fase3');

  const panel = el('div', { class: 'screen phase3' }, [
    el('h2', { class: 'phase-title' }, [`${PHASE3.fase} — ${PHASE3.titulo}`]),
  ]);
  root.appendChild(panel);

  // --- Análisis de integridad ---
  const analisis = el('div', { class: 'integrity', style: 'visibility:hidden;' }, [
    el('h3', { class: 'integrity-title' }, [PHASE3.analisisTitulo]),
    el('div', { class: 'integrity-body' }),
  ]);
  panel.appendChild(analisis);
  const analisisBody = analisis.querySelector('.integrity-body');
  analisis.style.visibility = 'visible';

  let idx = 0;
  const reveal = () => {
    if (idx < PHASE3.analisis.length) {
      const [texto, estado] = [PHASE3.analisis[idx].texto, PHASE3.analisis[idx].estado];
      analisisBody.appendChild(
        el('div', { class: 'integrity-line' }, [
          el('span', {}, [texto]),
          el('span', { class: estado === 'OK' ? 'integrity-ok' : 'integrity-err' }, [estado]),
        ])
      );
      idx++;
      registerTimeout(reveal, 420);
    } else {
      registerTimeout(mostrarPerdida, 500);
    }
  };
  reveal();

  // --- Archivos perdidos + pregunta de respaldo ---
  function mostrarPerdida() {
    const archivos = game.getArchivosPerdidos();

    const perdida = el('div', { class: 'perdida' }, [
      el('h3', { class: 'perdida-title' }, [PHASE3.perdidaTitulo]),
      el('div', { class: 'archivos-loss' }, [
        ...archivos.map((a) =>
          el('div', { class: 'archivo-card' }, [
            el('span', { class: 'archivo-name' }, [a.nombre]),
            el('span', { class: 'archivo-ruta' }, [a.ruta]),
          ])
        ),
      ]),
      el('p', { class: 'link-nota' }, [PHASE3.aclaracionRutas]),
    ]);
    panel.appendChild(perdida);

    const question = el('div', { class: 'qa-block' }, [
      el('h3', { class: 'qa-title' }, [PHASE3.preguntaRespaldo]),
      el('div', { class: 'respaldo-grid' }, [
        ...PHASE3.opcionesRespaldo.map((o) => {
          const b = el('button', { class: 'respaldo-card', type: 'button' }, [
            el('span', { class: 'respaldo-icon' }, [o.icono]),
            el('span', { class: 'respaldo-label' }, [o.label]),
          ]);
          b.addEventListener('click', () => game.elegirRespaldo(o.id));
          return b;
        }),
      ]),
    ]);
    panel.appendChild(question);
  }

  root.appendChild(panel);
}

// Pantalla de RECUPERACIÓN según el respaldo elegido (nube / mismo / ninguno).
export function renderRecuperacion(root, game, data) {
  renderStatusBar(root, 'fase3');
  const panel = el('div', { class: 'screen phase3' }, [
    el('h2', { class: 'phase-title' }, [`${PHASE3.fase} — ${PHASE3.titulo}`]),
    el('p', { class: 'phase-intro' }, [PHASE3.estadoBloqueado]),
    el('p', { class: 'phase-intro' }, [PHASE3.estadoRechazado]),
  ]);
  root.appendChild(panel);

  const escolha = data.respaldo;
  if (escolha === 'nube') escenarioNube(panel, game);
  else if (escolha === 'mismo') escenarioMismo(panel, game);
  else escenarioNinguno(panel, game);
}

// ---- CAMINO A: NUBE ----
function escenarioNube(panel, game) {
  const n = PHASE3.nube;
  const seleccion = new Set();

  const estado = el('div', { class: 'feedback', 'aria-live': 'polite' });
  const archivos = el('div', { class: 'respaldo-grid' });
  const restoreBtn = el('button', { class: 'btn btn-primary', type: 'button', disabled: '' }, [n.botonRestaurar]);

  const block = el('div', { class: 'qa-block recovery' }, [
    el('h3', { class: 'rec-title', style: 'color:var(--ok);' }, [n.titulo]),
    el('p', {}, [n.intro]),
    archivos,
    el('p', { class: 'link-nota' }, [n.avisoSeleccion]),
    restoreBtn,
    estado,
  ]);
  panel.appendChild(block);

  function renderArchivos() {
    archivos.textContent = '';
    for (const a of n.archivosRespaldo) {
      const marcado = seleccion.has(a.ref);
      const card = el('button', { class: 'respaldo-card' + (marcado ? ' selected' : ''), type: 'button' }, [
        el('span', { class: 'respaldo-icon' }, ['📄']),
        el('span', { class: 'respaldo-label' }, [a.nombre]),
      ]);
      card.addEventListener('click', () => {
        if (seleccion.has(a.ref)) seleccion.delete(a.ref);
        else seleccion.add(a.ref);
        renderArchivos();
        restoreBtn.disabled = seleccion.size !== n.archivosRespaldo.length;
        estado.textContent = '';
      });
      archivos.appendChild(card);
    }
  }
  renderArchivos();

  restoreBtn.addEventListener('click', () => {
    if (seleccion.size !== n.archivosRespaldo.length) return;
    restoreBtn.disabled = true;
    const progress = el('div', { class: 'restore-progress' }, [
      el('div', { class: 'restore-bar' }),
    ]);
    estado.textContent = '';
    block.appendChild(progress);

    const bar = progress.querySelector('.restore-bar');
    const lines = n.barraPasos;
    let p = 0;
    const timer = registerIntervalSteps(bar, lines, () => {
      clearTimer(timer);
      estado.textContent = n.tituloExito;
      estado.classList.add('feedback-ok');
      const cont = el('button', { class: 'btn btn-primary', type: 'button' }, [PHASE3.docente.continuar]);
      cont.addEventListener('click', () => game.restaurarRespaldo());
      block.appendChild(cont);
    });
  });
}

// Avanza una barra de progreso por pasos y llama onDone al terminar.
function registerIntervalSteps(bar, lines, onDone) {
  let i = 0;
  let timer;
  timer = registerInterval(() => {
    if (i < lines.length) {
      bar.style.width = `${Math.round(((i + 1) / lines.length) * 100)}%`;
      i++;
    } else {
      clearTimer(timer);
      onDone();
    }
  }, 650);
  return timer;
}

// ---- CAMINO B: MISMO EQUIPO ----
function escenarioMismo(panel, game) {
  const m = PHASE3.mismoEquipo;
  const block = el('div', { class: 'qa-block recovery' }, [
    el('h3', { class: 'qa-title', style: 'color:var(--warning);' }, [m.advertenciaTitulo]),
    el('p', {}, [m.advertenciaTexto]),
    el('p', {}, [m.pregunta]),
    el('div', { class: 'qa-options' }, [
      ...m.opciones.map((o) => {
        const b = el('button', { class: 'btn btn-ghost', type: 'button' }, [o.label]);
        b.addEventListener('click', () => {
          block.querySelectorAll('.feedback').forEach((x) => x.remove());
          applyDisabled(block, true);
          if (o.id === m.correcta) {
            const ok = el('p', { class: 'feedback feedback-ok' }, [m.feedbackOk]);
            block.appendChild(ok);
            const cont = el('button', { class: 'btn btn-primary', type: 'button' }, [PHASE3.docente.continuar]);
            cont.addEventListener('click', () => game.continuarRecuperacion());
            block.appendChild(cont);
          } else {
            const err = el('p', { class: 'feedback feedback-error' }, [m.feedbackError]);
            block.appendChild(err);
            applyDisabled(block, false);
          }
        });
        return b;
      }),
    ]),
  ]);
  panel.appendChild(block);
}

// ---- CAMINO C: SIN RESPALDO ----
function escenarioNinguno(panel, game) {
  const n = PHASE3.ninguno;
  const block = el('div', { class: 'qa-block recovery' }, [
    el('h3', { class: 'rec-title', style: 'color:var(--danger);' }, [n.titulo]),
    el('p', {}, [n.mensaje]),
    el('p', {}, [n.pregunta]),
    el('div', { class: 'qa-options' }, [
      ...n.opciones.map((o) => {
        const b = el('button', { class: 'btn btn-ghost', type: 'button' }, [o.label]);
        b.addEventListener('click', () => {
          block.querySelectorAll('.feedback').forEach((x) => x.remove());
          applyDisabled(block, true);
          if (o.id === n.correcta) {
            const ok = el('p', { class: 'feedback feedback-ok' }, [n.feedbackOk]);
            block.appendChild(ok);
            const validacion = renderDocente(block, game);
            block.appendChild(validacion);
          } else {
            const err = el('p', { class: 'feedback feedback-error' }, [n.feedbackError]);
            block.appendChild(err);
            applyDisabled(block, false);
          }
        });
        return b;
      }),
    ]),
  ]);
  panel.appendChild(block);
}

// Validación del docente: botón discreto que abre el campo de código.
function renderDocente(panel, game) {
  const d = PHASE3.docente;
  const wrap = el('div', { class: 'docente-zone' });
  const toggle = el('button', { class: 'btn btn-ghost', type: 'button' }, [d.boton]);
  toggle.addEventListener('click', () => {
    const form = el('div', { class: 'docente-form' }, [
      el('label', { class: 'field-label' }, [d.label]),
      el('input', { class: 'text-input', type: 'text', placeholder: d.placeholder }),
      el('button', { class: 'btn btn-primary', type: 'button' }, [d.botonValidar]),
      el('div', { class: 'feedback', 'aria-live': 'polite' }),
    ]);
    const input = form.querySelector('.text-input');
    const btn = form.querySelector('button');
    const feed = form.querySelector('.feedback');
    btn.addEventListener('click', () => {
      const res = game.validaCodigoDocente(input.value);
      if (res.ok) {
        feed.textContent = d.ok;
        feed.classList.add('feedback-ok');
        input.disabled = true;
        btn.disabled = true;
        const cont = el('button', { class: 'btn btn-primary', type: 'button' }, [d.continuar]);
        cont.addEventListener('click', () => game.continuarRecuperacion());
        form.appendChild(cont);
      } else {
        feed.textContent = d.error;
        feed.classList.add('feedback-error');
      }
    });
    wrap.textContent = '';
    wrap.appendChild(form);
    toggle.disabled = true;
  });
  wrap.appendChild(toggle);
  return wrap;
}

// Habilita/deshabilita todos los botones primarios/ghost dentro de un bloque.
function applyDisabled(block, disabled) {
  block.querySelectorAll('.btn-ghost, .btn-primary[type="button"]').forEach((b) => {
    b.disabled = disabled;
  });
}
