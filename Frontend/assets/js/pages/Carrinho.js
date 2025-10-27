// assets/js/pages/carrinho.js
import { obterCarrinho, removerDoCarrinho } from "../utils.js";

function renderizarCarrinho() {
  const carrinho = obterCarrinho();
  const container = document.querySelector("#lista-carrinho");
  container.innerHTML = "";

  if (carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio...</p>";
    return;
  }

  carrinho.forEach((item, i) => {
    const linha = document.createElement("div");
    linha.classList.add("item-carrinho");
    linha.innerHTML = `
      <span>${item.nome}</span>
      <span>R$ ${item.preco.toFixed(2)}</span>
      <button data-index="${i}" class="remover">Remover</button>
    `;
    container.appendChild(linha);
  });

  document.querySelectorAll(".remover").forEach(btn => {
    btn.addEventListener("click", (e) => {
      removerDoCarrinho(e.target.dataset.index);
      renderizarCarrinho();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderizarCarrinho);
