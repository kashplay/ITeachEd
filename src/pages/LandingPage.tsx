import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Play, Users, BookOpen, Trophy, Briefcase, Menu, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import iteachedLogo from '../assets/images/iteached-logo.svg'

export function LandingPage() {
  const { user, profile, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check if user came from pre-evaluation via back button
  const fromPreEvaluation = location.state?.fromPreEvaluation

  // HARD CONDITION: Redirect authenticated users based on evaluation status
  useEffect(() => {
    if (!loading && user) {
      console.log('🔄 LandingPage: User is authenticated, checking evaluation status')
      
      // If user came from pre-evaluation via back button, don't redirect them back
      if (fromPreEvaluation) {
        console.log('🔄 LandingPage: User came from pre-evaluation via back button, staying on landing page')
        return
      }
      
      // HARD CONDITION: If user has completed evaluation, always go to dashboard
      if (profile && profile.evaluation_completed) {
        console.log('🔄 LandingPage: User has completed evaluation, redirecting to dashboard')
        navigate('/dashboard', { replace: true })
      } else {
        console.log('🔄 LandingPage: User has not completed evaluation, redirecting to pre-evaluation')
        navigate('/pre-evaluation', { replace: true })
      }
    }
  }, [user, profile, loading, navigate, fromPreEvaluation])

  const handleSignOut = async () => {
    try {
      console.log('🔓 LandingPage: Sign out button clicked')
      const { error } = await signOut()
      if (error) {
        console.error('❌ LandingPage: Sign out failed:', error)
      } else {
        console.log('✅ LandingPage: Sign out successful')
      }
    } catch (error) {
      console.error('❌ LandingPage: Sign out exception:', error)
    }
  }

  // Show loading state only briefly while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render landing page content if user is authenticated and not from pre-evaluation (prevents flash)
  if (user && !fromPreEvaluation) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header - Only show if user is not authenticated or came from pre-evaluation */}
      {(!user || fromPreEvaluation) && (
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center">
                <img 
                  src={iteachedLogo} 
                  alt="ITeachEd" 
                  className="h-8"
                />
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                {user && fromPreEvaluation ? (
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                )}
              </div>

              <button
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-900 border-t border-gray-800">
              <div className="px-4 py-6 space-y-4">
                {user && fromPreEvaluation ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth/login" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6244FF]/20 via-[#6244FF]/10 to-[#FFAE2D]/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI-Powered
            <br />
            <span className="bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] bg-clip-text text-transparent">
              Personalized Learning
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your career with AI-curated learning paths, gamified progress 
            tracking, and a supportive community of learners.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user && fromPreEvaluation ? (
              <>
                <Link to="/pre-evaluation">
                  <Button size="lg" icon={ArrowRight} iconPosition="right" className="group">
                    Continue Evaluation
                  </Button>
                </Link>
                <Button variant="outline" size="lg" icon={Play}>
                  Watch Demo
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/signup">
                  <Button size="lg" icon={ArrowRight} iconPosition="right" className="group">
                    Start Learning Today
                  </Button>
                </Link>
                <Button variant="outline" size="lg" icon={Play}>
                  Watch Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-400">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">94%</div>
              <div className="text-gray-400">Course Completion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">15K+</div>
              <div className="text-gray-400">Career Transitions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">$25K</div>
              <div className="text-gray-400">Avg. Salary Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose ITeachEd?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of education with our cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Curated Paths</h3>
              <p className="text-gray-400">Personalized learning journeys based on your goals and skill level</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gamification</h3>
              <p className="text-gray-400">Earn XP, unlock achievements, and compete with friends</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-400">Join guilds, participate in challenges, and learn together</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Job Matching</h3>
              <p className="text-gray-400">AI-powered job recommendations based on your progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#6244FF] via-[#6244FF] to-[#4F37CC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of learners who have accelerated their careers with ITeachEd
          </p>
          {user && fromPreEvaluation ? (
            <Link to="/pre-evaluation">
              <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                Continue Evaluation
              </Button>
            </Link>
          ) : (
            <Link to="/auth/signup">
              <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={iteachedLogo} 
                alt="ITeachEd" 
                className="h-8"
              />
            </div>
            <p className="text-gray-400">
              © 2025 ITeachEd, All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}