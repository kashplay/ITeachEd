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
   * Test 4: Test simple insert operation
   */
  static async validateInsert(userId: string, userData: any): Promise<ValidationResult> {
    const start = Date.now()
    
    try {
      console.log('🔍 Test 4: Testing simple insert...')
      
      const insertData = {
        user_id: userId,
        full_name: userData.full_name || 'Test User',
        guild_level: 'ROOKIE',
        xp: 0,
        pathways_completed: 0,
        guild_rank: 999999,
        total_hours: 0,
        projects_completed: 0,
        evaluation_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(insertData)
        .select()
        .single()
      
      if (error) {
        return {
          success: false,
          error: `Insert error: ${error.message}`,
          details: {
            errorCode: error.code,
            errorDetails: error.details,
            errorHint: error.hint,
            insertData
          },
          timing: Date.now() - start
        }
      }
      
      console.log('✅ Insert operation successful')
      return {
        success: true,
        details: { insertedData: data },
        timing: Date.now() - start
      }
      
    } catch (error) {
      return {
        success: false,
        error: `Insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - start
      }
    }
  }
  
  /**
   * Test 5: Test upsert operation
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
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single()
      
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
   * Test 6: Test RLS policies
   */
  static async validateRLS(userId: string): Promise<ValidationResult> {
    const start = Date.now()
    
    try {
      console.log('🔍 Test 6: Testing RLS policies...')
      
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
      
      // Test INSERT policy (if no profile exists)
      if (!selectData || selectData.length === 0) {
        const testInsert = {
          user_id: userId,
          full_name: 'RLS Test User',
          guild_level: 'ROOKIE'
        }
        
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert(testInsert)
        
        if (insertError && !insertError.message.includes('duplicate')) {
          return {
            success: false,
            error: `RLS INSERT policy error: ${insertError.message}`,
            details: insertError,
            timing: Date.now() - start
          }
        }
      }
      
      console.log('✅ RLS policies validated successfully')
      return {
        success: true,
        details: { rlsWorking: true },
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
    
    // Test 5: Insert or Upsert based on existing profile
    const profileExists = results.existingProfile.details?.profileExists
    const testData = {
      full_name: 'Validation Test User',
      learning_style: 'visual',
      experience_level: 'beginner',
      evaluation_results: { test: true },
      evaluation_answers: { 1: 'test' }
    }
    
    if (profileExists) {
      results.upsert = await this.validateUpsert(userId, testData)
    } else {
      results.insert = await this.validateInsert(userId, testData)
    }
    
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