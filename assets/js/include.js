// ======================================================
// include.js - di base non serve mai toccare questo file
// ------------------------------------------------------
// Funzioni principali:
// - Inietta automaticamente HEADER e FOOTER nei <div id="header"> e <div id="footer">.
// - Riscrive i percorsi relativi (href/src) per funzionare
//   sia dalla root che da sottocartelle (es. /eventi/...).
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
  //    (serve per costruire link corretti anche da sottocartelle)
  // ------------------------------------------------------
  function getBase() {
    // Ottiene lo script corrente (compatibile con vecchi browser)
    var s = document.currentScript || document.scripts[document.scripts.length - 1];

    // Ricava il percorso completo dello script include.js
    var url = new URL(s.src, location.href);

    // Trova la posizione di "/assets/" e taglia il percorso lì
    var i = url.pathname.indexOf('/assets/');

    // Restituisce la base del sito (es. "" oppure "/xspazioxspaziox.github.io")
    return i >= 0 ? url.pathname.slice(0, i) : '';
  }

  // Percorso base (usato in tutte le fetch)
  var BASE = getBase();

  // ------------------------------------------------------
  // 2. Riscrive gli href/src all’interno degli include
  //    - Serve per far funzionare correttamente immagini e link
  //      anche da pagine in sottocartelle.
  // ------------------------------------------------------
  function rewrite(html) {
    return html.replace(/(href|src)=["']\/?assets\//g, '$1="' + BASE + '/assets/');
  }

  // ------------------------------------------------------
  // 3. Funzione di iniezione
  //    - Carica un file HTML (header o footer) e lo inserisce nel DOM.
  //    - Disattiva la cache con ?v=timestamp per evitare contenuti vecchi.
  // ------------------------------------------------------
  function inject(id, path) {
    var el = document.getElementById(id);
    if (!el) return; // se l’elemento non esiste, esci

    var url = BASE + path;
    fetch(url + '?v=' + Date.now(), { cache: 'no-store' })
      .then(r => r.ok ? r.text() : Promise.reject(path))
      .then(t => {
        el.innerHTML = rewrite(t); // sostituisce i percorsi
      })
      .catch(u => console.warn('Include fallito:', u)); // log in console
  }

  // ------------------------------------------------------
  // 4. Inserisce subito dei "placeholder"
  //    - Evita spostamenti di layout (CLS) mentre header/footer si caricano.
  // ------------------------------------------------------
  function putPlaceholders() {
    var h = document.getElementById('header');
    var f = document.getElementById('footer');

    // se sono vuoti, aggiunge un div con altezza riservata
    if (h && !h.firstElementChild) h.innerHTML = '<div style="height:var(--header-h)"></div>';
    if (f && !f.firstElementChild) f.innerHTML = '<div style="height:var(--footer-h)"></div>';
  }

  // ------------------------------------------------------
  // 5. Esegue i placeholder appena il DOM è pronto
  // ------------------------------------------------------
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', putPlaceholders, { once: true });
  else
    putPlaceholders();

  // ------------------------------------------------------
  // 6. Inietta effettivamente header e footer
  //    - Dopo che il DOM è pronto o subito se già caricato.
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
  // 7. FIX iOS – previene lo scroll elastico globale
  //    (utile per vecchie versioni che non supportano overscroll-behavior)
  // ------------------------------------------------------
  (function () {
    var isOldiOS =
      /iP(ad|hone|od)/.test(navigator.userAgent) &&
      !(window.CSS && CSS.supports('overscroll-behavior: none'));

    // Se non è un vecchio iOS, non fare nulla
    if (!isOldiOS) return;

    // Impedisce lo scroll sulla pagina, ma lo consente nei box con .flyer-scroll
    document.addEventListener(
      'touchmove',
      e => {
        if (!e.target.closest('.flyer-scroll')) e.preventDefault();
      },
      { passive: false }
    );

    // Previene il “blocco” agli estremi dello scroll interno
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
})();
