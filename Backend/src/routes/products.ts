// src/routes/products.ts
import { Router } from 'express';
import * as productsController from '../controllers/productsController';

const router = Router();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);

export default router;
