// src/utils/generateWhatsAppMessage.ts

// Definição da interface para itens (produtos)
// Inclui nome e quantidade
// Exemplo: { nome: 'Vela Aromática', quantidade: 2 }
interface Item {
  nome: string
  quantidade: number
}

// Definição da interface para personalizações
// Inclui tamanho, cheiro, forma e quantidade{pode/deve ser alterado futuramente}
// Exemplo: { tamanho: 'Médio', cheiro: 'Lavanda', forma: 'Cilíndrica', quantidade: 2 }
interface Personalizacao {
  tamanho: string
  cheiro: string
  forma: string
  quantidade: number
}

// Função para gerar a mensagem formatada para o WhatsApp
// Inclui o nome do cliente, produtos e personalizações
// Se não houver produtos ou personalizações, essas seções são omitidas
// Exemplo de uso:
// const message = generateWhatsAppMessage('João', [{ nome: 'Vela Aromática', quantidade: 2 }], [{ tamanho: 'Médio', cheiro: 'Lavanda', forma: 'Cilíndrica', quantidade: 1 }])
// console.log(message)
export const generateWhatsAppMessage = (
  clienteNome: string,
  produtos: Item[] = [],
  personalizacoes: Personalizacao[] = []
) => {
  let message = `Olá! Gostaria de fazer um pedido.\n\n`
    
  if (produtos.length) {
    message += `Gostaria de comprar esses produtos prontos:\n`
    produtos.forEach((p) => {
      message += `- ${p.nome} (Quantidade: ${p.quantidade})\n`
    })
    message += `\n`
  }

  if (personalizacoes.length) {
    message += `Gostaria de ver essas velas personalizadas:\n`
    personalizacoes.forEach((p) => {
      message += `- Tamanho: ${p.tamanho} | Cheiro: ${p.cheiro} | Forma: ${p.forma} | Quantidade: ${p.quantidade}\n`
    })
    message += `\n`
  }
  message += `Cliente: ${clienteNome}`
  return message
}