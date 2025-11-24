// assets/js/produto-popup.js

import { adicionarAoCarrinho, atualizarBadgeCarrinho } from './carrinho.js';

export function openProductModal(produto) {
  // Cria popup dinamicamente (baseado no produto-popup.html)
  const popup = document.createElement('div');
  popup.classList.add('produto-popup');
  popup.innerHTML = `
  <div class="overlay ativo"></div>
  <div class="popup-conteudo ativo">
    <button class="popup-fechar">&times;</button>
    <div class="popup-corpo">
      <img src="${produto.image_url || '../assets/img/default.png'}" alt="${produto.nome}" class="popup-imagem">
      <div class="popup-info">
        <h2 class="popup-nome">${produto.nome}</h2>
        <p class="popup-descricao">${produto.descricao}</p>
        <div class="popup-opcoes">
          <label for="popup-tamanho">Tamanho:</label>
          <select id="popup-tamanho">
            <option value="pequena">Pequena - R$ 45,00</option>
            <option value="grande">Grande - R$ 60,00</option>
          </select>
        </div>
        <div class="popup-quantidade">
          <label for="popup-quantidade">Quantidade:</label>
          <input type="number" id="popup-quantidade" value="1" min="1">
        </div>
        <button id="popup-add-carrinho" class="btn-adicionar-popup">Adicionar ao Carrinho</button>
      </div>
    </div>
  </div>
`;

  document.body.appendChild(popup);

  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.zIndex = "9999";

  const overlay = popup.querySelector('.overlay');
  const btnFechar = popup.querySelector('.popup-fechar');
  const btnAdd = popup.querySelector('#popup-add-carrinho');

  function fecharPopup() {
    const overlay = popup.querySelector('.overlay');
    const conteudo = popup.querySelector('.popup-conteudo');

    overlay.classList.remove('ativo');
    conteudo.classList.remove('ativo');

    overlay.classList.add('saindo');
    conteudo.classList.add('saindo');

    setTimeout(() => popup.remove(), 300);
  }
  // Eventos de fechamento
  btnFechar.addEventListener('click', fecharPopup);
  overlay.addEventListener('click', fecharPopup);

  // Evento de adicionar ao carrinho
  btnAdd.addEventListener('click', () => {
    const tamanho = popup.querySelector('#popup-tamanho').value;
    const quantidade = parseInt(popup.querySelector('#popup-quantidade').value);
    const preco = tamanho === 'grande' ? 60.0 : 45.0;

    const item = {
      id: produto.id + '-' + tamanho,
      nome: `${produto.nome} (${tamanho})`,
      preco,
      imagem: produto.image_url || '../assets/img/default.png',
      quantidade,
    };

    adicionarAoCarrinho(item, quantidade);
    // `adicionarAoCarrinho` já atualiza badge e exibe toast com ação Desfazer
    fecharPopup();
  });
}
