// Componente global: barra de estado persistente del incidente.
// Se inyecta en las pantallas de juego (fases) para dar contexto constante.
import { el } from '../utils/dom.js';
import { registerInterval, clearTimer } from '../utils/timers.js';
import { CONFIG } from '../data/config.js';

// Mapa de fase → (etiqueta de fase, nivel de amenaza, clase visual)
const MAP = {
  fase1: { etiqueta: 'CONTENCIÓN', amenaza: 'CRÍTICA', cls: 'threat-critical', fase: 'FASE 1' },
  fase2: { etiqueta: 'INGENIERÍA SOCIAL', amenaza: 'ALTA', cls: 'threat-high', fase: 'FASE 2' },
  fase3: { etiqueta: 'RECUPERACIÓN', amenaza: 'CONTROLADA', cls: 'threat-moderate', fase: 'FASE 3' },
  fase4: { etiqueta: 'RESTAURACIÓN', amenaza: 'EN DESCENSO', cls: 'threat-moderate', fase: 'FASE 4' },
};

let _clockTimer = null;

export function renderStatusBar(root, screenKey) {
  const m = MAP[screenKey];
  if (!m) return;

  // Limpia el reloj anterior si existía
  clearTimer(_clockTimer);

  const bar = el('div', { class: 'statusbar' }, [
    el('div', { class: 'sb-cell' }, [
      el('span', { class: 'sb-label' }, ['INCIDENTE']),
      el('span', { class: 'sb-value' }, [CONFIG.incident]),
    ]),
    el('div', { class: 'sb-cell' }, [
      el('span', { class: 'sb-label' }, ['ESTADO']),
      el('span', { class: 'sb-value sb-estado' }, ['ACTIVO']),
    ]),
    el('div', { class: 'sb-cell' }, [
      el('span', { class: 'sb-label' }, ['AMENAZA']),
      el('span', { class: `sb-value ${m.cls}` }, [m.amenaza]),
    ]),
    el('div', { class: 'sb-cell' }, [
      el('span', { class: 'sb-label' }, ['FASE']),
      el('span', { class: 'sb-value' }, [`${m.fase} · ${m.etiqueta}`]),
    ]),
    el('div', { class: 'sb-cell sb-clock' }, [
      el('span', { class: 'sb-label' }, ['HORA']),
      el('span', { class: 'sb-value', 'data-clock': '' }, ['--:--']),
    ]),
  ]);
  root.appendChild(bar);

  // Actualiza el reloj inmediatamente y luego cada segundo
  tickClock();
  _clockTimer = registerInterval(tickClock, 1000);
}

function tickClock() {
  const clock = document.querySelector('[data-clock]');
  if (!clock) {
    clearTimer(_clockTimer);
    return;
  }
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  clock.textContent = `${hh}:${mm}:${ss}`;
}
