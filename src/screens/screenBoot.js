// BOOT — arranque normal del "TECSUP Secure Workspace".
// Simula un arranque saludable durante un momento, antes de que se detecte
// el incidente. Al terminar, el game avanza a la advertencia de seguridad.
import { el } from '../utils/dom.js';
import { registerTimeout } from '../utils/timers.js';
import { BOOT } from '../data/gameOver.js';
import { CONFIG } from '../data/config.js';

export function renderBoot(root, game) {
  const panel = el('div', { class: 'screen boot' }, [
    el('div', { class: 'boot-logo' }, ['◈']),
    el('h1', { class: 'boot-title' }, [BOOT.titulo]),
    el('p', { class: 'boot-sub' }, [BOOT.subtitulo]),
    el('div', { class: 'boot-status' }, [
      ...BOOT.estados.map(([k, v]) =>
        el('div', { class: 'boot-row' }, [
          el('span', { class: 'boot-key' }, [k]),
          el('span', { class: 'boot-val boot-ok' }, [v]),
        ])
      ),
    ]),
  ]);
  root.appendChild(panel);

  registerTimeout(() => game.arranqueListo(), CONFIG.bootDuration);
}
