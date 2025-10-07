// hydra.js — setup robusto per Hydra dentro #hydra-canvas
(function () {
  const canvas = document.getElementById('hydra-canvas');
  if (!canvas) {
    console.warn('[Hydra] Canvas #hydra-canvas non trovato.');
    return;
  }

  function startHydra() {
    try {
      // Inizializza Hydra dentro il canvas della cornice
      const hydra = new Hydra({
        canvas,
        detectAudio: false
      });

      // Adatta la risoluzione del canvas alla dimensione CSS (anche su retina)
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      function fitResolution() {
        const r = canvas.getBoundingClientRect();
        const w = Math.max(1, Math.floor(r.width * DPR));
        const h = Math.max(1, Math.floor(r.height * DPR));
        hydra.setResolution(w, h);
      }
      fitResolution();
      window.addEventListener('resize', fitResolution);

      // --- Patch visual Hydra (con fallback se colorama non esiste)
      let chain = osc(4, 0.1, 1.2)
        .modulateScale(osc(8).rotate(Math.sin(time)), 0.5)
        .thresh(0.8);

      // colorama è disponibile su molte versioni, ma non tutte: applicala solo se c'è
      if (typeof chain.colorama === 'function') {
        chain = chain.colorama(5);
      }

      chain = chain
        .modulateScale(o0) // usa il buffer di uscita come modulatore
        .diff(src(o0).scale(1.8))
        .modulateScale(osc(2).modulateRotate(o0, 0.74))
        .diff(
          src(o0)
            .rotate([ -0.012, 0.01, -0.002, 0 ])
            .scrollY(0, [ -1 / 199800, 0 ].fast(0.7))
        );

      chain.out();

    } catch (err) {
      console.error('[Hydra] Errore inizializzazione:', err);
    }
  }

  // Avvia quando la libreria è pronta
  if (typeof Hydra === 'undefined') {
    // Se per qualche motivo hydra-synth non è ancora caricato, riprova al load
    window.addEventListener('load', startHydra, { once: true });
  } else {
    startHydra();
  }
})();
