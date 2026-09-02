// GameEngine — lógica del juego separada del DOM.
// Orquesta el estado, valida respuestas, avanza fases y gestiona el reinicio.
// No renderiza: emite eventos de cambio de pantalla a través de onScreen.

import { STATE, getState, transition, forceSet } from './state.js';
import { shuffle, randomCode6 } from './random.js';
import { PHASE1 } from '../data/fase1.js';
import { PHASE2 } from '../data/fase2.js';
import { PHASE3 } from '../data/fase3.js';
import { CONFIG } from '../data/config.js';

// Guarda anti doble disparo: ignora navegaciones que ocurran demasiado juntas
// (p. ej. un doble clic), pero permite navegar cuando pasan milisegundos de por
// medio, como ocurre con las secuencias impulsadas por temporizadores.
const NAV_DEBOUNCE_MS = 300;

export class Game {
  constructor() {
    this.onScreen = null; // callback(pantalla, data)
    this.onReset = null;  // hook de limpieza (temporizadores, pop-ups)
    this._lastNav = 0;

    // Fase 1 (construcción de secuencia)
    this.fase1Order = [];   // orden visual mezclado
    this.sequence = [];     // ids elegidos por el alumno, en orden

    // Fase 2 (decisión + señales + intentos)
    this.fase2Intento = 0;      // 0,1,2 (intentos 1..3)
    this.fase2SeñalesShuffle = [];
    this.codigoSimulado = null; // código mostrado en el modal

    // Fase 3
    this.fase3Respaldo = null;

    // Fase 4
    this.fase4Done = false;
  }

  // ---------- arranque y reinicio ----------

  start() {
    this.reset();
    this._goto(STATE.BOOT);
  }

  // Reinicia TODA la partida desde cero. Idempotente.
  reset() {
    forceSet(STATE.BOOT);
    this.fase1Order = [];
    this.sequence = [];
    this.fase2Intento = 0;
    this.fase2SeñalesShuffle = [];
    this.codigoSimulado = null;
    this.fase3Respaldo = null;
    this.fase4Done = false;
    this._lastNav = 0;
    if (this.onReset) this.onReset();
  }

  // ---------- navegación interna ----------

  // Guarda anti doble clic por tiempo; no bloquea navegación por temporizador.
  _goto(screen, data = {}) {
    const now = Date.now();
    if (now - this._lastNav < NAV_DEBOUNCE_MS) return false;
    this._lastNav = now;
    if (this.onScreen) this.onScreen(screen, data);
    return true;
  }

  // ---------- Fase 0: boot / warning / transition ----------

  // Al terminar el arranque normal → pantalla de detección del ataque.
  arranqueListo() {
    if (!transition('warning')) return;
    this._goto(STATE.WARNING);
  }

  // Al pulsar INICIAR → protocolo de respuesta (transition).
  iniciarMision() {
    if (!transition('iniciar')) return;
    this._goto(STATE.TRANSITION);
  }

  // Al terminar el protocolo → Fase 1 (prepara la secuencia).
  protocoloListo() {
    if (!transition('ok')) return;
    this._prepararFase1();
    this._goto(STATE.FASE1);
  }

  // ---------- Fase 1: construcción de secuencia ----------

  _prepararFase1() {
    this.fase1Order = shuffle(PHASE1.actions);
    this.sequence = [];
  }

  getFase1Acciones() {
    if (this.fase1Order.length === 0) this._prepararFase1();
    return this.fase1Order;
  }

  // El alumno añade/completa la secuencia. Devuelve la secuencia actual.
  construirSecuencia(id) {
    // Evita duplicados
    if (!this.sequence.includes(id) && this.sequence.length < PHASE1.correctOrder.length) {
      this.sequence.push(id);
    }
    return this.sequence;
  }

  quitarDeSecuencia(id) {
    this.sequence = this.sequence.filter((x) => x !== id);
    return this.sequence;
  }

  limpiarSecuencia() {
    this.sequence = [];
    return this.sequence;
  }

  secuenciaCompleta() {
    return this.sequence.length === PHASE1.correctOrder.length;
  }

  // Ejecuta el protocolo con la secuencia construida.
  ejecutarProtocolo() {
    const ok = this.sequence.length === PHASE1.correctOrder.length &&
      this.sequence.every((id, i) => id === PHASE1.correctOrder[i]);
    if (ok) {
      transition('ok');
      this._goto(STATE.FASE2, this._estadoFase2());
      return { ok: true };
    }
    // Secuencia incorrecta → GAME OVER (sin disparo doble)
    transition('game_over');
    this._goto(STATE.GAME_OVER, { motivo: 'fase1' });
    return { ok: false };
  }

