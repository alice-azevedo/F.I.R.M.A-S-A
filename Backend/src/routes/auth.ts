// src/routes/auth.ts
import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabaseClient'

const router = Router()

// Cadastro de usuário
router.post('/signup', async (req: Request, res: Response) => {
  const { nome, email, senha, telefone, cpf, endereco, data_de_nascimento } = req.body

  try {
    // Criar usuário no auth do Supabase
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      user_metadata: {
        nome,
        telefone,
        cpf,
        endereco,
        data_de_nascimento,
        isAdmin: false
      }
    })

    if (authError) return res.status(400).json({ error: authError.message })

    // Criar registro na tabela usuarios
    const { data, error: dbError } = await supabase
      .from('usuarios')
      .insert([{ id: user.user?.id, nome, email, telefone, cpf, endereco, data_de_nascimento }])
      .select()
      .single()

    if (dbError) return res.status(500).json({ error: dbError.message })

    res.status(201).json({ message: 'Usuário criado com sucesso', user: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    if (error) return res.status(400).json({ error: error.message })

    res.json({
      message: 'Login realizado com sucesso',
      accessToken: data.session?.access_token,
      user: data.user
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao realizar login' })
  }
})

// Verificar token / usuário logado
router.get('/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token não fornecido' })

  try {
    const { data: user, error } = await supabase.auth.getUser(token)
    if (error || !user.user) return res.status(401).json({ error: 'Token inválido' })
    res.json(user.user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

export default router
