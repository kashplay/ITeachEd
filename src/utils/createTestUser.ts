import { supabase } from '../lib/supabase'

export interface TestUser {
  email: string
  password: string
  fullName: string
}

export const testUsers: TestUser[] = [
  {
    email: 'test@iteached.com',
    password: 'testpassword123',
    fullName: 'Test User'
  }
]

/**
 * Creates test user in development environment
 * Only works when called from development mode
 */
export async function createTestUser() {
  if (!import.meta.env.DEV) {
    console.warn('createTestUser can only be used in development mode')
    return
  }

  console.log('Creating test user...')
  
  for (const testUser of testUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            full_name: testUser.fullName
          }
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`✅ Test user ${testUser.email} already exists`)
        } else {
          console.error(`❌ Error creating ${testUser.email}:`, error.message)
        }
      } else {
        console.log(`✅ Created test user: ${testUser.email}`)
      }
    } catch (error) {
      console.error(`❌ Exception creating ${testUser.email}:`, error)
    }
  }
}

/**
 * Signs in with the default test user
 */
export async function signInWithTestUser() {
  if (!import.meta.env.DEV) {
    console.warn('signInWithTestUser can only be used in development mode')
    return { data: null, error: new Error('Not in development mode') }
  }

  const testUser = testUsers[0] // Use the first test user
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    })

    if (error) {
      console.error('❌ Test user sign in failed:', error.message)
    } else {
      console.log('✅ Signed in with test user:', testUser.email)
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Exception during test user sign in:', error)
    return { data: null, error }
  }
} 