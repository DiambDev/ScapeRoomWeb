import { el } from '../utils/dom.js';
import { registerTimeout } from '../utils/timers.js';
import { TRANSITION } from '../data/gameOver.js';

function hexChar() {
  return '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
}

function hexLine(len) {
  let s = '';
  for (let i = 0; i < len; i++) s += hexChar();
  return s;
}

function randomPos() {
  return { x: Math.random() * 80 + 5, y: Math.random() * 80 + 10 };
}

const ERROR_WORDS = ['ACCESS', 'AUTH', 'SESSION', 'SECURITY', 'ERROR', 'WARNING', 'DENIED', 'BREACH', 'UNAUTHORIZED', 'FAILED'];

export function renderTransition(root, game) {
  const panel = el('div', { class: 'screen transition' }, [
    el('div', { class: 'hex-layer' }),
    el('h1', { class: 'transition-title' }, [TRANSITION.titulo]),
    el('div', { class: 'transition-body' }),
  ]);
  root.appendChild(panel);

  const hexLayer = panel.querySelector('.hex-layer');
  const body = panel.querySelector('.transition-body');

  let hexCount = 0;
  const maxHex = 40;
  let errorPhase = false;
  let stepIdx = 0;

  const hexTimer = registerTimeout(function tickHex() {
    if (hexCount >= maxHex) return;
    const pos = randomPos();
    const isErr = errorPhase && Math.random() < 0.4;
    const text = isErr ? ERROR_WORDS[Math.floor(Math.random() * ERROR_WORDS.length)] : hexLine(8);
    const cls = isErr ? 'hex-float hex-error' : 'hex-float';
    const h = el('div', { class: cls, style: `left:${pos.x}%;top:${pos.y}%` }, [text]);
    hexLayer.appendChild(h);
    registerTimeout(() => { if (h.isConnected) h.remove(); }, 2500);
    hexCount++;
    registerTimeout(tickHex, errorPhase ? 60 : 100);
  }, 100);

  let lineIdx = 0;
  const lineTimer = registerTimeout(function tickLine() {
    if (lineIdx < TRANSITION.lineas.length) {
      const isErr = errorPhase && lineIdx > 1;
      const line = el('div', { class: isErr ? 'transition-line transition-error' : 'transition-line' });
      body.appendChild(line);
      const text = TRANSITION.lineas[lineIdx];
      let ci = 0;
      const typeTimer = registerTimeout(function typeChar() {
        if (ci < text.length) {
          line.textContent += text[ci];
          ci++;
          registerTimeout(typeChar, 18);
        } else {
          if (isErr) {
            line.textContent = '> ' + ERROR_WORDS[Math.floor(Math.random() * ERROR_WORDS.length)] + ': FAILED';
          }
          lineIdx++;
          if (lineIdx === 2) errorPhase = true;
          registerTimeout(tickLine, 200);
        }
      }, 18);
    } else {
      body.appendChild(el('div', { class: 'transition-line transition-error' }, ['> THREAT DETECTED']));
      body.appendChild(el('div', { class: 'transition-line transition-done' }, ['> RESPUESTA ACTIVADA']));
      registerTimeout(() => game.protocoloListo(), 800);
    }
  }, 400);
}
