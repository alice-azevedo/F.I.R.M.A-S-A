///src/controllers/personalizacoesController.ts
/* Controlador para personalizações */
import { Request } from 'express'
import { Response } from 'express'
import { supabaseAdmin } from '../services/supabaseClient'
import { AuthRequest } from '../middlewares/authenticate'

export async function createPersonalizacao(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    const { itens, total } = req.body

    const { data: pData, error: pError } = await supabaseAdmin
      .from('personalizacoes')
      .insert([{ usuario_id: userId, total }])
      .select()
      .single()

    if (pError || !pData) return res.status(500).json({ error: pError?.message })

    const itensToInsert = itens.map((it: any) => ({
      personalizacao_id: pData.id,
      produto_id: it.produto_id,
      quantidade: it.quantidade ?? 1,
      preco_unitario: it.preco_unitario
    }))

    const { error: itensError } = await supabaseAdmin
      .from('personalizacao_itens')
      .insert(itensToInsert)

    if (itensError) return res.status(500).json({ error: itensError.message })

    return res.status(201).json({ personalizacao: pData })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao criar personalização' })
  }
}

export async function getUserPersonalizacoes(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    const { data, error } = await supabaseAdmin
      .from('personalizacoes')
      .select(`*, personalizacao_itens(*)`)
      .eq('usuario_id', userId)
      .order('criado_em', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao buscar personalizações' })
  }
}
