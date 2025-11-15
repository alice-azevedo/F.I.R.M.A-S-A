// src/services/productsService.ts

import { supabase } from '../lib/supabaseClient';

export type ProdutoDB = {
    id: string;
    nome: string;
    descricao: string;
    url_imagem?: string;
};

export async function fetchAll(): Promise<ProdutoDB[]> {
    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true});
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function fetchById(id: string): Promise<ProdutoDB | null> {
    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        if (error.code === 'PGRST116' || /No rows/.test(error.message)) return null;
        throw new Error(error.message);
    
    }
    return data ?? null
}