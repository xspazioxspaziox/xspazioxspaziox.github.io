// include.js – inietta header e footer usando #header e #footer.
// Riscrive href/src che iniziano con ./assets/ o /assets/ per funzionare
// sia dalla root che dalle sottocartelle.
// + Placeholder immediato per ridurre CLS
// + Fix iOS per elastic scroll

(function () {
  'use strict';

  function getBase() {
    var s = document.currentScript || document.scripts[document.scripts.length - 1];
    var url = new URL(s.src, location.href);
    var i = url.pathname.indexOf('/assets/');
    return i >= 0 ? url.pathname.slice(0, i) : '';
  }

  var BASE = getBase();

  function rewrite(html) {
    return html.replace(/(href|src)=["']\/?assets\//g, '$1="' + BASE + '/assets/');
  }

  function inject(id, path) {
    var el = document.getElementById(id);
    if (!el) return;
    var url = BASE + path;
    fetch(url + '?v=' + Date.now(), { cache: 'no-store' })
      .then(r => r.ok ? r.text() : Promise.reject(path))
      .then(t => { el.innerHTML = rewrite(t); })
      .catch(u => console.warn('Include fallito:', u));
  }

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

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', () => {
      inject('header', '/partials/header.html');
      inject('footer', '/partials/footer.html');
    }, { once: true });
  else {
    inject('header', '/partials/header.html');
    inject('footer', '/partials/footer.html');
  }

  // Fix iOS elastic scroll per vecchie versioni
  (function () {
    var isOldiOS = /iP(ad|hone|od)/.test(navigator.userAgent) &&
                   !(window.CSS && CSS.supports('overscroll-behavior: none'));
    if (!isOldiOS) return;
    document.addEventListener('touchmove', e => {
      if (!e.target.closest('.flyer-scroll')) e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchstart', e => {
      var s = e.target.closest('.flyer-scroll');
      if (!s) return;
      if (s.scrollTop <= 0) s.scrollTop = 1;
      var max = s.scrollHeight - s.clientHeight;
      if (s.scrollTop >= max) s.scrollTop = max - 1;
    }, { passive: true });
  })();
})();
