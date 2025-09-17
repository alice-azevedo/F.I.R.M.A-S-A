///src/controllers/productsController.ts
/* Controlador para produtos */
import { Request, Response } from 'express'
import { supabaseAdmin } from '../services/supabaseClient'

export async function getAllProducts(req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from('produtos')
    .select('*')
    .order('id', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  return res.json(data)
}

export async function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { data, error } = await supabaseAdmin
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: error.message })
  return res.json(data)
}
