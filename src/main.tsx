import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Development helpers
if (import.meta.env.DEV) {
  import('./utils/createTestUser').then(({ createTestUser, signInWithTestUser, testUsers }) => {
    // Make test utilities available in browser console for development
    (window as any).devHelpers = {
      createTestUser,
      signInWithTestUser,
      testUsers,
      help: () => {
        console.log(`
🔧 ITeachEd Development Helpers:
        
Available commands:
• devHelpers.createTestUser() - Create test user
• devHelpers.signInWithTestUser() - Sign in with test user
• devHelpers.testUsers - View test user credentials
• devHelpers.help() - Show this help message

Test credentials:
• Email: ${testUsers[0].email}
• Password: ${testUsers[0].password}
        `)
      }
    }
    
    console.log('🔧 Development helpers loaded! Type "devHelpers.help()" for available commands.')
  })

  // Load timeout diagnosis utilities (PRIORITY)
  import('./utils/timeoutDiagnosis').then((module) => {
    const TimeoutDiagnosis = module.default
    
    console.log('🚨 TIMEOUT DIAGNOSIS LOADED - This will identify the hanging issue!')
    console.log('Available commands:')
    console.log('• await timeoutDiagnosis.quickDiagnosis() - Quick 5s test')
    console.log('• await timeoutDiagnosis.runCompleteDiagnosis() - Full diagnosis')
    
    // Auto-run diagnosis immediately
    setTimeout(async () => {
      console.log('\n🚨 AUTO-RUNNING TIMEOUT DIAGNOSIS...')
      console.log('This will identify why the upsert is hanging!')
      
      const result = await TimeoutDiagnosis.quickDiagnosis()
      
      if (!result) {
        console.log(`
🚨 TIMEOUT ISSUE IDENTIFIED!

The diagnosis found where the connection is hanging.
This is causing the infinite loading screen in your app.

Next steps:
1. Check the specific error messages above
2. Verify your Supabase project is active
3. Check database health in Supabase dashboard
4. Verify RLS policies are not blocking operations

Run 'await timeoutDiagnosis.runCompleteDiagnosis()' for detailed analysis.
        `)
      }
    }, 1000)
  })

  // Load upsert validation utilities
  import('./utils/validateUpsert').then(({ validateUpsertOperation, UpsertValidator, quickTests }) => {
    (window as any).upsertValidator = {
      validateUpsertOperation,
      UpsertValidator,
      quickTests,
      help: () => {
        console.log(`
🔍 Upsert Validation Utilities:

Available commands:
• await upsertValidator.validateUpsertOperation() - Run full validation
• await upsertValidator.quickTests.testConnection() - Quick connection test
• await upsertValidator.quickTests.testUpsert() - Quick upsert test
• await upsertValidator.quickTests.testUpsertWithShortTimeout() - 2s timeout test
• await upsertValidator.quickTests.checkCurrentUser() - Check current user
• upsertValidator.quickTests.checkAuthState() - Immediate auth check (no await needed)
• upsertValidator.help() - Show this help message

⚠️  IMPORTANT: Remember to use 'await' with async functions!

Quick diagnosis:
1. Sign in: await devHelpers.signInWithTestUser()
2. Test: await upsertValidator.quickTests.testUpsertWithShortTimeout()
        `)
      }
    }
    
    console.log('🔍 Upsert validation utilities loaded! Type "upsertValidator.help()" for available commands.')
  })

  // Load Supabase connection test utilities
  import('./utils/supabaseConnectionTest').then((module) => {
    const SupabaseConnectionTest = module.default
    
    console.log('🔧 Supabase Connection Test utilities loaded!')
    console.log('Available commands:')
    console.log('• await supabaseTest.runAllTests() - Full comprehensive test')
    console.log('• await supabaseTest.quickConnectionTest() - Quick 3s test')
    console.log('• supabaseTest.checkEnvironmentVariables() - Check env vars')
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);