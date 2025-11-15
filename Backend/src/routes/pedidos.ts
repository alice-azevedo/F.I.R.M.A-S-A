// src/routes/pedidos.ts
import { Router } from 'express';
import * as pedidosController from '../controllers/pedidosController';

const router = Router();

router.post('/', pedidosController.createPedido)

export default router
