// include.js – inietta header e footer usando #header e #footer.
// Riscrive href/src che iniziano con ./assets/ o /assets/ per funzionare
// sia dalla root che dalle sottocartelle.
// + Fix iOS: blocca l'elastic scroll della pagina, consentendolo solo dentro .flyer-scroll

(function () {
  'use strict';

  // Trova il base path del sito (es. '' oppure '/xspazioxspaziox.github.io')
  function getBase() {
    var s = document.currentScript;
    if (!s) {
      var list = document.getElementsByTagName('script');
      s = list[list.length - 1];
    }
    var url = new URL(s.src, location.href);
    var p = url.pathname;                          // /<repo>/assets/js/include.js
    var i = p.indexOf('/assets/');
    return i >= 0 ? p.slice(0, i) : '';
  }

  var BASE = getBase();

  // Riscrive href/src che puntano a ./assets/... o /assets/... in {BASE}/assets/...
  function rewrite(html) {
    // Nota: semplice e veloce; se servisse coprire anche srcset, si può estendere.
    return html.replace(/(href|src)=["']\/?assets\//g, '$1="' + BASE + '/assets/');
  }

  function inject(targetId, partialPath) {
    var el = document.getElementById(targetId);
    if (!el) return;

    // Aggiunge cache-busting minimo basato su timestamp per evitare cache ostinate in dev
    var url = BASE + partialPath;
    var sep = url.includes('?') ? '&' : '?';
    var bust = sep + 'v=' + String(Date.now()).slice(-7);

    fetch(url + bust, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(partialPath); })
      .then(function (t) { el.innerHTML = rewrite(t); })
      .catch(function (u) { console.warn('Include fallito:', u); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    inject('header', '/partials/header.html');
    inject('footer', '/partials/footer.html');
  });

  // ===== iOS elastic scroll fix (fallback JS per versioni vecchie di iOS) =====
  // La parte principale è già gestita via CSS (overscroll-behavior), ma su iOS vecchi non è supportato.
  (function () {
    var isOldiOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !CSS.supports('overscroll-behavior: none');
    if (!isOldiOS) return;

    // Permette lo scroll solo quando il gesto parte dentro .flyer-scroll
    document.addEventListener('touchmove', function (e) {
      if (!e.target.closest('.flyer-scroll')) {
        e.preventDefault(); // blocca il rimbalzo della pagina
      }
    }, { passive: false });

    // Migliora l'inerzia nello scroll dell'area testuale
    document.addEventListener('touchstart', function (e) {
      var scroller = e.target.closest('.flyer-scroll');
      if (!scroller) return;
      // se siamo in cima o in fondo, spingiamo di 1px per evitare il "pass-through" del gesto
      if (scroller.scrollTop <= 0) scroller.scrollTop = 1;
      var max = scroller.scrollHeight - scroller.clientHeight;
      if (scroller.scrollTop >= max) scroller.scrollTop = max - 1;
    }, { passive: true });
  })();
})();
