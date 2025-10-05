// include.js robusto: ricava la root del sito dal path dello script stesso
(function () {
  // Trova lo <script> corrente (include.js)
  const scriptEl =
    document.currentScript ||
    Array.from(document.scripts).find(s => (s.src || '').includes('/assets/js/include.js'));

  if (!scriptEl) return;

  // Esempio src: "/repo/assets/js/include.js" o "../../assets/js/include.js"
  const src = scriptEl.getAttribute('src');

  // Ricava la "root" tagliando tutto dopo "/assets/"
  // Risultato esempio:
  //   "/repo"                     (project pages)
  //   "."  oppure ".." o "../.." (percorsi relativi)
  const root = src.split('/assets/')[0] || '.';

  // Helper per riscrivere gli URL relativi nel frammento <head>
  // rimpiazza href="./assets/..." e src="./assets/..." con href="<root>/assets/..."
  function rewriteAssetURLs(fragment) {
    return fragment
      .replace(/(href|src)=["']\.\/assets\//g, `$1="${root}/assets/`)
      .replace(/(href|src)=["']assets\//g, `$1="${root}/assets/`)
      .replace(/(href|src)=['"]\.\/(partials|events)\//g, `$1="${root}/$2/`); // per sicurezza
  }

  // Inserisce HEAD (meta + css + favicon) riscrivendo gli URL degli asset
  fetch(`${root}/partials/head.html`)
    .then(r => r.text())
    .then(html => {
      const rewritten = rewriteAssetURLs(html);
      // Appendiamo in coda al <head> della pagina
      const temp = document.createElemen
