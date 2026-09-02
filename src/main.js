// Bootstrap — ensambla el ScreenManager, el Game y registra todas las pantallas.
import { Game } from './core/game.js';
import { ScreenManager } from './screens/screenManager.js';
import { STATE } from './core/state.js';
import { renderBoot } from './screens/screenBoot.js';
import { renderWarning } from './screens/screenWarning.js';
import { renderTransition } from './screens/screenTransition.js';
import { renderPhase1 } from './screens/screenPhase1.js';
import { renderPhase2 } from './screens/screenPhase2.js';
import { renderPhase3, renderRecuperacion } from './screens/screenPhase3.js';
import { renderPhase4 } from './screens/screenPhase4.js';
import { renderGameOver, stopPopups } from './screens/screenGameOver.js';
import { renderVictory } from './screens/screenVictory.js';
import { renderDebrief } from './screens/screenDebrief.js';
import { clearAllTimers } from './utils/timers.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (!root) throw new Error('No se encontró el contenedor #app');

  const game = new Game();

  // El reinicio centralizado debe detener pop-ups y temporizadores residuales.
  game.onReset = () => {
    stopPopups();
    clearAllTimers();
  };

  const manager = new ScreenManager(root, game);
  manager.register(STATE.BOOT, renderBoot);
  manager.register(STATE.WARNING, renderWarning);
  manager.register(STATE.TRANSITION, renderTransition);
  manager.register(STATE.FASE1, renderPhase1);
  manager.register(STATE.FASE2, renderPhase2);
  manager.register(STATE.FASE3, renderPhase3);
  manager.register(STATE.RECUPERACION, renderRecuperacion);
  manager.register(STATE.FASE4, renderPhase4);
  manager.register(STATE.GAME_OVER, renderGameOver);
  manager.register(STATE.VICTORIA, renderVictory);
  manager.register(STATE.DEBRIEF, renderDebrief);

  // Control de navegación hacia atrás / recarga: vuelve a inicio.
  window.addEventListener('beforeunload', () => {
    stopPopups();
    clearAllTimers();
  });

  game.start();
});
