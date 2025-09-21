async function includeHTML(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Impossibile caricare ${file}`);
    const text = await res.text();
    document.getElementById(id).innerHTML = text;
  } catch (err) {
    console.error(err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  includeHTML("head-content", "/head.html");
  includeHTML("header", "/header.html");
  includeHTML("footer", "/footer.html");
});
