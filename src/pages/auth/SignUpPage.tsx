import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import iteachedLogo from '../../assets/images/iteached-logo.svg'
// Import feature images for reliable Netlify deployment
import dashboardPreview from '../../assets/images/features/dashboard-preview.png'

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export function SignUpPage() {
  const { user, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Slides for the right side carousel
  const slides = [
    {
      image: dashboardPreview,
      title: 'Your Goals.\nYour Roadmap.',
      description: 'AI builds a step-by-step learning plan tailored to your skills, interests, and career goals'
    }
  ]

  // Redirect to pre-evaluation if user is authenticated
  useEffect(() => {
    if (user) {
      setLoading(false) // Reset loading state
      navigate('/pre-evaluation', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName)
      if (error) {
        setErrors({ general: error.message })
        setLoading(false)
      }
      // Keep loading state until navigation happens via useEffect
      // Navigation will be handled by useEffect when auth state changes
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' })
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setErrors({ general: error.message })
      }
    } catch (error) {
      setErrors({ general: 'Failed to sign up with Google' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Get Started Now</h2>
            <p className="mt-2 text-gray-400">Enter your credentials to access your account</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
                {errors.general}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              icon={GoogleIcon}
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">or</span>
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
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.fullName.split(' ')[0] || ''}
                    onChange={(e) => {
                      const lastName = formData.fullName.split(' ').slice(1).join(' ')
                      setFormData(prev => ({ ...prev, fullName: `${e.target.value} ${lastName}`.trim() }))
                    }}
                    placeholder="John"
                    className="w-full bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-[#6244FF] focus:ring-1 focus:ring-[#6244FF] px-4 py-3 transition-colors"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.fullName.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => {
                      const firstName = formData.fullName.split(' ')[0] || ''
                      setFormData(prev => ({ ...prev, fullName: `${firstName} ${e.target.value}`.trim() }))
                    }}
                    placeholder="Doe"
                    className="w-full bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-[#6244FF] focus:ring-1 focus:ring-[#6244FF] px-4 py-3 transition-colors"
                  />
                </div>
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Re-enter your password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••"
                    className="w-full bg-gray-800 text-white rounded-xl border border-gray-600 focus:border-[#6244FF] focus:ring-1 focus:ring-[#6244FF] px-4 py-3 pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
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

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-[#6244FF] hover:text-[#4F37CC] font-medium">
                  Log In
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              2025 ITeachEd, All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Preview */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d3a] via-[#2d3561] to-[#1a1d3a]"></div>
        
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 whitespace-pre-line">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xl text-gray-300 max-w-lg mx-auto">
                {slides[currentSlide].description}
              </p>
            </div>
            
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700/50">
              <img 
                src={slides[currentSlide].image} 
                alt="Dashboard Preview" 
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-[#6244FF] scale-125' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}