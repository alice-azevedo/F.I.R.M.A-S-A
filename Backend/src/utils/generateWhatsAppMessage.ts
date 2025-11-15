// src/utils/generateWhatsAppMessage.ts

import { CreatePedidoDTO } from "../validators/pedidosValidators";

export const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

export function generateWhatsAppMessageFromDTO(dto: CreatePedidoDTO, wApp: string) {
  type Item = {
    nome_vela: string;
    tamanho: string;
    preco_unitario: number;
    quantidade: number;
  };

  const items: Item[] = dto.items;
  const saudacao = `Olá, gostaria de fazer o seguinte pedido${dto.cliente_nome ? ` — ${dto.cliente_nome}` : ''}:`;
  const linhas = items.map((it: Item) => `${it.quantidade}x vela: ${it.nome_vela} - ${it.tamanho} ${formatBRL(it.preco_unitario)}`);
  const total = items.reduce((s: number, it: Item) => s + it.preco_unitario * it.quantidade, 0);
  const totalFormat = formatBRL(total);

  const mensagem = [saudacao, ...linhas, `Total Geral: ${totalFormat}`, dto.observacao ?? '', 'Aguardando confirmação!'].filter(Boolean).join('\n');
  const encoded = encodeURIComponent(mensagem);
  return { mensagem, encoded, waUrl: `https://wa.me/${wApp}?text=${encoded}` };
}

export function generateWhatsAppMessage(
  items: CreatePedidoDTO["items"],
  wApp: string,
  saudacao = "Olá, gostaria de fazer o seguinte pedido:"
){
  type Item = {
    nome_vela: string; 
    tamanho: string;
    preco_unitario: number;
    quantidade: number;
  };

  const linhas = items.map((it: Item) => `${it.quantidade}x vela: ${it.nome_vela} - ${it.tamanho} ${formatBRL(it.preco_unitario)}`);
  const total = items.reduce((s: number, it: Item) => s + it.preco_unitario * it.quantidade, 0);
  const mensagem = [saudacao, ...linhas, `Total Geral: ${formatBRL(total)}`, 'Aguardando confirmação!'].join('\n');
  const encoded = encodeURIComponent(mensagem);
  return { mensagem, encoded, waUrl: `https://wa.me/${wApp}?text=${encoded}` };
}