import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl,
  keyExists: !!supabaseKey,
  keyLength: supabaseKey ? supabaseKey.length : 0,
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV
})

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl)
  throw new Error('Invalid Supabase URL format')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'iteached-web-app'
    }
  }
})

console.log('✅ Supabase client initialized successfully')

// Production-specific auth event logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔄 Supabase Auth Event:', {
    event,
    hasSession: !!session,
    userEmail: session?.user?.email,
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE
  })
})