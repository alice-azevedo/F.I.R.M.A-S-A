// src/routes/personalizacoes.ts
import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../services/supabaseClient'
import { authenticate, AuthRequest } from '../middlewares/authenticate'

const router = Router()

// Criar personalização
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { nome, itens } = req.body
  try {
    const { data: personalizacao, error } = await supabaseAdmin
      .from('personalizacoes')
      .insert([{ nome, usuario_id: req.user!.id }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })

    // Inserir itens vinculados
    const itensData = itens.map((i: any) => ({ personalizacao_id: personalizacao.id, produto_id: i.produto_id, quantidade: i.quantidade }))
    const { error: itensError } = await supabaseAdmin.from('personalizacao_itens').insert(itensData)
    if (itensError) return res.status(500).json({ error: itensError.message })

    res.status(201).json(personalizacao)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar personalização' })
  }
})

// Listar personalizações do usuário
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const { data, error } = await supabaseAdmin
    .from('personalizacoes')
    .select('*, personalizacao_itens(*)')
    .eq('usuario_id', userId)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
