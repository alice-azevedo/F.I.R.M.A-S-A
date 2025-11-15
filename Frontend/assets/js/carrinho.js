// assets/js/carrinho.js

import { enviarPedido } from './api.js';
import { formatBRL } from './utils.js';

const KEY = 'ye_cart_v1';

export function obterCarrinho() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export function salvarCarrinho(carrinho) {
  localStorage.setItem(KEY, JSON.stringify(carrinho));
  atualizarBadgeCarrinho();
}

export function atualizarBadgeCarrinho() {
  const carrinho = obterCarrinho();
  const quantidade = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

  document.querySelectorAll('.cart-floating').forEach(elem => {
    elem.innerHTML = `🕯️ Carrinho <span class="badge">${quantidade}</span>`;
  });
}

export function adicionarAoCarrinho(produto, quantidade = 1) {
  const carrinho = obterCarrinho();
  const existente = carrinho.find(p => p.id === produto.id);

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({
      id: produto.id,
      nome_vela: produto.nome_vela || produto.nome,
      preco_unitario: produto.preco,
      tamanho: produto.tamanho || 'único',
      imagem: produto.imagem || produto.imagem_url || '',
      quantidade
    });
  }

  salvarCarrinho(carrinho);
  alert(` ${produto.nome_vela || produto.nome} foi adicionado ao carrinho!`);
}

export function removerDoCarrinho(id, tamanho) {
  const carrinho = obterCarrinho().filter(p => !(p.id === id && p.tamanho === tamanho));
  salvarCarrinho(carrinho);
}

export function renderizarCarrinho() {
  const container = document.querySelector('.cart-items');
  if (!container) return;

  const carrinho = obterCarrinho();

  if (!carrinho.length) {
    container.innerHTML = '<p>Seu carrinho está vazio :(</p>';
    atualizarBadgeCarrinho();
    return;
  }

  container.innerHTML = carrinho.map(item => `
    <div class="item-carrinho">
      <div class="item-info">
        <strong>${item.nome_vela} - ${item.tamanho}</strong><br>
        <span>${formatBRL(item.preco_unitario)} x ${item.quantidade}</span>
      </div>
      <div class="item-acoes">
        <input type="number" min="1" value="${item.quantidade}" 
               data-id="${item.id}" data-tamanho="${item.tamanho}" class="qty">
        <button class="btn-remover" data-id="${item.id}" data-tamanho="${item.tamanho}">Remover</button>
      </div>
    </div>
  `).join('');

  const total = carrinho.reduce((soma, it) => soma + it.preco_unitario * it.quantidade, 0);
  container.innerHTML += `<div class="total">Total: <strong>${formatBRL(total)}</strong></div>`;

  container.querySelectorAll('.qty').forEach(inp => {
    inp.addEventListener('change', () => {
      const id = inp.dataset.id;
      const tamanho = inp.dataset.tamanho;
      const novaQtd = Math.max(1, Number(inp.value));

      const carrinho = obterCarrinho();
      const item = carrinho.find(p => p.id === id && p.tamanho === tamanho);
      if (item) {
        item.quantidade = novaQtd;
        salvarCarrinho(carrinho);
        renderizarCarrinho();
      }
    });
  });

  container.querySelectorAll('.btn-remover').forEach(btn => {
    btn.addEventListener('click', () => {
      removerDoCarrinho(btn.dataset.id, btn.dataset.tamanho);
      renderizarCarrinho();
    });
  });

  atualizarBadgeCarrinho();
}

function isValidPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length >= 8;
}

async function enviarCarrinho() {
  const nomeElem = document.getElementById('cliente_nome');
  const telElem = document.getElementById('cliente_telefone');

  const nome = nomeElem?.value?.trim() || '';
  const telefone = telElem?.value?.trim() || '';
  const itens = obterCarrinho();

  if (!itens.length) return alert('Carrinho vazio!');

  if (!nome) {
    if (nomeElem) nomeElem.focus();
    return alert('Por favor informe seu nome completo.');
  }

  if (!telefone) {
    if (telElem) telElem.focus();
    return alert('Por favor informe seu número do WhatsApp.');
  }

  if (!isValidPhone(telefone)) {
    if (telElem) telElem.focus();
    return alert('Número de WhatsApp inválido. Informe apenas números e DDD.');
  }

  const payload = { cliente_nome: nome, cliente_telefone: telefone, items: itens };

  try {
    const resposta = await enviarPedido(payload);

    const waUrl = resposta.waUrl || resposta.whatsappUrl || null;
    if (waUrl) {
      window.location.href = waUrl;
    } else {
      const texto = encodeURIComponent(resposta.mensagem || 'Pedido realizado!');
      const telDigits = telefone.replace(/\D/g, '');
      window.location.href = `https://wa.me/${telDigits}?text=${texto}`;
    }

    localStorage.removeItem(KEY);
    atualizarBadgeCarrinho();
    renderizarCarrinho();
  } catch (erro) {
    console.error('Erro ao enviar pedido:', erro);
    alert('Erro ao enviar pedido: ' + (erro.message || erro));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrinho();

  const botaoCheckout = document.getElementById('checkout');
  if (botaoCheckout) {
    botaoCheckout.addEventListener('click', enviarCarrinho);
  }
});
