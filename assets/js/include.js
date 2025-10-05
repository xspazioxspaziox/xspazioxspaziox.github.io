// include.js – inietta header e footer usando #header e #footer.
// Riscrive href/src che iniziano con ./assets/ o /assets/ per funzionare
// sia dalla root che dalle sottocartelle.

(function () {
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

  function rewrite(html) {
    // /assets/...  oppure ./assets/...  -> {BASE}/assets/...
    return html
      .replace(/(href|src)=["']\/?assets\//g, '$1="' + BASE + '/assets/');
  }

  function inject(targetId, partialPath) {
    var el = document.getElementById(targetId);
    if (!el) return;
    fetch(BASE + partialPath, { cache: 'no-store' })
      .then(r => r.ok ? r.text() : Promise.reject(partialPath))
      .then(t => { el.innerHTML = rewrite(t); })
      .catch(u => console.warn('Include fallito:', u));
  }

  document.addEventListener('DOMContentLoaded', function () {
    inject('header', '/partials/header.html');
    inject('footer', '/partials/footer.html');
  });
})();
