// assets/js/api.js
export const API_BASE = window.__API_BASE__ || 'http://localhost:4000/api';

export async function fetchProdutos() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  const json = await res.json();
  // dependendo do backend, json.produtos ou json
  return json.produtos ?? json;
}

export async function fetchProdutoById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Produto não encontrado');
  const json = await res.json();
  return json.produto ?? json;
}

export async function enviarPedido(payload) {
  const res = await fetch(`${API_BASE}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao enviar pedido');
  return json;
}
