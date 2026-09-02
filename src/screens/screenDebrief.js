// DEBRIEF — informe educativo final de repaso.
// Muestra las 4 fases del ciclo y luego una pantalla de "misión finalizada".
import { el } from '../utils/dom.js';
import { clearAllTimers } from '../utils/timers.js';
import { DEBRIEF } from '../data/gameOver.js';

export function renderDebrief(root, game) {
  const panel = el('div', { class: 'screen debrief' }, [
    el('h1', { class: 'debrief-title' }, [DEBRIEF.titulo]),
    el('div', { class: 'debrief-items' }, [
      ...DEBRIEF.items.map((it) =>
        el('div', { class: 'debrief-item' }, [
          el('h3', { class: 'debrief-item-title' }, [it.titulo]),
          el('p', { class: 'debrief-item-text' }, [it.texto]),
        ])
      ),
    ]),
    el('div', { class: 'debrief-cadena' }, [DEBRIEF.cadena]),
    el('p', { class: 'debrief-mensaje', style: 'white-space:pre-line;' }, [DEBRIEF.mensaje]),
    el('button', { class: 'btn btn-primary', type: 'button' }, [DEBRIEF.boton]),
  ]);

  const btn = panel.querySelector('button');
  btn.addEventListener('click', () => renderFinal(root, game));

  root.appendChild(panel);
}

// Pantalla de cierre "MISIÓN FINALIZADA".
function renderFinal(root, game) {
  const panel = el('div', { class: 'screen finish' }, [
    el('div', { class: 'finish-badge' }, ['✓']),
    el('h1', { class: 'finish-title' }, [DEBRIEF.finalTitulo]),
    el('p', { class: 'finish-mensaje' }, [DEBRIEF.finalMensaje]),
    el('p', { class: 'finish-credito' }, [DEBRIEF.finalCredito]),
    el('button', { class: 'btn btn-primary', type: 'button' }, [DEBRIEF.nuevaSimulacion]),
  ]);

  const btn = panel.querySelector('button');
  btn.addEventListener('click', () => game.volverAlInicio());

  // Limpia timers residuales al mostrar pantalla de cierre.
  clearAllTimers();

  // Limpia y muestra la pantalla de cierre.
  while (root.firstChild) root.removeChild(root.firstChild);
  root.appendChild(panel);
}
