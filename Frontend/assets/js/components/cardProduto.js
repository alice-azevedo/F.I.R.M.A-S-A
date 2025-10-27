// assets/js/components/cardProduto.js

export function criarCardProduto(produto) {
  const card = document.createElement("div");
  card.classList.add("card-produto");

  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" class="img-produto">
    <h3>${produto.nome}</h3>
    <p>${produto.descricao}</p>
    <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
    <button class="btn-adicionar" data-id="${produto.id}">Adicionar ao carrinho</button>
  `;

  card.querySelector(".btn-adicionar").addEventListener("click", () => {
    adicionarAoCarrinho(produto);
  });

  return card;
}
