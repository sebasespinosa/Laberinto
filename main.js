import { inicializarCanvas } from './src/stageManager.js';
import { setupKeyboardControls, setupClickHandler } from './src/eventHandlers.js';

window.onload = () => {
  inicializarCanvas('stageZero', 30, 30, 150, 150, 8, 8);
  setupKeyboardControls();
  setupClickHandler();
};