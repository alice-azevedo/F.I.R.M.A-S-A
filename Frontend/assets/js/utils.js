// assets/js/utils.js
const KEY = 'ye_cart_v1';

export function obterCarrinho() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export function salvarCarrinho(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export function adicionarAoCarrinho(produto) {
  const cart = obterCarrinho();
  const idx = cart.findIndex(p => p.id === produto.id && (p.tamanho ?? '') === (produto.tamanho ?? ''));
  if (idx > -1) {
    cart[idx].quantidade = (cart[idx].quantidade || 0) + (produto.quantidade || 1);
  } else {
    cart.push({
      id: produto.id,
      nome_vela: produto.nome_vela || produto.nome || produto.nome_produto || '',
      preco_unitario: Number(productPriceFallback(produto)),
      tamanho: produto.tamanho ?? 'Pequeno',
      quantidade: produto.quantidade ?? 1,
      url_imagem: produto.url_imagem ?? produto.imagem ?? ''
    });
  }
  salvarCarrinho(cart);
  atualizarBadgeCarrinho();
}

function productPriceFallback(produto) {
  return produto.preco_unitario ?? produto.preco_pequeno ?? produto.preco ?? 0;
}

export function removerDoCarrinho(id, tamanho) {
  const cart = obterCarrinho().filter(i => !(i.id === id && (i.tamanho ?? '') === (tamanho ?? '')));
  salvarCarrinho(cart);
  atualizarBadgeCarrinho();
}

export function limparCarrinho() {
  localStorage.removeItem(KEY);
  atualizarBadgeCarrinho();
}

export function atualizarBadgeCarrinho() {
  const cart = obterCarrinho();
  const total = cart.reduce((s, it) => s + (it.quantidade || 0), 0);
  document.querySelectorAll('.cart-floating').forEach(el => {
    el.innerHTML = `Carrinho <span class="badge">${total}</span>`;
  });
}

export function formatBRL(v) {
  const n = Number(v || 0);
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
