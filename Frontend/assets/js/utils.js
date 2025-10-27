// assets/js/utils.js

export function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

export function adicionarAoCarrinho(produto) {
  const carrinho = obterCarrinho();
  carrinho.push(produto);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

export function removerDoCarrinho(index) {
  const carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}
