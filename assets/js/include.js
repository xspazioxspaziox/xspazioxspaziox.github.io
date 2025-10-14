// ======================================================
// include.js - di base non serve mai toccare questo file
// ------------------------------------------------------
// Funzioni principali:
// - Inietta automaticamente HEADER e FOOTER nei <div id="header"> e <div id="footer">.
// - Riscrive i percorsi relativi (href/src) per funzionare
//   sia dalla root che da sottocartelle (es. /eventi/...).
// - Aggiunge placeholder temporanei per evitare "saltelli" (CLS).
// - Corregge lo scroll elastico su vecchie versioni iOS.
// - (Nuovo) Applica uno sfondo casuale ad ogni refresh (configurabile).
// ------------------------------------------------------
// Autore: Spazio X
// Ultimo aggiornamento: 2025
// ======================================================

(function () {
  'use strict';

  // ------------------------------------------------------
  // 1) Individua il percorso BASE del sito
  //    (serve per costruire link corretti anche da sottocartelle)
  // ------------------------------------------------------
  function getBase() {
    var s = document.currentScript || document.scripts[document.scripts.length - 1];
    var url = new URL(s.src, location.href);
    var i = url.pathname.indexOf('/assets/');
    return i >= 0 ? url.pathname.slice(0, i) : '';
  }

  // Percorso base (usato in tutte le fetch e utilità)
  var BASE = getBase();
  var withBase = function (p) { return BASE + p; };

  // ------------------------------------------------------
  // 2) Riscrive gli href/src all’interno degli include
  //    - Per far funzionare immagini e link da sottocartelle
  // ------------------------------------------------------
  function rewrite(html) {
    return html.replace(/(href|src)=["']\/?assets\//g, '$1="' + BASE + '/assets/');
  }

  // ------------------------------------------------------
  // 3) Funzione di iniezione (header/footer)
  // ------------------------------------------------------
  function inject(id, path) {
    var el = document.getElementById(id);
    if (!el) return;

    var url = BASE + path;
    fetch(url + '?v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(path); })
      .then(function (t) { el.innerHTML = rewrite(t); })
      .catch(function (u) { console.warn('Include fallito:', u); });
  }

  // ------------------------------------------------------
  // 4) Placeholder per evitare CLS
  // ------------------------------------------------------
  function putPlaceholders() {
    var h = document.getElementById('header');
    var f = document.getElementById('footer');
    if (h && !h.firstElementChild) h.innerHTML = '<div style="height:var(--header-h)"></div>';
    if (f && !f.firstElementChild) f.innerHTML = '<div style="height:var(--footer-h)"></div>';
  }

  // 5) Esecuzione placeholder quando il DOM è pronto
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', putPlaceholders, { once: true });
  else
    putPlaceholders();

  // ------------------------------------------------------
  // 6) Inietta header e footer
  // ------------------------------------------------------
  function doInject() {
    inject('header', '/partials/header.html');
    inject('footer', '/partials/footer.html');
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', doInject, { once: true });
  else
    doInject();

  // ------------------------------------------------------
  // 7) FIX iOS – previene lo scroll elastico globale
  // ------------------------------------------------------
  (function () {
    var isOldiOS =
      /iP(ad|hone|od)/.test(navigator.userAgent) &&
      !(window.CSS && CSS.supports('overscroll-behavior: none'));

    if (!isOldiOS) return;

    // Impedisce lo scroll sulla pagina, ma lo consente nei box con .flyer-scroll
    document.addEventListener(
      'touchmove',
      function (e) { if (!e.target.closest('.flyer-scroll')) e.preventDefault(); },
      { passive: false }
    );

    // Previene il “blocco” agli estremi dello scroll interno
    document.addEventListener(
      'touchstart',
      function (e) {
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
  // 8) SFONDO CASUALE SU OGNI REFRESH (CONFIGURABILE)
  //    - Nessuna modifica all’HTML richiesta.
  //    - Modifica l’elenco BG_IMAGES qui sotto.
  //    - Disattiva via query string: ?bg=off
  //    - Escludi percorsi con SHOULD_APPLY() se serve.
  // ------------------------------------------------------
  (function () {
    // Disattiva con ?bg=off
    if (new URL(location.href).searchParams.get('bg') === 'off') return;

    // Escludi alcune pagine se necessario
    function SHOULD_APPLY() {
      // Esempi:
      // if (location.pathname.startsWith('/eventi/archivio')) return false;
      return true;
    }
    if (!SHOULD_APPLY()) return;

    // Elenco immagini (usa BASE per compatibilità in sottocartelle)
    var BG_IMAGES = [
      withBase('/assets/img/background.jpg'),
      withBase('/assets/img/background2.jpg')
    ];
    if (!BG_IMAGES.length) return;

    // Precarica (riduce il flash iniziale)
    for (var i = 0; i < BG_IMAGES.length; i++) {
      var img = new Image();
      img.src = BG_IMAGES[i];
    }

    // Scelta casuale
    var pick = Math.floor(Math.random() * BG_IMAGES.length);

    // Applica quando il DOM è pronto (con defer dovrebbe già bastare)
    function applyBg() {
      var b = document.body;
      if (!b) return;
      b.style.backgroundImage = "url('" + BG_IMAGES[pick] + "')";
      // Impostazioni di fallback nel caso il CSS non le definisca
      if (!b.style.backgroundSize)        b.style.backgroundSize = 'cover';
      if (!b.style.backgroundPosition)    b.style.backgroundPosition = 'center center';
      if (!b.style.backgroundRepeat)      b.style.backgroundRepeat = 'no-repeat';
      if (!b.style.backgroundAttachment)  b.style.backgroundAttachment = 'fixed';
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyBg, { once: true });
    } else {
      applyBg();
    }
  })();

})();
