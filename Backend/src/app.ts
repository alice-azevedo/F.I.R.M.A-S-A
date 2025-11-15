//src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import productsRouter from './routes/products'
import pedidosRouter from './routes/pedidos'

const app = express()

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/products', productsRouter);
app.use('/api/pedidos', pedidosRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) =>{
    console.error(err)
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error'});
});

export default app
