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
  import('./utils/validateUpsert').then(({ validateUpsertOperation, UpsertValidator }) => {
    (window as any).upsertValidator = {
      validateUpsertOperation,
      UpsertValidator,
      help: () => {
        console.log(`
🔍 Upsert Validation Utilities:

Available commands:
• upsertValidator.validateUpsertOperation() - Run full validation
• upsertValidator.UpsertValidator.runFullValidation() - Detailed validation
• upsertValidator.help() - Show this help message

Usage:
1. Sign in with a test user first: devHelpers.signInWithTestUser()
2. Run validation: upsertValidator.validateUpsertOperation()
        `)
      }
    }
    
    console.log('🔍 Upsert validation utilities loaded! Type "upsertValidator.help()" for available commands.')
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);