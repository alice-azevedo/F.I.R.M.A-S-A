// src/utils/calcTotal.ts
import { supabase } from '../lib/supabaseClient'

interface Item {
  produto_id: number
  quantidade: number
}

export const calcTotal = async (itens: Item[]): Promise<number> => {
  if (!itens || itens.length === 0) return 0

  // Pegar os IDs dos produtos
  const produtoIds = itens.map(i => i.produto_id)

  // Buscar preços no banco
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('id, preco')
    .in('id', produtoIds)

  if (error) throw new Error(`Erro ao buscar produtos: ${error.message}`)
  if (!produtos) throw new Error('Nenhum produto encontrado')

  // Calcular total
  let total = 0
  for (const item of itens) {
    const produto = produtos.find(p => p.id === item.produto_id)
    if (!produto) throw new Error(`Produto não encontrado: ${item.produto_id}`)
    total += produto.preco * item.quantidade
  }

  return total
}
