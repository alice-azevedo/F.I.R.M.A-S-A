// assets/js/pages/itens.js

import { apiRequest } from "../api.js";
import { criarCardProduto } from "../components/cardProduto.js";

async function carregarProdutos() {
    const produtos = await apiRequest("/produtos");
    if (!produtos) return;

    const container = document.querySelector("#lista-produtos");
    container.innerHTML = "";

    produtos.forEach((produto) => {
        const card = criarCardProduto(produto);
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", carregarProdutos);