// Determina il percorso base (.. se siamo in sottocartella)
const basePath = window.location.pathname.includes('/eventi/') ? '..' : '.';

// Include HEAD
fetch(`${basePath}/partials/head.html`)
  .then(res => res.text())
  .then(data => {
    document.head.innerHTML += data;
  });

// Include HEADER
fetch(`${basePath}/partials/header.html`)
  .then(res => res.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });

// Include FOOTER
fetch(`${basePath}/partials/footer.html`)
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });
