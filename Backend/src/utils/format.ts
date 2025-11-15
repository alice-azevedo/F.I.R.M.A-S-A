// src/utils/format.ts

export const formatBRL = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});