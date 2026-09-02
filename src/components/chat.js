import { el } from '../utils/dom.js';

const DOT_COLORS = ['#eab308', '#f97316', '#ef4444'];

export function renderChat(root, { titulo, rol, mensaje, riskLevel = 0 }) {
  const dotColor = DOT_COLORS[Math.min(riskLevel, 2)];
  const chat = el('div', { class: 'chat-window' }, [
    el('div', { class: 'chat-header' }, [
      el('span', { class: 'chat-dot', style: `color:${dotColor}` }, ['●']),
      el('div', { class: 'chat-id' }, [
        el('span', { class: 'chat-name' }, [titulo]),
        el('span', { class: 'chat-rol' }, [rol]),
      ]),
    ]),
    el('div', { class: 'chat-body' }),
    el('div', { class: 'chat-footer' }, [
      el('input', { class: 'chat-input', type: 'text', placeholder: 'Escribe tu respuesta (solo en la simulación)...', disabled: '' }),
      el('button', { class: 'btn btn-ghost', type: 'button', disabled: '' }, ['Enviar']),
    ]),
  ]);
  const body = chat.querySelector('.chat-body');
  addMessage(body, mensaje);
  root.appendChild(chat);
  return chat;
}

export function addMessage(body, texto) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ts = el('div', { class: 'bubble-ts' }, [`${hh}:${mm}`]);
  const bubble = el('div', { class: 'bubble soporte' }, [ts, el('div', {}, [texto])]);
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
  return bubble;
}
