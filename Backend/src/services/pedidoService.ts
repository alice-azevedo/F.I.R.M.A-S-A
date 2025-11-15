// src/services/pedidosService.ts
import { supabase } from "../lib/supabaseClient";
import { CreatePedidoDTO } from "../validators/pedidosValidators";

export async function savePedido(dto:CreatePedidoDTO) {
    type Item ={
        preco_unitario: number;
        quantidade: number;
    };

    const payload = {
        cliente_nome: dto.cliente_nome,
        cliente_telefone: dto.cliente_telefone,
        items: dto.items,
        observacao: dto.observacao ?? null,
        total: dto.items.reduce((s: number, it: Item) => s + it.preco_unitario * it.quantidade, 0)
    };

    const { data, error } = await supabase
    .from('pedidos')
    .insert([payload])
    .select()
    .single();
    
    if (error) throw new Error(error.message);
    return data;
}