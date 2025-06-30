import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import iteachedLogo from '../assets/images/iteached-logo.svg'

export function OnboardingPage() {
  const { user, profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // HARD CONDITION: If user has already completed evaluation, redirect to dashboard immediately
  useEffect(() => {
    if (user && profile && profile.evaluation_completed) {
      console.log('🔄 Onboarding: User has already completed evaluation, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
      return
    }
  }, [user, profile, navigate])

  const handleComplete = async () => {
    setLoading(true)
    try {
      // HARD CONDITION: Mark evaluation as completed when onboarding is finished
      await updateProfile({
        learning_style: 'balanced',
        experience_level: 'beginner',
        evaluation_completed: true, // HARD CONDITION: Mark as completed
        xp: 0,
        guild_level: 'ROOKIE',
        pathways_completed: 0,
        total_hours: 0,
        projects_completed: 0,
        guild_rank: 0
      })
      
      console.log('✅ Onboarding: Onboarding completed, redirecting to dashboard')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    // Pass state to indicate user came from onboarding via back button
    console.log('🔄 Onboarding: Back button clicked, redirecting to landing page with state')
    navigate('/', { 
      replace: true, 
      state: { fromPreEvaluation: true } 
    })
  }

  // If user has already completed evaluation, show loading while redirecting
  if (user && profile && profile.evaluation_completed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#6244FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={iteachedLogo} 
              alt="ITeachEd" 
              className="h-10"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to ITeachEd
            </h2>
            <p className="text-gray-400 mb-6">
              We're excited to have you join our learning platform. Our AI will personalize your learning experience based on your goals and preferences.
            </p>
            <div className="w-16 h-16 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-300">
              Click the button below to start your personalized learning journey.
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>

            <Button
              onClick={handleComplete}
              loading={loading}
              icon={Sparkles}
              iconPosition="right"
              className="group"
            >
              Start Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}