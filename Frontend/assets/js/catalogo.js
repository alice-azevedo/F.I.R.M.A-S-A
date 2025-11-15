// assets/js/catalogo.js

import { openProductModal } from './produto-popup.js';
import { atualizarBadgeCarrinho, adicionarAoCarrinho } from './carrinho.js';

const API_URL = "http://localhost:4000/api/products";

function criarCardProduto(produto) {
  const card = document.createElement('div');
  card.classList.add('card-produto');

  const imagem = produto.image_url || '../assets/img/default.png';

  card.innerHTML = `
    <div class="imagem-produto" style="background-image: url('${imagem}')"></div>
    <h3 class="nome-produto">${produto.nome}</h3>
    <p class="descricao-produto">${produto.descricao}</p>
    <div class="botoes">
      <button class="btn-adicionar">Adicionar ao carrinho</button>
      <a href="#" class="link-produto">Ver detalhes</a>
    </div>
  `;

  card.querySelector('.btn-adicionar').addEventListener('click', () => {
    abrirModalTamanho(produto);
  });

  card.querySelector('.link-produto').addEventListener('click', (e) => {
    e.preventDefault();
    openProductModal(produto);
  });

  return card;
}

function abrirModalTamanho(produto) {
  const modal = document.createElement('div');
  modal.classList.add('modal-tamanho');
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Escolha o tamanho da vela</h3>
      <p>${produto.nome}</p>
      <div class="opcoes-tamanho">
        <button class="btn-tamanho" data-tamanho="pequena">
          Pequena - R$ ${produto.preco_pequeno.toFixed(2).replace('.', ',')}
        </button>
        <button class="btn-tamanho" data-tamanho="grande">
          Grande - R$ ${produto.preco_grande.toFixed(2).replace('.', ',')}
        </button>
      </div>
      <button class="btn-cancelar">Cancelar</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('ativo'), 10);

  modal.querySelector('.btn-cancelar').addEventListener('click', () => modal.remove());

  modal.querySelectorAll('.btn-tamanho').forEach(btn => {
    btn.addEventListener('click', () => {
      const tamanho = btn.dataset.tamanho;
      const preco = tamanho === 'grande' ? produto.preco_grande : produto.preco_pequeno;

      const item = {
        id: produto.id + '-' + tamanho,
        nome: `${produto.nome} (${tamanho})`,
        preco,
        imagem: produto.image_url || '../assets/img/default.png'
      };

      adicionarAoCarrinho(item, 1);
      atualizarBadgeCarrinho();
      alert(`${produto.nome} (${tamanho}) foi adicionado ao carrinho!`);
      modal.remove();
    });
  });
}

async function carregarCatalogo() {
  const grid = document.getElementById('produtos-grid');
  const contador = document.getElementById('contagem-produtos');

  try {
    grid.innerHTML = '<p class="carregando">Carregando catálogo...</p>';

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Falha ao buscar produtos");

    const resposta = await response.json();
    const produtos = resposta.produtos || [];

    grid.innerHTML = '';

    if (!Array.isArray(produtos) || produtos.length === 0) {
      grid.innerHTML = '<p class="vazio">Nenhum produto encontrado.</p>';
      return;
    }

    const precoPequeno = 45.00;
    const precoGrande = 60.00;

    const estaNaHome = window.location.pathname.includes('homepage') || window.location.pathname === '/';
    const produtosParaMostrar = estaNaHome ? produtos.slice(0, 4) : produtos;

    produtosParaMostrar.forEach(produto => {
      produto.preco_pequeno = precoPequeno;
      produto.preco_grande = precoGrande;
      grid.appendChild(criarCardProduto(produto));
    });

    contador.textContent = `${produtosParaMostrar.length} produtos exibidos (de ${produtos.length})`;
    atualizarBadgeCarrinho();

  } catch (erro) {
    console.error("Erro ao carregar catálogo:", erro);
    grid.innerHTML = `<p class="erro">Erro ao carregar produtos. Tente novamente mais tarde.</p>`;
  }
}


document.addEventListener('DOMContentLoaded', carregarCatalogo);

