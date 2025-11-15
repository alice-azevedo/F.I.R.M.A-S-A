// assets/js/header-footer.js
async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(path);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    console.error('Erro ao carregar componente', path, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  
  loadComponent('header', '/components/header.html');
  loadComponent('footer', '/components/footer.html');
});
