import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

// Question data structure
interface Question {
  id: number
  title: string
  question: string
  evaluates: string
  options: {
    id: string
    text: string
    icon: React.ReactNode
    learningStyle?: string[]
    traits?: string[]
  }[]
}

// Pre-evaluation questions
const questions: Question[] = [
  {
    id: 1,
    title: "Learning Style",
    question: "You're dropped into a world where no one knows how to solve a strange puzzle. You're told there's a treasure if you figure it out. What's your first instinct?",
    evaluates: "Learning style (visual, kinesthetic, analytical, collaborative)",
    options: [
      {
        id: "sketch",
        text: "Sketch the pieces and map the patterns.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        ),
        learningStyle: ["visual", "analytical"],
        traits: ["visual_learner", "pattern_recognition"]
      },
      {
        id: "test",
        text: "Test each possible move — fail fast, try again.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        ),
        learningStyle: ["kinesthetic", "experimental"],
        traits: ["hands_on_learner", "trial_and_error"]
      },
      {
        id: "ask",
        text: "Ask someone who might've seen it before.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
            </svg>
          </div>
        ),
        learningStyle: ["collaborative", "social"],
        traits: ["collaborative_learner", "seeks_guidance"]
      },
      {
        id: "read",
        text: "Read the puzzle instructions over and over.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        ),
        learningStyle: ["analytical", "methodical"],
        traits: ["methodical_learner", "instruction_focused"]
      }
    ]
  },
  {
    id: 2,
    title: "Focus Style",
    question: "You open a locked door. Inside are 3 tasks, but you only have 20 minutes before it locks again. How do you play it?",
    evaluates: "Focus style (sprinter vs marathoner), time management, task handling",
    options: [
      {
        id: "quickest",
        text: "Go for the quickest task first — get wins early.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        ),
        learningStyle: ["sprinter", "momentum_based"],
        traits: ["quick_wins", "momentum_learner"]
      },
      {
        id: "skim",
        text: "Skim all tasks, pick the one that feels best.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        ),
        learningStyle: ["intuitive", "overview_first"],
        traits: ["intuitive_learner", "big_picture_first"]
      },
      {
        id: "hardest",
        text: "Start with the hardest — if I crack that, I win.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        ),
        learningStyle: ["challenge_seeker", "difficulty_first"],
        traits: ["challenge_oriented", "high_difficulty_preference"]
      },
      {
        id: "divide",
        text: "Divide the time into chunks for each.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ),
        learningStyle: ["methodical", "time_manager"],
        traits: ["systematic_learner", "time_management"]
      }
    ]
  },
  {
    id: 3,
    title: "Memory & Revision",
    question: "You're told to teach someone a concept you barely remember. You've got 1 hour. What do you do first?",
    evaluates: "Memory & revision style, problem-solving under pressure",
    options: [
      {
        id: "diagram",
        text: "Make a quick diagram or mind map.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        ),
        learningStyle: ["visual", "structured"],
        traits: ["visual_organizer", "mind_mapping"]
      },
      {
        id: "video",
        text: "Watch a video and summarize aloud.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
            </svg>
          </div>
        ),
        learningStyle: ["auditory", "multimedia"],
        traits: ["auditory_learner", "multimedia_preference"]
      },
      {
        id: "recall",
        text: "Recall how you first learned it.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        ),
        learningStyle: ["reflective", "experiential"],
        traits: ["reflective_learner", "experience_based"]
      },
      {
        id: "example",
        text: "Search for a real-world example.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </div>
        ),
        learningStyle: ["contextual", "practical"],
        traits: ["contextual_learner", "real_world_application"]
      }
    ]
  },
  {
    id: 4,
    title: "Language Preference",
    question: "You're solving a mystery, but clues are in another language. You're offered a translator or a visual clueboard. What do you choose?",
    evaluates: "Language preference, visual vs verbal bias",
    options: [
      {
        id: "translator",
        text: "Give me the translator — I want the words.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
        ),
        learningStyle: ["verbal", "linguistic"],
        traits: ["verbal_processor", "language_focused"]
      },
      {
        id: "visual",
        text: "Show me the clueboard — I see patterns better.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
        ),
        learningStyle: ["visual", "pattern_recognition"],
        traits: ["visual_processor", "pattern_recognition"]
      },
      {
        id: "both",
        text: "I'll use both — context helps.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        ),
        learningStyle: ["multimodal", "comprehensive"],
        traits: ["multimodal_learner", "context_seeker"]
      },
      {
        id: "patterns",
        text: "Let me figure out the language from patterns.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        ),
        learningStyle: ["analytical", "independent"],
        traits: ["analytical_learner", "independent_discovery"]
      }
    ]
  },
  {
    id: 5,
    title: "Adaptability",
    question: "You enter a simulation that keeps changing rules as you play. What's your survival strategy?",
    evaluates: "Adaptability, analytical vs intuitive thinking, intrinsic vs extrinsic motivation",
    options: [
      {
        id: "observe",
        text: "Keep trying new moves and observe outcomes.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        ),
        learningStyle: ["experimental", "adaptive"],
        traits: ["experimental_learner", "adaptive_thinking"]
      },
      {
        id: "analyze",
        text: "Pause, analyze the pattern, adapt the plan.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        ),
        learningStyle: ["analytical", "strategic"],
        traits: ["analytical_thinker", "strategic_planner"]
      },
      {
        id: "follow",
        text: "Follow someone else who's doing well.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        ),
        learningStyle: ["social", "observational"],
        traits: ["social_learner", "observational_learning"]
      },
      {
        id: "break",
        text: "Try breaking the system — find the loophole.",
        icon: (
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        ),
        learningStyle: ["creative", "unconventional"],
        traits: ["creative_thinker", "rule_breaker"]
      }
    ]
  }
]

