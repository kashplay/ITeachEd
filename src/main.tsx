import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Development helpers
if (import.meta.env.DEV) {
  import('./utils/createTestUser').then(({ createTestUser, signInWithTestUser, testSignOut, testUsers }) => {
    // Make test utilities available in browser console for development
    (window as any).devHelpers = {
      createTestUser,
      signInWithTestUser,
      testSignOut,
      testUsers,
      help: () => {
        console.log(`
🔧 ITeachEd Development Helpers:
        
Available commands:
• devHelpers.createTestUser() - Create test user
• devHelpers.signInWithTestUser() - Sign in with test user
• devHelpers.testSignOut() - Sign out current user
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
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
