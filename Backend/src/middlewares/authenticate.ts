// src/middlewares/authenticate.ts
import { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabaseClient'

// Tipagem do usuário autenticado
export interface AuthUser {
  id: string
  nome?: string      // opcional, pode ser preenchido depois
  isAdmin?: boolean
}

// Extensão da Request do Express para incluir usuário autenticado
export interface AuthRequest extends Request {
  user?: AuthUser
}

/**
 * Middleware de autenticação.
 * Verifica se o token enviado no header Authorization é válido.
 * Popula req.user com id e isAdmin.
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' })

    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Token inválido' })

    // Buscar usuário no Supabase
    const { data: userData, error } = await supabase.auth.getUser(token)
    if (error || !userData.user) return res.status(401).json({ error: 'Token inválido' })

    req.user = {
      id: userData.user.id,
      isAdmin: userData.user.app_metadata?.isAdmin || false
      // nome pode ser buscado depois no banco, se necessário
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro de autenticação' })
  }
}

/**
 * Middleware que só permite acesso a administradores.
 */
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Acesso negado' })
  next()
}
