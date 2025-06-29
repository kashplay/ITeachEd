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
    
    // Auto-run quick tests
    setTimeout(async () => {
      console.log('\n🚀 Auto-running Supabase connection diagnostics...')
      
      // Check environment first
      const envOk = SupabaseConnectionTest.checkEnvironmentVariables()
      
      if (envOk) {
        // Run quick connection test
        await SupabaseConnectionTest.quickConnectionTest()
      } else {
        console.log('❌ Environment variables not properly configured!')
      }
    }, 1000)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);