// include.js robusto per root e sottocartelle (GitHub Pages incluso)
(function () {
  // 1) Trova in modo affidabile IL tag <script> di include.js
  var scriptEl = document.currentScript;
  if (!scriptEl) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i];
      var src = s.getAttribute('src') || '';
      if (/(^|\/)include\.js(\?|$)/.test(src)) { scriptEl = s; break; }
    }
  }
  if (!scriptEl) return;

  // 2) Risolvi l'URL assoluto dello script per ricavare la "base" del sito
  //    Esempi:
  //    /repo/assets/js/include.js  -> base "/repo"
  //    /assets/js/include.js       -> base ""
  var absolute = new URL(scriptEl.getAttribute('src'), window.location.href);
  var pathname = absolute.pathname; // es: "/repo/assets/js/include.js"
  var idx = pathname.indexOf('/assets/');
  var base = idx >= 0 ? pathname.slice(0, idx) : '';

  // Consentire override opzionale via data-root su <script> (solo se serve)
  var override = scriptEl.getAttribute('data-root');
  if (override) base = override;

  // Helper: riscrive href/src relativi agli asset dentro head.html
  function rewriteAssetURLs(html) {
    // Cambia "./assets/..." o "assets/..." in "<base>/assets/..."
    html = html.replace(/(href|src)=["']\.?\/?assets\//g, '$1="' + base + '/assets/');
    // Cambia "./partials/..." solo se presente (di solito non serve in head)
    html = html.replace(/(href|src)=["']\.?\/?partials\//g, '$1="' + base + '/partials/');
    return html;
  }

  // 3) Inietta HEAD (meta + css + favicon)
  fetch(base + '/partials/head.html')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (html) {
      var rewritten = rewriteAssetURLs(html);
      var t = document.createElement('template');
      t.innerHTML = rewritten.trim();
      document.head.appendChild(t.content);
    })
    .catch(function () { /* evita errori rumorosi in console durante lo sviluppo */ });

  // 4) Inietta HEADER
  fetch(base + '/partials/header.html')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (html) {
      var el = document.getElementById('header');
      if (el) el.innerHTML = html;
    })
    .catch(function () {});

  // 5) Inietta FOOTER
  fetch(base + '/partials/footer.html')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (html) {
      var el = document.getElementById('footer');
      if (el) el.innerHTML = html;
    })
    .catch(function () {});
})();
