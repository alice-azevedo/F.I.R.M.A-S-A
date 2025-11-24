// assets/js/carrinho.js

import { enviarPedido } from './api.js';
import { formatBRL } from './utils.js';

const KEY = 'ye_cart_v1';

// Toast helper: cria um container único e exibe mensagens temporárias
function createToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = 'success', duration = 3500, action) {
  const container = createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);

  // se houver ação(s) (ex: Desfazer, Abrir Carrinho), adiciona os botões
  if (action) {
    const actions = Array.isArray(action) ? action : [action];
    const actionsWrap = document.createElement('div');
    actionsWrap.className = 'toast-actions';

    actions.forEach(act => {
      if (!act || typeof act !== 'object') return;
      const btn = document.createElement('button');
      btn.className = 'toast-action';
      btn.textContent = act.label || 'OK';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          if (typeof act.onClick === 'function') act.onClick();
        } catch (er) {
          console.error('toast action failed', er);
        }
        // remover toast imediatamente
        toast.style.animation = 'toast-out 120ms ease forwards';
        setTimeout(() => toast.remove(), 120);
      });
      actionsWrap.appendChild(btn);
    });

    toast.appendChild(actionsWrap);
  }

  container.appendChild(toast);

  // remover após tempo
  setTimeout(() => {
    toast.style.animation = 'toast-out 200ms ease forwards';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

// expor globalmente para outros módulos que não importem explicitamente
window.showToast = showToast;

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

  // atualizar badges flutuantes (se houver) e o badge no header
  document.querySelectorAll('.cart-floating').forEach(elem => {
    elem.innerHTML = `🕯️ Carrinho <span class="badge">${quantidade}</span>`;
  });

  const headerBadge = document.getElementById('badge-carrinho');
  if (headerBadge) {
    headerBadge.textContent = String(quantidade);
    headerBadge.style.display = quantidade > 0 ? 'inline-block' : 'none';
  }
}

export function adicionarAoCarrinho(produto, quantidade = 1) {
  const carrinho = obterCarrinho();
  const existente = carrinho.find(p => p.id === produto.id);

  // normalizar nome removendo um possível sufixo com tamanho entre parênteses
  const rawName = produto.nome_vela || produto.nome || '';
  const nomeSemTamanho = rawName.replace(/\s*\((pequena|grande|Pequena|Grande)\)\s*$/, '').trim();

  // determinar tamanho preferencial: campo `produto.tamanho` (espera 'Pequeno'|'Grande'),
  // caso contrário, tentar inferir do id (sufixo '-pequena'/'-grande')
  let tamanho = 'Pequeno';
  if (produto.tamanho === 'Pequeno' || produto.tamanho === 'Grande') {
    tamanho = produto.tamanho;
  } else if (/(-|_)grande$/i.test(String(produto.id))) {
    tamanho = 'Grande';
  } else if (/(-|_)pequena$/i.test(String(produto.id))) {
    tamanho = 'Pequeno';
  }

  let addedQty = quantidade;
  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({
      id: produto.id,
      nome_vela: nomeSemTamanho,
      preco_unitario: produto.preco,
      tamanho,
      imagem: produto.imagem || produto.imagem_url || '',
      quantidade
    });
  }

  salvarCarrinho(carrinho);
  const nomeAlert = (produto.nome_vela || produto.nome || nomeSemTamanho);

  // preparar ação desfazer: reverte a adição de `addedQty` para este `produto.id`
  const undoAction = {
    label: 'Desfazer',
    onClick: () => {
      const carrinhoAtual = obterCarrinho();
      const idx = carrinhoAtual.findIndex(p => p.id === produto.id && p.tamanho === tamanho);
      if (idx === -1) return;

      const item = carrinhoAtual[idx];
      if (item.quantidade > addedQty) {
        item.quantidade = Math.max(0, item.quantidade - addedQty);
        if (item.quantidade === 0) carrinhoAtual.splice(idx, 1);
      } else {
        // remove item
        carrinhoAtual.splice(idx, 1);
      }

      salvarCarrinho(carrinhoAtual);
      renderizarCarrinho();
      // opcional: mostrar feedback
      showToast(`${nomeAlert} removido do carrinho.`, 'error');
    }
  };

  const openCartAction = {
    label: 'Abrir carrinho',
    onClick: () => {
      try {
        // navega para a página do carrinho
        window.location.href = '/pages/Carrinho.html';
      } catch (e) {
        console.error('Falha ao abrir carrinho', e);
      }
    }
  };

  // passar ambas as ações: Desfazer e Abrir carrinho
  showToast(`${nomeAlert} (${tamanho}) foi adicionado ao carrinho!`, 'success', 4000, [undoAction, openCartAction]);
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
    return showToast('Por favor informe seu nome completo.', 'error');
  }

  if (!telefone) {
    if (telElem) telElem.focus();
    return showToast('Por favor informe seu número do WhatsApp.', 'error');
  }

  if (!isValidPhone(telefone)) {
    if (telElem) telElem.focus();
    return showToast('Número de WhatsApp inválido. Informe apenas números e DDD.', 'error');
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
    showToast('Erro ao enviar pedido: ' + (erro.message || erro), 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrinho();

  const botaoCheckout = document.getElementById('checkout');
  if (botaoCheckout) {
    botaoCheckout.addEventListener('click', enviarCarrinho);
  }
});

// Atualiza o badge do header quando o componente do header for inserido dinamicamente
window.addEventListener('componentLoaded', (ev) => {
  try {
    if (ev?.detail?.selector === 'header') {
      atualizarBadgeCarrinho();
    }
  } catch (e) {
    // não bloquear caso não exista evento ou função
  }
});