  // ---------- Fase 2 ----------

  _estadoFase2() {
    const intento = PHASE2.intentos[this.fase2Intento];
    this.fase2SeñalesShuffle = shuffle(intento.availableSignals);
    return {
      intento,
      numero: this.fase2Intento + 1,
      nombre: intento.nombre,
      señales: this.fase2SeñalesShuffle,
    };
  }

  generarCodigoSimulado() {
    this.codigoSimulado = randomCode6();
    return this.codigoSimulado;
  }

  getCodigoSimulado() {
    return this.codigoSimulado;
  }

  // El alumno entrega el código → GAME OVER con pop-ups (camino "CONFIAR").
  entregarCodigo() {
    transition('game_over');
    this._goto(STATE.GAME_OVER, { motivo: 'codigo' });
  }

  // Calcula el resultado de las señales SIN avanzar estado.
calcularResultadoSeñales(selectedTexts) {
  const intento = PHASE2.intentos[this.fase2Intento];

  const correctas = new Set(
    intento.correctSignals.map(v => v.trim().toUpperCase())
  );

  const seleccionadas = [
    ...new Set(
      selectedTexts.map(v => v.trim().toUpperCase())
    )
  ];

  const coincidencias = seleccionadas.filter(v => correctas.has(v)).length;

  const totalCorrectas = correctas.size;
  const porcentajeCorrecto = coincidencias / totalCorrectas;

  const pasa = coincidencias >= 3;

  const perfecto = coincidencias === 4;

  const ultimoIntento = this.fase2Intento >= PHASE2.maxIntentos - 1;

  return {
    ok: pasa,
    perfecto,
    coincidencias,
    totalCorrectas,
    gameOver: !pasa && ultimoIntento,
    ultimo: ultimoIntento,
  };
}

  // Avanza el estado tras mostrar resultado visual al alumno.
  avanzarSeñales(resultado) {
  if (resultado.ok) {

    // 4/4 = éxito perfecto.
    // Desde cualquier intento, saltar directamente al último mensaje.
    if (resultado.perfecto && this.fase2Intento < PHASE2.maxIntentos - 1) {
      this.fase2Intento = PHASE2.maxIntentos - 1;
      this._goto(STATE.FASE2, this._estadoFase2());
      return;
    }

    // 3/4 o 4/4 en el último intento = superar Fase 2.
    if (resultado.ultimo) {
      transition('ok');
      this._goto(STATE.FASE3);
      return;
    }

    // 3/4 = avanzar normalmente al siguiente intento.
    this.fase2Intento++;
    this._goto(STATE.FASE2, this._estadoFase2());
    return;
  }

  // Menos de 3 correctas.
  if (resultado.gameOver) {
    transition('game_over');
    this._goto(STATE.GAME_OVER, { motivo: 'señales' });
    return;
  }

  // Falló este intento, pero todavía quedan oportunidades.
  this.fase2Intento++;
  this._goto(STATE.FASE2, this._estadoFase2());
}

  // ---------- Fase 3 ----------

  getArchivosPerdidos() {
    return PHASE3.archivos;
  }

  elegirRespaldo(opcion) {
    this.fase3Respaldo = opcion;
    transition('elegir');
    this._goto(STATE.RECUPERACION, { respaldo: opcion });
  }

  getFase3Respaldo() {
    return this.fase3Respaldo;
  }

  // Valida una pregunta de tipo "elige la correcta con id".
  validarOpcion(lista, idElegido, correctaId) {
    return { ok: idElegido === correctaId };
  }

  // Validación del código docente (mecanismo pedagógico, no un secreto).
  validaCodigoDocente(ingresado) {
    const ok = String(ingresado).trim().toUpperCase() === CONFIG.docenteCodigo.toUpperCase();
    return { ok };
  }

  // Restauración completada (nube) → Fase 4.
  restaurarRespaldo() {
    transition('ok');
    this._goto(STATE.FASE4);
  }

  // Desde "mismo" o "ninguno", tras validar, se continúa a Fase 4 (simulación).
  continuarRecuperacion() {
    transition('ok');
    this._goto(STATE.FASE4);
  }

  // ---------- Fase 4 ----------

  // Proceso de restauración final completado → Victoria.
  restaurarFinal() {
    transition('ok');
    this._goto(STATE.VICTORIA);
  }

  // ---------- Final ----------

  finalizarMision() {
    transition('debrief');
    this._goto(STATE.DEBRIEF);
  }

  volverAlInicio() {
    this.reset();
    this._goto(STATE.BOOT);
  }
}
