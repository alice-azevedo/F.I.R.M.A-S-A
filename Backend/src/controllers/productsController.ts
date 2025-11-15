// src/controllers/productsController.ts

import { Request, Response } from 'express'
import * as productsService from '../services/productsService';

export async function getAllProducts(_req: Request, res: Response) {
   const produtos = await productsService.fetchAll()
   res.json({ produtos });
}

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  const produto = await productsService.fetchById(id);
  if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json({ produto });
}