export function PreEvaluationPage() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [evaluationComplete, setEvaluationComplete] = useState(false)

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  const handleOptionSelect = (optionId: string) => {
    // Save the answer
    const newAnswers = {
      ...answers,
      [question.id]: optionId
    }
    setAnswers(newAnswers)

    // Auto-proceed to next question after a short delay for visual feedback
    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 300)
    } else {
      // On last question, just mark as complete but don't auto-redirect
      setTimeout(() => {
        setEvaluationComplete(true)
      }, 300)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setEvaluationComplete(false) // Reset completion state if going back
    } else {
      // If on first question, go back to landing page
      navigate('/')
    }
  }

  const handleProceedToDashboard = async () => {
    setLoading(true)
    try {
      console.log('🚀 Starting dashboard navigation process...')
      
      // Analyze answers to determine learning profile
      const learningProfile = analyzeLearningProfile(answers)
      console.log('📊 Learning profile analyzed:', learningProfile)
      
      // Prepare profile update data
      const profileUpdate = {
        learning_style: learningProfile.primaryStyle,
        experience_level: 'beginner', // Default for new users
        evaluation_completed: true,
        evaluation_results: learningProfile,
        evaluation_answers: answers
      }
      
      console.log('💾 Updating profile with:', profileUpdate)
      
      // Save the evaluation results to user profile
      await updateProfile(profileUpdate)
      
      console.log('✅ Profile updated successfully, navigating to dashboard...')
      
      // Redirect to dashboard
      navigate('/dashboard')
      
      console.log('🎯 Navigation to dashboard initiated')
    } catch (error) {
      console.error('❌ Error in dashboard navigation process:', error)
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        user: user?.id,
        hasProfile: !!profile
      })
      
      // Show user-friendly error message with option to proceed
      const userChoice = confirm(
        'There was an issue saving your evaluation results. Would you like to:\n\n' +
        'OK - Proceed to dashboard anyway (you can retake the evaluation later)\n' +
        'Cancel - Try again'
      )
      
      if (userChoice) {
        console.log('🔄 User chose to proceed without saving evaluation')
        // Proceed to dashboard without saving evaluation
        navigate('/dashboard')
        return
      }
    } finally {
      setLoading(false)
      console.log('🏁 Dashboard navigation process complete')
    }
  }

  const analyzeLearningProfile = (userAnswers: Record<number, string>) => {
    const traits: string[] = []
    const styles: string[] = []

    // Analyze each answer
    Object.entries(userAnswers).forEach(([questionId, answerId]) => {
      const q = questions.find(q => q.id === parseInt(questionId))
      const option = q?.options.find(opt => opt.id === answerId)
      
      if (option) {
        if (option.learningStyle) styles.push(...option.learningStyle)
        if (option.traits) traits.push(...option.traits)
      }
    })

    // Determine primary learning style
    const styleCount: Record<string, number> = {}
    styles.forEach(style => {
      styleCount[style] = (styleCount[style] || 0) + 1
    })

    const primaryStyle = Object.entries(styleCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'balanced'

    return {
      primaryStyle,
      traits: [...new Set(traits)],
      styles: [...new Set(styles)],
      recommendations: generateRecommendations(primaryStyle, traits)
    }
  }

  const generateRecommendations = (primaryStyle: string, traits: string[]) => {
    const recommendations = {
      courses: [] as string[],
      tutorStyle: '',
      learningPath: ''
    }

    // Course recommendations based on learning style
    if (primaryStyle.includes('visual')) {
      recommendations.courses.push('Data Visualization', 'UI/UX Design', 'Graphic Design')
      recommendations.tutorStyle = 'visual_focused'
    } else if (primaryStyle.includes('analytical')) {
      recommendations.courses.push('Data Science', 'Business Analytics', 'Programming')
      recommendations.tutorStyle = 'analytical_focused'
    } else if (primaryStyle.includes('collaborative')) {
      recommendations.courses.push('Project Management', 'Leadership', 'Team Building')
      recommendations.tutorStyle = 'collaborative_focused'
    } else {
      recommendations.courses.push('Business Fundamentals', 'Digital Marketing', 'Communication')
      recommendations.tutorStyle = 'balanced'
    }

    // Learning path based on traits
    if (traits.includes('challenge_oriented')) {
      recommendations.learningPath = 'accelerated'
    } else if (traits.includes('methodical_learner')) {
      recommendations.learningPath = 'structured'
    } else {
      recommendations.learningPath = 'flexible'
    }

    return recommendations
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d3a] via-[#2d3561] to-[#1a1d3a] text-white">
      {/* Header with only Back button */}
      <header className="flex items-center justify-between p-6">
        <button 
          onClick={handleBack}
          className="flex items-center space-x-2 text-[#FFAE2D] hover:text-[#FFD700] transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back</span>
        </button>
        
        {/* Empty div for spacing */}
        <div></div>
      </header>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="text-[#FFAE2D] text-sm font-medium">
          Question {currentQuestion + 1}/5
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{question.title}</h1>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-white mb-4">
            {currentQuestion + 1}. {question.question}
          </h2>
          <p className="text-[#FFAE2D] italic text-sm">
            Evaluates: {question.evaluates}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {question.options.map((option) => {
            const isSelected = answers[question.id] === option.id
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={loading}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                  isSelected
                    ? 'border-[#FFAE2D] bg-[#FFAE2D]/10 scale-105'
                    : 'border-gray-600/50 bg-gray-800/30 hover:border-gray-500/50 hover:bg-gray-700/30'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-4">
                  {option.icon}
                  <div className="flex-1">
                    <p className="text-white font-medium">{option.text}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-[#FFAE2D] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index <= currentQuestion ? 'bg-[#FFAE2D]' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation - Show proceed button only when evaluation is complete */}
        <div className="flex justify-center pb-8">
          {evaluationComplete && isLastQuestion ? (
            <Button
              onClick={handleProceedToDashboard}
              loading={loading}
              size="lg"
              className="px-8"
              icon={ChevronRight}
              iconPosition="right"
            >
              Proceed to Dashboard
            </Button>
          ) : loading ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#FFAE2D] border-t-transparent"></div>
              <span className="text-white">Processing your answer...</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}