// src/services/pedidosService.ts
import { supabase } from "../lib/supabaseClient";
import { CreatePedidoDTO } from "../validators/pedidosValidators";

export async function savePedido(dto: CreatePedidoDTO) {
  const total = dto.items.reduce(
    (acc, it) => acc + it.preco_unitario * it.quantidade,
    0
  );

  // 1 — criar pedido
  const { data: pedido, error: pedErr } = await supabase
    .from("pedidos")
    .insert([
      {
        cliente_nome: dto.cliente_nome,
        cliente_telefone: dto.cliente_telefone,
        observacao: dto.observacao ?? null,
        total
      }
    ])
    .select()
    .single();

  if (pedErr) throw new Error(pedErr.message);

  // 2 — criar itens
  const itensPayload = dto.items.map(it => ({
    pedido_id: pedido.id,
    produto_id: it.id,
    nome_vela: it.nome_vela,
    tamanho: it.tamanho,
    preco_unitario: it.preco_unitario,
    quantidade: it.quantidade
  }));

  const { error: itensErr } = await supabase
    .from("pedido_items")
    .insert(itensPayload);

  if (itensErr) throw new Error(itensErr.message);

  return pedido;
}
