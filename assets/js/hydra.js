// hydra.js — setup e patch Hydra per la home

// Assicurati che esista il canvas #hydra-canvas
const hydraCanvas = document.getElementById('hydra-canvas');
if (hydraCanvas) {
  const hydra = new Hydra({
    canvas: hydraCanvas,
    detectAudio: false
  });

  // Patch visual Hydra (puoi modificarla liberamente)
  osc(4, 0.1, 1.2)

