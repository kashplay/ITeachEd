import { supabase } from '../lib/supabase'

/**
 * Targeted diagnosis for timeout issues
 * This will help us identify exactly where the connection is failing
 */
export class TimeoutDiagnosis {
  
  /**
   * Test 1: Environment Variables Validation
   */
  static validateEnvironment() {
    console.log('🔍 Environment Variables Diagnosis:')
    
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log(`URL: ${url ? '✅' : '❌'} ${url || 'MISSING'}`)
    console.log(`Key: ${key ? '✅' : '❌'} ${key ? `${key.substring(0, 20)}...` : 'MISSING'}`)
    
    if (!url || !key) {
      console.log('❌ CRITICAL: Missing environment variables!')
      return false
    }
    
    // Validate URL format
    try {
      const urlObj = new URL(url)
      console.log(`URL Host: ✅ ${urlObj.hostname}`)
    } catch (error) {
      console.log('❌ CRITICAL: Invalid URL format!')
      return false
    }
    
    return true
  }
  
  /**
   * Test 2: Network Connectivity Test
   */
  static async testNetworkConnectivity() {
    console.log('\n🔍 Network Connectivity Test:')
    
    const url = import.meta.env.VITE_SUPABASE_URL
    if (!url) {
      console.log('❌ No URL to test')
      return false
    }
    
    try {
      console.log('📡 Testing basic HTTP connectivity...')
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      const response = await fetch(`${url}/rest/v1/`, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      })
      
      clearTimeout(timeoutId)
      
      console.log(`✅ HTTP Response: ${response.status} ${response.statusText}`)
      return response.ok || response.status === 401 // 401 is expected for HEAD request
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('❌ TIMEOUT: Network request took longer than 3 seconds')
        } else {
          console.log(`❌ Network Error: ${error.message}`)
        }
      }
      return false
    }
  }
  
  /**
   * Test 3: Supabase Client Health
   */
  static async testSupabaseClient() {
    console.log('\n🔍 Supabase Client Test:')
    
    if (!supabase) {
      console.log('❌ Supabase client not initialized')
      return false
    }
    
    try {
      console.log('🔧 Testing auth service...')
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      
      // Test the simplest possible operation
      const authPromise = supabase.auth.getSession()
      
      const { data, error } = await Promise.race([
        authPromise,
        new Promise<any>((_, reject) => {
          setTimeout(() => reject(new Error('Auth timeout')), 2000)
        })
      ])
      
      clearTimeout(timeoutId)
      
      if (error) {
        console.log(`❌ Auth Error: ${error.message}`)
        return false
      }
      
      console.log('✅ Auth service responsive')
      console.log(`Session: ${data.session ? '✅ Active' : '⚠️ None'}`)
      
      return true
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log('❌ TIMEOUT: Auth service not responding')
      } else {
        console.log(`❌ Auth Exception: ${error instanceof Error ? error.message : 'Unknown'}`)
      }
      return false
    }
  }
  
  /**
   * Test 4: Database Connection Test
   */
  static async testDatabaseConnection() {
    console.log('\n🔍 Database Connection Test:')
    
    try {
      console.log('📊 Testing database query...')
      
      // Use the simplest possible query with aggressive timeout
      const queryPromise = supabase
        .from('user_profiles')
        .select('count')
        .limit(0)
      
      const { data, error } = await Promise.race([
        queryPromise,
        new Promise<any>((_, reject) => {
          setTimeout(() => reject(new Error('Database query timeout')), 1500)
        })
      ])
      
      if (error) {
        console.log(`❌ Database Error: ${error.message}`)
        console.log(`Error Code: ${error.code}`)
        console.log(`Error Details: ${error.details}`)
        return false
      }
      
      console.log('✅ Database connection successful')
      return true
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log('❌ TIMEOUT: Database query hanging')
        console.log('🚨 This is likely the root cause of the loading issue!')
      } else {
        console.log(`❌ Database Exception: ${error instanceof Error ? error.message : 'Unknown'}`)
      }
      return false
    }
  }
  
  /**
   * Test 5: Upsert Operation Test
   */
  static async testUpsertOperation() {
    console.log('\n🔍 Upsert Operation Test:')
    
    try {
      // First check if we have a user
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        console.log('⚠️ No authenticated user - cannot test upsert')
        return false
      }
      
      console.log('📝 Testing upsert operation...')
      
      const testData = {
        user_id: session.user.id,
        full_name: 'Timeout Test User',
        guild_level: 'ROOKIE',
        xp: 0,
        updated_at: new Date().toISOString()
      }
      
      const upsertPromise = supabase
        .from('user_profiles')
        .upsert(testData, { onConflict: 'user_id' })
        .select()
        .single()
      
      const { data, error } = await Promise.race([
        upsertPromise,
        new Promise<any>((_, reject) => {
          setTimeout(() => reject(new Error('Upsert timeout')), 1000)
        })
      ])
      
      if (error) {
        console.log(`❌ Upsert Error: ${error.message}`)
        console.log(`Error Code: ${error.code}`)
        return false
      }
      
      console.log('✅ Upsert operation successful')
      return true
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log('❌ TIMEOUT: Upsert operation hanging')
        console.log('🚨 FOUND THE PROBLEM! Upsert is causing the infinite loading!')
      } else {
        console.log(`❌ Upsert Exception: ${error instanceof Error ? error.message : 'Unknown'}`)
      }
      return false
    }
  }
  
  /**
   * Run complete diagnosis
   */
  static async runCompleteDiagnosis() {
    console.log('🚀 SUPABASE TIMEOUT DIAGNOSIS')
    console.log('=' .repeat(50))
    
    const results = {
      environment: false,
      network: false,
      client: false,
      database: false,
      upsert: false
    }
    
    // Test 1: Environment
    results.environment = this.validateEnvironment()
    if (!results.environment) {
      console.log('\n🚨 DIAGNOSIS COMPLETE: Environment variables are missing or invalid!')
      return results
    }
    
    // Test 2: Network
    results.network = await this.testNetworkConnectivity()
    if (!results.network) {
      console.log('\n🚨 DIAGNOSIS COMPLETE: Network connectivity issues!')
      return results
    }
    
    // Test 3: Client
    results.client = await this.testSupabaseClient()
    if (!results.client) {
      console.log('\n🚨 DIAGNOSIS COMPLETE: Supabase client issues!')
      return results
    }
    
    // Test 4: Database
    results.database = await this.testDatabaseConnection()
    if (!results.database) {
      console.log('\n🚨 DIAGNOSIS COMPLETE: Database connection hanging!')
      console.log('\n💡 SOLUTION: Check Supabase project status and database health')
      return results
    }
    
    // Test 5: Upsert
    results.upsert = await this.testUpsertOperation()
    if (!results.upsert) {
      console.log('\n🚨 DIAGNOSIS COMPLETE: Upsert operation hanging!')
      console.log('\n💡 SOLUTION: Database schema or RLS policy issues')
      return results
    }
    
    console.log('\n✅ All tests passed - no timeout issues detected')
    console.log('=' .repeat(50))
    
    return results
  }
  
  /**
   * Quick 5-second diagnosis
   */
  static async quickDiagnosis() {
    console.log('⚡ QUICK TIMEOUT DIAGNOSIS (5 seconds max)')
    console.log('-' .repeat(40))
    
    const startTime = Date.now()
    
    try {
      // Test environment first (instant)
      if (!this.validateEnvironment()) {
        console.log('❌ Environment variables missing')
        return false
      }
      
      // Test basic connectivity (2s timeout)
      console.log('📡 Testing connectivity...')
      const networkOk = await this.testNetworkConnectivity()
      
      if (!networkOk) {
        console.log('❌ Network connectivity failed')
        return false
      }
      
      // Test database (1s timeout)
      console.log('📊 Testing database...')
      const dbOk = await this.testDatabaseConnection()
      
      if (!dbOk) {
        console.log('❌ Database connection hanging - THIS IS THE PROBLEM!')
        return false
      }
      
      const totalTime = Date.now() - startTime
      console.log(`✅ Quick diagnosis passed (${totalTime}ms)`)
      return true
      
    } catch (error) {
      console.log(`❌ Quick diagnosis failed: ${error instanceof Error ? error.message : 'Unknown'}`)
      return false
    }
  }
}

// Auto-run quick diagnosis
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).timeoutDiagnosis = TimeoutDiagnosis
  
  console.log('🔧 Timeout Diagnosis loaded!')
  console.log('Commands:')
  console.log('• await timeoutDiagnosis.quickDiagnosis() - 5 second test')
  console.log('• await timeoutDiagnosis.runCompleteDiagnosis() - Full test')
  
  // Auto-run quick diagnosis after a delay
  setTimeout(async () => {
    console.log('\n🚀 Auto-running quick timeout diagnosis...')
    await TimeoutDiagnosis.quickDiagnosis()
  }, 2000)
}

export default TimeoutDiagnosis