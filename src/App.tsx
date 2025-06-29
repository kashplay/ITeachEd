import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import { LandingPage } from './pages/LandingPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { LoginPage } from './pages/auth/LoginPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { PreEvaluationPage } from './pages/PreEvaluationPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { DashboardPage } from './pages/DashboardPage'
import { LearningPage } from './pages/LearningPage'
import { AchievementsPage } from './pages/AchievementsPage'
import { SettingsPage } from './pages/SettingsPage'
import NotesPage from './pages/NotesPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Routes */}
            <Route path="/pre-evaluation" element={
              <ProtectedRoute>
                <PreEvaluationPage />
              </ProtectedRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <LearningPage />
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <AchievementsPage />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App