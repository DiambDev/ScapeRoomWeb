// ScreenManager: registra pantallas y las muestra dentro del contenedor raíz.
// Delega la construcción visual a cada módulo de pantalla.

import { clear, clearPopups } from '../utils/dom.js';

export class ScreenManager {
  constructor(root, game) {
    this.root = root;
    this.game = game;
    this.screens = {};
    game.onScreen = (name, data) => this.show(name, data);
  }

  register(name, renderer) {
    this.screens[name] = renderer;
  }

  // Muestra una pantalla: limpia dom y pop-ups residuales, luego renderiza.
  show(name, data = {}) {
    const renderer = this.screens[name];
    if (!renderer) {
      console.error('Pantalla no registrada:', name);
      return;
    }
    clearPopups(this.root);
    clear(this.root);
    renderer(this.root, this.game, data);
  }
}
