// src/routes/products.ts
import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../services/supabaseClient'
import { authenticate, adminOnly } from '../middlewares/authenticate'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Tipagem do body do POST /products
interface ProdutoBody {
  nome: string
  descricao: string
  preco: number
}

// Listar produtos (catálogo) - público
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('produtos')
      .select('*')
      .order('id', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao listar produtos' })
  }
})

// Criar produto (admin) com upload de imagem
router.post(
  '/',
  authenticate,
  adminOnly,
  upload.single('imagem'),
  async (req: Request<{}, {}, ProdutoBody>, res: Response) => {
    try {
      const { nome, descricao, preco } = req.body
      const file = req.file as Express.Multer.File | undefined

      let url_imagem: string | null = null

      // Se houver arquivo, faz upload
      if (file) {
        const fileName = `${Date.now()}_${file.originalname}`
        const { error } = await supabaseAdmin.storage.from('produtos').upload(fileName, file.buffer)
        if (error) return res.status(500).json({ error: error.message })

        const { data: publicUrlData } = supabaseAdmin.storage.from('produtos').getPublicUrl(fileName)
        url_imagem = publicUrlData.publicUrl
      }

      // Inserir produto no banco
      const { data, error } = await supabaseAdmin
        .from('produtos')
        .insert([{ nome, descricao, preco, url_imagem }])
        .select()
        .single()

      if (error) return res.status(500).json({ error: error.message })
      res.status(201).json(data)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Erro ao criar produto' })
    }
  }
)

export default router
