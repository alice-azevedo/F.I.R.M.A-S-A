// src/routes/pedidos.ts
import { Router, Response } from 'express'
import { supabaseAdmin } from '../services/supabaseClient'
import { authenticate, AuthRequest } from '../middlewares/authenticate'
import { calcTotal } from '../utils/calcTotal'
import { generateWhatsAppMessage } from '../utils/generateWhatsAppMessage'

const router = Router()

// Criar pedido
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { personalizacao_id, produto_ids } = req.body
    const userId = req.user!.id

    // Buscar nome do usuário no banco
    const { data: usuario, error: usuarioError } = await supabaseAdmin
      .from('usuarios')
      .select('nome')
      .eq('id', userId)
      .single()

    if (usuarioError || !usuario) return res.status(500).json({ error: 'Não foi possível obter o nome do usuário' })
    const clienteNome = usuario.nome

    // Arrays para gerar mensagem e calcular total
    const produtosParaMensagem: { nome: string; quantidade: number; produto_id: number }[] = []
    const personalizacoesParaMensagem: { tamanho: string; cheiro: string; forma: string; quantidade: number; produto_id: number }[] = []

    // Produtos prontos
    if (produto_ids && produto_ids.length) {
      const { data: produtos, error: prError } = await supabaseAdmin
        .from('produtos')
        .select('id, nome, preco')
        .in('id', produto_ids)

      if (prError) return res.status(500).json({ error: prError.message })
      produtos?.forEach(p => produtosParaMensagem.push({ nome: p.nome, quantidade: 1, produto_id: p.id }))
    }

    // Itens de personalização
    if (personalizacao_id) {
      const { data: personalizacao, error: pError } = await supabaseAdmin
        .from('personalizacoes')
        .select('id, tamanho, cheiro, forma')
        .eq('id', personalizacao_id)
        .single()
      if (pError) return res.status(500).json({ error: pError.message })

      const { data: itens, error: piError } = await supabaseAdmin
        .from('personalizacao_itens')
        .select('produto_id, quantidade')
        .eq('personalizacao_id', personalizacao_id)
      if (piError) return res.status(500).json({ error: piError.message })

      itens?.forEach(item =>
        personalizacoesParaMensagem.push({
          tamanho: personalizacao.tamanho,
          cheiro: personalizacao.cheiro,
          forma: personalizacao.forma,
          quantidade: item.quantidade,
          produto_id: item.produto_id
        })
      )
    }

    // Calcular total
    const total = await calcTotal([...produtosParaMensagem, ...personalizacoesParaMensagem])

    // Criar pedido no banco
    const { data: pedido, error: pedidoError } = await supabaseAdmin
      .from('pedidos')
      .insert([{ personalizacao_id: personalizacao_id || null, total, status: 'pendente', usuario_id: userId }])
      .select()
      .single()
    if (pedidoError) return res.status(500).json({ error: pedidoError.message })

    // Gerar mensagem do WhatsApp
    const message = generateWhatsAppMessage(clienteNome, produtosParaMensagem, personalizacoesParaMensagem)
    const whatsappNumber = '5511999999999' // número do vendedor
    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    res.status(201).json({ pedido, whatsappLink: waLink })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar pedido' })
  }
})

export default router
