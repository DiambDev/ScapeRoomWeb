// Utilidades de DOM seguras. Toda creación/limpieza de nodos pasa por aquí.
// Usamos textContent y elementos creados con createElement para evitar
// construir HTML por concatenación (mitiga inyección de contenido).

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  if (attrs.class) node.className = attrs.class;
  if (attrs.id) node.id = attrs.id;
  if (attrs.html) node.innerHTML = attrs.html;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class' || k === 'id' || k === 'html') continue;
    if (typeof v === 'object') node[k] = v;
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

// Limpia todos los pop-ups internos y overlays residuales.
export function clearPopups(container) {
  if (!container) return;
  container.querySelectorAll('[data-popup]').forEach((p) => p.remove());
  container.querySelectorAll('[data-overlay]').forEach((o) => o.remove());
}
