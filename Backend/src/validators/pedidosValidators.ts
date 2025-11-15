// src/validators/pedidosValidators.ts
import { z } from 'zod';

export const ItemSchema = z.object({
    id: z.string(),
    nome_vela: z.string(),
    tamanho: z.enum(['Pequeno', 'Grande']),
    preco_unitario: z.number().nonnegative(),
    quantidade: z.number().int().min(1)
});

export const CreatePedidosSchema = z.object({
    cliente_nome: z.string().min(1),
    cliente_telefone: z.string().min(10),
    items: z.array(ItemSchema).min(1),
    observacao: z.string().optional()
});

export type CreatePedidoDTO = z.infer<typeof CreatePedidosSchema>;