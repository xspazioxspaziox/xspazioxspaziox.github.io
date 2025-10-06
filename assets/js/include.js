// include.js – inietta header e footer usando #header e #footer.
// Riscrive href/src (e srcset) che iniziano con ./assets/ o /assets/ per funzionare
// sia dalla root che dalle sottocartelle.
// Migliorie:
// - Placeholder immediato per #header/#footer (riduce CLS)
// - Cache-busting leggero in fetch
// - Fix iOS: blocca elastic scroll della pagina salvo .flyer-scroll

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

  // Riscrive href/src e srcset che puntano a ./assets/... o /assets/... in {BASE}/assets/...
  function rewrite(html) {
    // href/src
    html = html.replace(/(href|src)=["']\/?assets\//g, '$1="' + BASE + '/assets/');
    // srcset (copre casi con multipli URL, separati da virgole)
    html = html.replace(/srcset=["']([^"']+)["']/g, function (m, set) {
      var rewritten = set.replace(/(?:^|\s)(\/?assets\/[^\s,]+)/g, function (_, url) {
        return ' ' + BASE + '/' + url.replace(/^\/?/, '');
      });
      return 'srcset="' + rewritten + '"';
    });
    return html;
  }

  // Inietta il contenuto di un partial in un target
  function inject(targetId, partialPath) {
    var el = document.getElementById(targetId);
    if (!el) return;

    var url = BASE + partialPath;
    var sep = url.includes('?') ? '&' : '?';
    var bust = sep + 'v=' + String(Date.now()).slice(-7);

    fetch(url + bust, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(partialPath); })
      .then(function (t) { el.innerHTML = rewrite(t); })
      .catch(function (u) { console.warn('Include fallito:', u); });
  }

  // Placeholder immediato per ridurre il layout shift
  function putPlaceholders() {
    var hdr = document.getElementById('header');
    var ftr = document.getElementById('footer');
    if (hdr && !hdr.firstElementChild) {
      hdr.innerHTML = '<div style="height:var(--header-h)"></div>';
    }
    if (ftr && !ftr.firstElementChild) {
      ftr.innerHTML = '<div style="height:var(--footer-h)"></div>';
    }
  }

  // Avvio: metti i placeholder subito (DOM già parse se script è defer)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', putPlaceholders, { once: true });
  } else {
    putPlaceholders();
  }

  // Quando il DOM è pronto, effettua le iniezioni
  function startInjection() {
    inject('header', '/partials/header.html');
    inject('footer', '/partials/footer.html');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInjection, { once: true });
  } else {
    startInjection();
  }

  // ===== iOS elastic scroll fix (fallback JS per versioni vecchie) =====
  (function () {
    var isOldiOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !(window.CSS && CSS.supports('overscroll-behavior: none'));
    if (!isOldiOS) return;

    // Consenti scroll solo nelle aree .flyer-scroll
    document.addEventListener('touchmove', function (e) {
      if (!e.target.closest('.flyer-scroll')) {
        e.preventDefault();
      }
    }, { passive: false });

    // Evita pass-through ai limiti
    document.addEventListener('touchstart', function (e) {
      var scroller = e.target.closest('.flyer-scroll');
      if (!scroller) return;
      if (scroller.scrollTop <= 0) scroller.scrollTop = 1;
      var max = scroller.scrollHeight - scroller.clientHeight;
      if (scroller.scrollTop >= max) scroller.scrollTop = max - 1;
    }, { passive: true });
  })();
})();
