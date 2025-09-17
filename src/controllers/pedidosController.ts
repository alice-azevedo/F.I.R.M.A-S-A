///src/controllers/pedidosController.ts
/* Controlador para pedidos */
import { Request } from 'express'
import { Response } from 'express'
import { supabaseAdmin } from '../services/supabaseClient'
import { AuthRequest } from '../middlewares/authenticate'

export async function createPedido(req: AuthRequest, res: Response) {
  try {
    const { personalizacao_id, total } = req.body

    const { data, error } = await supabaseAdmin
      .from('pedidos')
      .insert([{ personalizacao_id, total, status: 'pendente' }])
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao criar pedido' })
  }
}

export async function getUserPedidos(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id

    const { data: personalizacoes } = await supabaseAdmin
      .from('personalizacoes')
      .select('id')
      .eq('usuario_id', userId)

    const ids = personalizacoes?.map(p => p.id) || []

    const { data, error } = await supabaseAdmin
      .from('pedidos')
      .select(`*, personalizacoes(*, personalizacao_itens(*))`)
      .in('personalizacao_id', ids)

    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao listar pedidos' })
  }
}
