import { supabase } from '../lib/supabase'

interface ValidationResult {
  success: boolean
  error?: string
  details?: any
  timing?: number
}

/**
 * Comprehensive validation script for upsert operations
 * This will help us identify exactly why the upsert is failing or timing out
 */
export class UpsertValidator {
  
  /**
   * Test 1: Basic connection and auth validation
   */
  static async validateConnection(): Promise<ValidationResult> {
    const start = Date.now()
    
    try {
      console.log('🔍 Test 1: Validating Supabase connection...')
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        return {
          success: false,
          error: `Auth session error: ${error.message}`,
          timing: Date.now() - start
        }
      }
      
      if (!session?.user) {
        return {
          success: false,
          error: 'No authenticated user found',
          timing: Date.now() - start
        }
      }
      
      console.log('✅ Connection validated successfully')
      return {
        success: true,
        details: {
          userId: session.user.id,
          userEmail: session.user.email,
          hasMetadata: !!session.user.user_metadata
        },
        timing: Date.now() - start
      }
      
    } catch (error) {
      return {
        success: false,
        error: `Connection exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - start
      }
    }
  }
  
  /**
   * Test 2: Table structure validation
   */
  static async validateTableStructure(): Promise<ValidationResult> {
    const start = Date.now()
    
    try {
      console.log('🔍 Test 2: Validating table structure...')
      
      // Try to describe the table structure
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(0)
      
      if (error) {
        return {
          success: false,
          error: `Table access error: ${error.message}`,
          details: error,
          timing: Date.now() - start
        }
      }
      
      console.log('✅ Table structure validated successfully')
      return {
        success: true,
        details: { tableAccessible: true },
        timing: Date.now() - start
      }
      
    } catch (error) {
      return {
        success: false,
        error: `Table validation exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - start
      }
    }
  }
  
  /**
   * Test 3: Check if profile already exists
   */
  static async validateExistingProfile(userId: string): Promise<ValidationResult> {
    const start = Date.now()
    
    try {
      console.log('🔍 Test 3: Checking for existing profile...')
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (error) {
        return {
          success: false,
          error: `Profile check error: ${error.message}`,
          details: error,
          timing: Date.now() - start
        }
      }
      
      console.log('✅ Profile check completed')
      return {
        success: true,
        details: {
          profileExists: !!data,
          profileData: data
        },
        timing: Date.now() - start
      }
      
    } catch (error) {
      return {
        success: false,
        error: `Profile check exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - start
      }
    }
  }
  
  /**
   * Test 4: Test RLS policies
   */
  static async validateRLS(userId: string): Promise<ValidationResult> {
    const start = Date.now()
    
    try {
      console.log('🔍 Test 4: Testing RLS policies...')
      
      // Test SELECT policy
      const { data: selectData, error: selectError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
      
      if (selectError) {
        return {
          success: false,
          error: `RLS SELECT policy error: ${selectError.message}`,
          details: selectError,
          timing: Date.now() - start
        }
      }
      
      console.log('✅ RLS policies validated successfully')
      return {
        success: true,
        details: { 
          rlsWorking: true,
          canSelect: true,
          existingRecords: selectData?.length || 0
        },
        timing: Date.now() - start
      }
      
    } catch (error) {
      return {
        success: false,
        error: `RLS validation exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - start
      }
    }
  }
  
  /**
   * Test 5: Test upsert operation with timeout
   */
  static async validateUpsert(userId: string, userData: any): Promise<ValidationResult> {
    const start = Date.now()
    
    try {
      console.log('🔍 Test 5: Testing upsert operation...')
      
      const upsertData = {
        user_id: userId,
        full_name: userData.full_name || 'Test User',
        guild_level: 'ROOKIE',
        xp: 0,
        pathways_completed: 0,
        guild_rank: 999999,
        total_hours: 0,
        projects_completed: 0,
        learning_style: userData.learning_style || 'visual',
        experience_level: userData.experience_level || 'beginner',
        evaluation_completed: true,
        evaluation_results: userData.evaluation_results || {},
        evaluation_answers: userData.evaluation_answers || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('📤 Attempting upsert with data:', upsertData)
      
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upsert operation timed out after 5 seconds')), 5000)
      })
      
      // Race the upsert against the timeout
      const upsertPromise = supabase
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single()
      
      const { data, error } = await Promise.race([upsertPromise, timeoutPromise])
      
      if (error) {
        return {
          success: false,
          error: `Upsert error: ${error.message}`,
          details: {
            errorCode: error.code,
            errorDetails: error.details,
            errorHint: error.hint,
            upsertData
          },
          timing: Date.now() - start
        }
      }
      
      console.log('✅ Upsert operation successful')
      return {
        success: true,
        details: { upsertedData: data },
        timing: Date.now() - start
      }
      
    } catch (error) {
      return {
        success: false,
        error: `Upsert exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - start
      }
    }
  }
  
  /**
   * Run comprehensive validation
   */
  static async runFullValidation(): Promise<{
    overallSuccess: boolean
    results: Record<string, ValidationResult>
    summary: string
  }> {
    console.log('🚀 Starting comprehensive upsert validation...')
    
    const results: Record<string, ValidationResult> = {}
    
    // Test 1: Connection
    results.connection = await this.validateConnection()
    if (!results.connection.success) {
      return {
        overallSuccess: false,
        results,
        summary: `❌ Connection failed: ${results.connection.error}`
      }
    }
    
    const userId = results.connection.details?.userId
    if (!userId) {
      return {
        overallSuccess: false,
        results,
        summary: '❌ No user ID found in session'
      }
    }
    
    // Test 2: Table structure
    results.tableStructure = await this.validateTableStructure()
    
    // Test 3: Existing profile check
    results.existingProfile = await this.validateExistingProfile(userId)
    
    // Test 4: RLS policies
    results.rls = await this.validateRLS(userId)
    
    // Test 5: Upsert operation
    const testData = {
      full_name: 'Validation Test User',
      learning_style: 'visual',
      experience_level: 'beginner',
      evaluation_results: { test: true },
      evaluation_answers: { 1: 'test' }
    }
    
    results.upsert = await this.validateUpsert(userId, testData)
    
    // Generate summary
    const failedTests = Object.entries(results).filter(([_, result]) => !result.success)
    const totalTime = Object.values(results).reduce((sum, result) => sum + (result.timing || 0), 0)
    
    if (failedTests.length === 0) {
      return {
        overallSuccess: true,
        results,
        summary: `✅ All tests passed! Total time: ${totalTime}ms`
      }
    } else {
      const failedTestNames = failedTests.map(([name]) => name).join(', ')
      const firstError = failedTests[0][1].error
      return {
        overallSuccess: false,
        results,
        summary: `❌ Failed tests: ${failedTestNames}. First error: ${firstError}`
      }
    }
  }
}

/**
 * Quick validation function for development console
 */
export async function validateUpsertOperation() {
  const validation = await UpsertValidator.runFullValidation()
  
  console.log('\n📊 UPSERT VALIDATION RESULTS')
  console.log('=' .repeat(50))
  console.log(`Overall Success: ${validation.overallSuccess ? '✅' : '❌'}`)
  console.log(`Summary: ${validation.summary}`)
  console.log('\nDetailed Results:')
  
  Object.entries(validation.results).forEach(([testName, result]) => {
    const status = result.success ? '✅' : '❌'
    const timing = result.timing ? ` (${result.timing}ms)` : ''
    console.log(`  ${status} ${testName}${timing}`)
    
    if (!result.success) {
      console.log(`    Error: ${result.error}`)
      if (result.details) {
        console.log(`    Details:`, result.details)
      }
    }
  })
  
  console.log('=' .repeat(50))
  
  return validation
}

/**
 * Quick test functions for immediate debugging
 */
export const quickTests = {
  async testConnection() {
    console.log('🔍 Quick Connection Test...')
    const result = await UpsertValidator.validateConnection()
    console.log(result.success ? '✅ Connected' : `❌ ${result.error}`)
    return result
  },
  
  async testUpsert() {
    console.log('🔍 Quick Upsert Test...')
    const connectionResult = await UpsertValidator.validateConnection()
    if (!connectionResult.success) {
      console.log('❌ No connection, cannot test upsert')
      return connectionResult
    }
    
    const userId = connectionResult.details?.userId
    const result = await UpsertValidator.validateUpsert(userId, {
      full_name: 'Quick Test User',
      learning_style: 'visual'
    })
    
    console.log(result.success ? '✅ Upsert worked' : `❌ ${result.error}`)
    return result
  },
  
  async checkCurrentUser() {
    console.log('🔍 Current User Check...')
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('❌ Session error:', error.message)
      return { success: false, error }
    }
    
    if (!session?.user) {
      console.log('❌ No user session found')
      return { success: false, error: 'No session' }
    }
    
    console.log('✅ User found:', {
      id: session.user.id,
      email: session.user.email,
      metadata: session.user.user_metadata
    })
    
    return { success: true, user: session.user }
  }
}