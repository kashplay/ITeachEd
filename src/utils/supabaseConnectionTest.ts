import { supabase } from '../lib/supabase'

/**
 * Comprehensive Supabase Connection Test
 * This will test every aspect of our Supabase setup
 */
export class SupabaseConnectionTest {
  
  static async runAllTests() {
    console.log('🚀 Starting Comprehensive Supabase Connection Test...')
    console.log('=' .repeat(60))
    
    const results = {
      clientInit: false,
      basicConnection: false,
      authService: false,
      databaseAccess: false,
      userProfilesTable: false,
      rlsPolicies: false,
      overallHealth: false
    }
    
    try {
      // Test 1: Client Initialization
      console.log('🔍 Test 1: Supabase Client Initialization')
      if (supabase && typeof supabase.auth !== 'undefined') {
        results.clientInit = true
        console.log('✅ Supabase client initialized successfully')
        console.log(`   URL: ${import.meta.env.VITE_SUPABASE_URL}`)
        console.log(`   Key Length: ${import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0} characters`)
      } else {
        console.log('❌ Supabase client not properly initialized')
        return results
      }
      
      // Test 2: Basic Connection Test
      console.log('\n🔍 Test 2: Basic Connection Test')
      try {
        const startTime = Date.now()
        const { data, error } = await Promise.race([
          supabase.from('user_profiles').select('count').limit(0),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
        ])
        
        const responseTime = Date.now() - startTime
        
        if (error) {
          console.log('❌ Basic connection failed:', error.message)
          console.log('   Error Code:', error.code)
          console.log('   Error Details:', error.details)
        } else {
          results.basicConnection = true
          console.log(`✅ Basic connection successful (${responseTime}ms)`)
        }
      } catch (error) {
        console.log('❌ Connection test exception:', error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Test 3: Auth Service Test
      console.log('\n🔍 Test 3: Auth Service Test')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.log('❌ Auth service error:', error.message)
        } else {
          results.authService = true
          console.log('✅ Auth service working')
          
          if (session?.user) {
            console.log(`   User ID: ${session.user.id}`)
            console.log(`   User Email: ${session.user.email}`)
            console.log(`   Has Metadata: ${!!session.user.user_metadata}`)
          } else {
            console.log('   No active session (user not logged in)')
          }
        }
      } catch (error) {
        console.log('❌ Auth service exception:', error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Test 4: Database Access Test
      console.log('\n🔍 Test 4: Database Access Test')
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1)
        
        if (error) {
          console.log('❌ Database access failed:', error.message)
          console.log('   Error Code:', error.code)
          console.log('   Error Hint:', error.hint)
        } else {
          results.databaseAccess = true
          console.log('✅ Database access successful')
          console.log(`   Records found: ${data?.length || 0}`)
        }
      } catch (error) {
        console.log('❌ Database access exception:', error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Test 5: User Profiles Table Structure
      console.log('\n🔍 Test 5: User Profiles Table Structure')
      try {
        // Try to get table info by attempting a select with all expected columns
        const { data, error } = await supabase
          .from('user_profiles')
          .select(`
            id,
            user_id,
            full_name,
            guild_level,
            xp,
            pathways_completed,
            guild_rank,
            total_hours,
            projects_completed,
            learning_style,
            experience_level,
            career_goals,
            current_skills,
            evaluation_completed,
            evaluation_results,
            evaluation_answers,
            created_at,
            updated_at
          `)
          .limit(0)
        
        if (error) {
          console.log('❌ Table structure issue:', error.message)
          console.log('   This might indicate missing columns or table structure problems')
        } else {
          results.userProfilesTable = true
          console.log('✅ User profiles table structure is correct')
        }
      } catch (error) {
        console.log('❌ Table structure test exception:', error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Test 6: RLS Policies Test (only if user is logged in)
      console.log('\n🔍 Test 6: Row Level Security Policies Test')
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log('⚠️  Skipping RLS test - no authenticated user')
        } else {
          // Test SELECT policy
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', session.user.id)
          
          if (error) {
            console.log('❌ RLS policy test failed:', error.message)
            console.log('   This indicates RLS policy issues')
          } else {
            results.rlsPolicies = true
            console.log('✅ RLS policies working correctly')
            console.log(`   User can access ${data?.length || 0} profile records`)
          }
        }
      } catch (error) {
        console.log('❌ RLS test exception:', error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Overall Health Assessment
      console.log('\n📊 Overall Health Assessment')
      const passedTests = Object.values(results).filter(Boolean).length
      const totalTests = Object.keys(results).length - 1 // Exclude overallHealth
      
      results.overallHealth = passedTests >= totalTests * 0.8 // 80% pass rate
      
      console.log(`Tests Passed: ${passedTests}/${totalTests}`)
      console.log(`Overall Health: ${results.overallHealth ? '✅ HEALTHY' : '❌ ISSUES DETECTED'}`)
      
      if (!results.overallHealth) {
        console.log('\n🚨 ISSUES DETECTED:')
        Object.entries(results).forEach(([test, passed]) => {
          if (!passed && test !== 'overallHealth') {
            console.log(`   ❌ ${test}`)
          }
        })
        
        console.log('\n💡 RECOMMENDATIONS:')
        if (!results.clientInit) {
          console.log('   • Check environment variables in .env file')
        }
        if (!results.basicConnection) {
          console.log('   • Verify Supabase URL and API key')
          console.log('   • Check network connectivity')
        }
        if (!results.databaseAccess) {
          console.log('   • Verify database is accessible')
          console.log('   • Check Supabase project status')
        }
        if (!results.userProfilesTable) {
          console.log('   • Run database migrations')
          console.log('   • Check table structure in Supabase dashboard')
        }
        if (!results.rlsPolicies) {
          console.log('   • Review RLS policies in Supabase dashboard')
          console.log('   • Ensure user has proper permissions')
        }
      }
      
    } catch (error) {
      console.log('❌ Test suite exception:', error instanceof Error ? error.message : 'Unknown error')
    }
    
    console.log('=' .repeat(60))
    return results
  }
  
  /**
   * Quick connection test with immediate results
   */
  static async quickConnectionTest() {
    console.log('⚡ Quick Connection Test...')
    
    try {
      const startTime = Date.now()
      
      // Test basic connectivity with 3 second timeout
      const { error } = await Promise.race([
        supabase.from('user_profiles').select('count').limit(0),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Quick test timeout')), 3000)
        )
      ])
      
      const responseTime = Date.now() - startTime
      
      if (error) {
        console.log(`❌ Quick test failed (${responseTime}ms):`, error.message)
        return false
      } else {
        console.log(`✅ Quick test passed (${responseTime}ms)`)
        return true
      }
      
    } catch (error) {
      console.log('❌ Quick test exception:', error instanceof Error ? error.message : 'Unknown error')
      return false
    }
  }
  
  /**
   * Test environment variables
   */
  static checkEnvironmentVariables() {
    console.log('🔍 Environment Variables Check:')
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
    console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}`)
    
    if (supabaseUrl) {
      try {
        const url = new URL(supabaseUrl)
        console.log(`   URL Format: ✅ Valid (${url.hostname})`)
      } catch {
        console.log(`   URL Format: ❌ Invalid`)
      }
    }
    
    if (supabaseKey) {
      console.log(`   Key Length: ${supabaseKey.length} characters`)
      console.log(`   Key Format: ${supabaseKey.startsWith('eyJ') ? '✅ JWT format' : '⚠️  Unexpected format'}`)
    }
    
    return !!(supabaseUrl && supabaseKey)
  }
}

// Auto-run tests in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Make available globally for console access
  (window as any).supabaseTest = SupabaseConnectionTest
  
  console.log('🔧 Supabase Connection Test utilities loaded!')
  console.log('Available commands:')
  console.log('• await supabaseTest.runAllTests() - Full comprehensive test')
  console.log('• await supabaseTest.quickConnectionTest() - Quick 3s test')
  console.log('• supabaseTest.checkEnvironmentVariables() - Check env vars')
  
  // Auto-run environment check
  setTimeout(() => {
    console.log('\n🔧 Auto-running environment check...')
    SupabaseConnectionTest.checkEnvironmentVariables()
  }, 500)
}

export default SupabaseConnectionTest