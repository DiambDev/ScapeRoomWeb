// Utilidades de aleatoriedad. La aleatoriedad NUNCA cambia la respuesta
// correcta: solo mezcla el ORDEN VISUAL de elementos e introduce valores
// simulados (códigos, posiciones, tamaños).

// Fisher-Yates shuffle (no muta el original).
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Código simulado de 6 dígitos (generado localmente, sin carácter real).
export function randomCode6() {
  let s = '';
  for (let i = 0; i < 6; i++) s += Math.floor(Math.random() * 10);
  return s;
}

// Posición/tamaño aleatorio para un pop-up interno, dentro de área segura.
export function randomPopupStyle(viewportW = window.innerWidth, viewportH = window.innerHeight) {
  const w = 160 + Math.floor(Math.random() * 220);
  const h = 90 + Math.floor(Math.random() * 140);
  const x = Math.random() * Math.max(viewportW - w, 0) * 0.8;
  const y = Math.random() * Math.max(viewportH - h, 0) * 0.8;
  return { w, h, x, y };
}
