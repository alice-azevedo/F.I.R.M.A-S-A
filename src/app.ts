//src/app.ts
/* Configuração do servidor Express */
import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products'
import personalizacoesRouter from './routes/personalizacoes'
import pedidosRouter from './routes/pedidos'

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.get('/', (req, res) => res.json({ ok: true, service: 'YE VELAS COM AFETO - Backend' }))

app.use('/products', productsRouter)
app.use('/personalizacoes', personalizacoesRouter)
app.use('/pedidos', pedidosRouter)

export default app
