// assets/js/header-footer.js
async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(path);
    const html = await res.text();
    el.innerHTML = html;
    // informar que o componente foi carregado (útil para atualizar badges/estado)
    window.dispatchEvent(new CustomEvent('componentLoaded', { detail: { selector, path } }));
    // garantir que estilos de toast (carrinho) estejam disponíveis em todas as páginas
    try {
      const href = '/assets/css/carrinho.css';
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    } catch (e) {
      // não bloquear se falhar
    }
  } catch (err) {
    console.error('Erro ao carregar componente', path, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  
  loadComponent('header', '/components/header.html');
  loadComponent('footer', '/components/footer.html');
});
