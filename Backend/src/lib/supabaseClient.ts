//src/services/supabaseClient.ts
import dotenv from 'dotenv'
dotenv.config()

/* Configuração do cliente Supabase */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltando SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env')
}

// Cliente Supabase com privilégios de administrador
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});
