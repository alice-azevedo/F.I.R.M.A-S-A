// src/controllers/pedidosController.ts

import { Request, Response } from 'express';
import { CreatePedidosSchema  } from '../validators/pedidosValidators';
import * as pedidosService from '../services/pedidoService';
import { generateWhatsAppMessage } from '../utils/generateWhatsAppMessage';

export async function createPedido(req: Request, res: Response) {
  const parse = CreatePedidosSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });

  const dto = parse.data;
  const pedido = await pedidosService.savePedido(dto);

  const wApp = process.env.WHATSAPP_NUMBER!;
  const { waUrl, mensagem } = generateWhatsAppMessage(dto.items, wApp, `Novo Pedido${dto.cliente_nome ? ' de ' + dto.cliente_nome : ''}`);

  res.status(201).json({ pedido, waUrl, mensagem });
}


