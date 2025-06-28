import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import iteachedLogo from '../../assets/images/iteached-logo.svg'

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const slides = [
    {
      image: '/dashboard-preview.png',
      title: 'Your Goals.\nYour Roadmap.',
      description: 'AI builds a step-by-step learning plan tailored to your skills, interests, and career goals'
    },
    {
      image: '/ai-tutor-preview.png',
      title: 'Learn Faster with Your Own\nAI Tutor',
      description: 'Interactive lessons, smart explanations, and instant answers'
    },
    {
      image: '/progress-tracking-preview.png',
      title: 'Track Progress.\nStay Motivated.',
      description: 'See your growth over time, earn rewards, and stay engaged with personalized encouragement along the way'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!formData.email || !formData.password) {
      setErrors({ general: 'Please fill in all fields' })
      return
    }

    setLoading(true)
    try {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        setErrors({ general: error.message })
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setErrors({ general: error.message })
      }
    } catch (error) {
      setErrors({ general: 'Failed to sign in with Google' })
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-advance slides every 6 seconds
  React.useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Logo in top left corner */}
      <div className="absolute top-6 left-6 z-10">
        <img 
          src={iteachedLogo} 
          alt="ITeachEd" 
          className="h-8"
        />
      </div>

      <div className="flex flex-1">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Get Started Now</h2>
              <p className="mt-2 text-gray-400">Enter your credentials to access your account</p>
            </div>

            <div className="space-y-6">
              {errors.general && (
                <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
                  {errors.general}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                icon={GoogleIcon}
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-950 text-gray-400">or</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="johndoe@email.com"
                    className="w-full bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-[#6244FF] focus:ring-1 focus:ring-[#6244FF] px-4 py-3 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••"
                      className="w-full bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-[#6244FF] focus:ring-1 focus:ring-[#6244FF] px-4 py-3 pr-12 transition-colors"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-600 text-[#6244FF] focus:ring-[#6244FF] bg-gray-800" />
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                  </label>
                  <Link to="/auth/forgot-password" className="text-sm text-[#6244FF] hover:text-[#4F37CC]">
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full group"
                  loading={loading}
                  size="lg"
                >
                  Continue
                </Button>
              </form>

              <div className="text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/auth/signup" className="text-[#6244FF] hover:text-[#4F37CC] font-medium">
                    Sign Up
                  </Link>
                </p>
              </div>

              <div className="text-center text-xs text-gray-500 mt-8">
                2025 ITeachEd, All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Slideshow */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="relative w-full h-full">
            {/* Slide Content */}
            <div className="absolute inset-0 transition-all duration-700 ease-in-out">
              <img 
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title.replace('\n', ' ')}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 flex items-center justify-center">
                <div className="text-center text-white px-8 max-w-lg">
                  <h2 className="text-4xl font-bold mb-6 leading-tight whitespace-pre-line drop-shadow-lg">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-xl text-white/95 leading-relaxed drop-shadow-md">
                    {slides[currentSlide].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70 hover:scale-110'
                  }`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}