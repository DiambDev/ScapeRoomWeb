// Componente: chat del supuesto soporte externo.
// El estudiante puede "responder" (enviar código) como vía de aprendizaje del error.
import { el } from '../utils/dom.js';

export function renderChat(root, { titulo, rol, mensaje }) {
  const chat = el('div', { class: 'chat-window' }, [
    el('div', { class: 'chat-header' }, [
      el('span', { class: 'chat-dot' }, ['●']),
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

// Añade una burbuja del soporte al cuerpo del chat.
export function addMessage(body, texto) {
  const bubble = el('div', { class: 'bubble soporte' }, [texto]);
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
  return bubble;
}
