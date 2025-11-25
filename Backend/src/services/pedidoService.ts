// src/services/pedidosService.ts
import { supabase } from "../lib/supabaseClient";
import { CreatePedidoDTO } from "../validators/pedidosValidators";
import { v4 as uuidv4 } from "uuid";

export async function savePedido(dto: CreatePedidoDTO) {
  const total = dto.items.reduce(
    (acc, it) => acc + it.preco_unitario * it.quantidade,
    0
  );

  // Gerar UUID uma vez para usar em AMBAS as tabelas
  const pedidoId = uuidv4();

  // 1 — criar pedido com ID fixo
  const { data: pedido, error: pedErr } = await supabase
    .from("pedidos")
    .insert([
      {
        id: pedidoId,
        cliente_nome: dto.cliente_nome,
        cliente_telefone: dto.cliente_telefone,
        observacao: dto.observacao ?? null,
        total
      }
    ])
    .select()
    .single();

  if (pedErr) {
    console.error("Erro ao inserir pedido:", pedErr);
    throw new Error(pedErr.message);
  }

  // 2 — criar itens com o mesmo pedidoId
  const itensPayload = dto.items.map(it => ({
    pedido_id: pedidoId, // usar o MESMO ID
    produto_id: it.id,
    nome_vela: it.nome_vela,
    tamanho: it.tamanho,
    preco_unitario: it.preco_unitario,
    quantidade: it.quantidade
  }));

  const { error: itensErr } = await supabase
    .from("pedido_items")
    .insert(itensPayload);

  if (itensErr) {
    console.error("Erro ao inserir itens:", itensErr);
    // Se falhar ao inserir itens, deletar o pedido para manter consistência
    await supabase.from("pedidos").delete().eq("id", pedidoId);
    throw new Error(itensErr.message);
  }

  return { ...pedido, id: pedidoId }; // garantir que retorna o ID correto
}
