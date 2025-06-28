import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { OnboardingData } from '../types'
import iteachedLogo from '../assets/images/iteached-logo.svg'

const steps = [
  {
    title: 'What are your career goals?',
    subtitle: 'Select all that apply to help us personalize your journey',
    type: 'multiple-choice',
    options: [
      'Get promoted in current role',
      'Switch to a new career',
      'Learn new technical skills',
      'Start my own business',
      'Improve leadership skills',
      'Increase salary'
    ]
  },
  {
    title: 'What skills do you currently have?',
    subtitle: 'Help us understand your starting point',
    type: 'multiple-choice',
    options: [
      'Programming/Development',
      'Data Analysis',
      'Digital Marketing',
      'Project Management',
      'Design/UX',
      'Sales',
      'Leadership',
      'None of the above'
    ]
  },
  {
    title: 'How do you prefer to learn?',
    subtitle: 'We will tailor your experience to your learning style',
    type: 'single-choice',
    options: [
      'Video lessons and tutorials',
      'Reading articles and documentation',
      'Hands-on projects and practice',
      'Interactive exercises',
      'Group discussions and forums'
    ]
  },
  {
    title: 'What is your experience level?',
    subtitle: 'This helps us recommend the right difficulty level',
    type: 'single-choice',
    options: [
      'Complete beginner',
      'Some experience',
      'Intermediate',
      'Advanced',
      'Expert'
    ]
  }
]

export function OnboardingPage() {
  const { updateProfile } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<OnboardingData>({
    career_goals: [],
    current_skills: [],
    learning_style: '',
    experience_level: '',
    interests: []
  })

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleOptionSelect = (option: string) => {
    const step = steps[currentStep]
    
    if (step.type === 'multiple-choice') {
      const key = currentStep === 0 ? 'career_goals' : 'current_skills'
      setFormData(prev => ({
        ...prev,
        [key]: prev[key].includes(option)
          ? prev[key].filter(item => item !== option)
          : [...prev[key], option]
      }))
    } else {
      const key = currentStep === 2 ? 'learning_style' : 'experience_level'
      setFormData(prev => ({
        ...prev,
        [key]: option
      }))
    }
  }

  const isOptionSelected = (option: string) => {
    const step = steps[currentStep]
    
    if (step.type === 'multiple-choice') {
      const key = currentStep === 0 ? 'career_goals' : 'current_skills'
      return formData[key].includes(option)
    } else {
      const key = currentStep === 2 ? 'learning_style' : 'experience_level'
      return formData[key] === option
    }
  }

  const canProceed = () => {
    const step = steps[currentStep]
    
    if (step.type === 'multiple-choice') {
      const key = currentStep === 0 ? 'career_goals' : 'current_skills'
      return formData[key].length > 0
    } else {
      const key = currentStep === 2 ? 'learning_style' : 'experience_level'
      return formData[key] !== ''
    }
  }

  const handleNext = () => {
    if (canProceed() && !isLastStep) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    if (!canProceed()) return

    setLoading(true)
    try {
      await updateProfile({
        career_goals: formData.career_goals,
        current_skills: formData.current_skills,
        learning_style: formData.learning_style,
        experience_level: formData.experience_level,
        xp: 0,
        guild_level: 'ROOKIE',
        pathways_completed: 0,
        total_hours: 0,
        projects_completed: 0,
        guild_rank: 0
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
                              src={iteachedLogo} 
              alt="ITeachEd AI Career Assessment" 
              className="h-10"
            />
          </div>
          
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-[#6244FF]' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-400">
              {currentStepData.subtitle}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {currentStepData.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`
                  w-full p-4 rounded-xl border text-left transition-all duration-200
                  ${isOptionSelected(option)
                    ? 'border-[#6244FF] bg-[#6244FF]/10 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-colors
                    ${isOptionSelected(option)
                      ? 'border-[#6244FF] bg-[#6244FF]'
                      : 'border-gray-600'
                    }
                  `}>
                    {isOptionSelected(option) && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              icon={ChevronLeft}
            >
              Previous
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                loading={loading}
                icon={Sparkles}
                iconPosition="right"
                className="group"
              >
                Complete Setup
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                icon={ChevronRight}
                iconPosition="right"
                className="group"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}