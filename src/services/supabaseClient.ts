//src/services/supabaseClient.ts
/* Configuração do cliente Supabase */
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

// Carrega as variáveis de ambiente do arquivo .env
const url = process.env.SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Verifica se as variáveis de ambiente estão definidas
if (!url || !serviceRoleKey) {
  throw new Error('Faltando SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env')
}

// Cliente Supabase com privilégios de administrador
export const supabaseAdmin: SupabaseClient = createClient(url, serviceRoleKey)
