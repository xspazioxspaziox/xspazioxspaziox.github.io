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
      .modulateScale(osc(8).rotate(Math.sin(time)), .5)
      .thresh(.8)
.colorama(5)
.modulateScale(o0)
      .diff(src(o0).scale(1.8))
      .modulateScale(osc(2).modulateRotate(o0, .74))
      .diff(src(o0).rotate([-.012, .01, -.002, 0]).scrollY(0, [-1/199800, 0].fast(0.7)))
      .out();
