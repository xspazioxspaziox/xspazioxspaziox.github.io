// ======================================================
// include.js - di base non serve mai toccare questo file
// ------------------------------------------------------
// Funzioni principali:
// - Inietta automaticamente HEADER e FOOTER nei <div id="header"> e <div id="footer">.
// - Riscrive i percorsi relativi (href/src) per funzionare
//   sia dalla root che da sottocartelle (es. /eventi/…).
// - Aggiunge placeholder temporanei per evitare "saltelli" (CLS).
// - Corregge lo scroll elastico su vecchie versioni iOS.
// ------------------------------------------------------
// Autore: Spazio X
// Ultimo aggiornamento: 2025
// ======================================================

(function () {
  'use strict';

  // ------------------------------------------------------
  // 1. Individua il percorso BASE del sito
  // ------------------------------------------------------
  function getBase() {
    var s = document.currentScript || document.scripts[document.scripts.length - 1];
    var url = new URL(s.src, location.href);
    var i = url.pathname.indexOf('/assets/');
    return i >= 0 ? url.pathname.slice(0, i) : '';
  }

  var BASE = getBase();

  // ------------------------------------------------------
  // 2. Riscrive href/src all’interno degli include
  // ------------------------------------------------------
  function rewrite(html) {
    return html.replace(/(href|src)=["']\/?assets\//g, '$1="' + BASE + '/assets/');
  }

  // ------------------------------------------------------
  // 3. Funzione di iniezione (header/footer)
  // ------------------------------------------------------
  function inject(id, path) {
    var el = document.getElementById(id);
    if (!el) return;

    var url = BASE + path;
    fetch(url + '?v=' + Date.now(), { cache: 'no-store' })
      .then(r => r.ok ? r.text() : Promise.reject(path))
      .then(t => { el.innerHTML = rewrite(t); })
      .catch(u => console.warn('Include fallito:', u));
  }

  // ------------------------------------------------------
  // 4. Placeholder per evitare CLS
  // ------------------------------------------------------
  function putPlaceholders() {
    var h = document.getElementById('header');
    var f = document.getElementById('footer');
    if (h && !h.firstElementChild) h.innerHTML = '<div style="height:var(--header-h)"></div>';
    if (f && !f.firstElementChild) f.innerHTML = '<div style="height:var(--footer-h)"></div>';
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', putPlaceholders, { once: true });
  else
    putPlaceholders();

  // ------------------------------------------------------
  // 5. Inietta header e footer
  // ------------------------------------------------------
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', () => {
      inject('header', '/partials/header.html');
      inject('footer', '/partials/footer.html');
    }, { once: true });
  else {
    inject('header', '/partials/header.html');
    inject('footer', '/partials/footer.html');
  }

  // ------------------------------------------------------
  // 6. FIX iOS – previene lo scroll elastico globale
  // ------------------------------------------------------
  (function () {
    var isOldiOS =
      /iP(ad|hone|od)/.test(navigator.userAgent) &&
      !(window.CSS && CSS.supports('overscroll-behavior: none'));

    if (!isOldiOS) return;

    document.addEventListener(
      'touchmove',
      e => {
        if (!e.target.closest('.flyer-scroll')) e.preventDefault();
      },
      { passive: false }
    );

    document.addEventListener(
      'touchstart',
      e => {
        var s = e.target.closest('.flyer-scroll');
        if (!s) return;
        if (s.scrollTop <= 0) s.scrollTop = 1;
        var max = s.scrollHeight - s.clientHeight;
        if (s.scrollTop >= max) s.scrollTop = max - 1;
      },
      { passive: true }
    );
  })();

  // ------------------------------------------------------
  // 7. SFONDO CASUALE SU OGNI REFRESH
  // ------------------------------------------------------
  (function () {
    // Elenco delle immagini di sfondo (personalizza i percorsi)
    const sfondi = [
      '/assets/img/sfondo1.jpg',
      '/assets/img/sfondo2.jpg',
      '/assets/img/sfondo3.jpg',
      '/assets/img/sfondo4.jpg'
    ];

    if (!sfondi.length) return;

    // Precarica per evitare flash iniziale
    sfondi.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Selezione casuale
    const pick = Math.floor(Math.random() * sfondi.length);

    // Applica lo sfondo al body quando il DOM è pronto
    const setBg = () => {
      document.body.style.backgroundImage = `url('${sfondi[pick]}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setBg, { once: true });
    } else {
      setBg();
    }
  })();

})();
