import React, { useState } from 'react'
import { Trophy, Award, Star, Target, Users, Clock, Book, Briefcase, Search, Bell, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Layout/Sidebar'

// Course data structure for "Continue where you left off"
interface Course {
  id: string
  title: string
  description: string
  progress: number
  xp: number
  weeklyXP: number
  status: 'not-started' | 'in-progress' | 'complete' | 'locked'
  lastActivity: string
}

// Sample courses data for the right sidebar
const continueWhereLeftOff: Course[] = [
  {
    id: '1',
    title: 'What is data ?',
    description: 'Data fundamentals',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'not-started',
    lastActivity: '4 weeks ago'
  },
  {
    id: '2',
    title: 'What is data ?',
    description: 'Data fundamentals',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '4 weeks ago'
  },
  {
    id: '3',
    title: 'What is data ?',
    description: 'Data fundamentals',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '4 weeks ago'
  },
  {
    id: '4',
    title: 'What is data ?',
    description: 'Data fundamentals',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '4 weeks ago'
  },
  {
    id: '5',
    title: 'What is data ?',
    description: 'Data fundamentals',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '4 weeks ago'
  },
  {
    id: '6',
    title: 'Data management',
    description: 'Data management fundamentals',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '2 weeks ago'
  },
  {
    id: '7',
    title: 'Cleaning & organising data',
    description: 'Data cleaning techniques',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'in-progress',
    lastActivity: '2 days ago'
  },
  {
    id: '8',
    title: 'Sql part 1',
    description: 'SQL fundamentals',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '1 week ago'
  },
  {
    id: '9',
    title: 'R programming part 1',
    description: 'R programming basics',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '1 week ago'
  },
  {
    id: '10',
    title: 'R programming part 2',
    description: 'Advanced R programming',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    status: 'locked',
    lastActivity: '1 week ago'
  }
]

// Featured course for the top of right sidebar
const featuredCourse = {
  id: 'featured',
  title: 'Business Analytics',
  description: 'Master business analytics fundamentals',
  progress: 72,
  xp: 350,
  weeklyXP: 145,
  status: 'in-progress' as const,
  lastActivity: 'this week'
}

// Goal data structure for main content
interface Goal {
  id: string
  title: string
  description: string
  category: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
  xp: number
  weeklyXP: number
  icon: string
  color: string
}

// Sample goals data for different tabs
const goals: Goal[] = [
  {
    id: '1',
    title: 'Color Grading',
    description: 'Video editing pathway',
    category: 'Media',
    status: 'not-started',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    icon: '📚',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '2',
    title: 'Color Grading',
    description: 'Video editing pathway',
    category: 'Media',
    status: 'not-started',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    icon: '📚',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: '3',
    title: 'Color Grading',
    description: 'Video editing pathway',
    category: 'Media',
    status: 'not-started',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    icon: '📚',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: '4',
    title: 'Color Grading',
    description: 'Video editing pathway',
    category: 'Media',
    status: 'in-progress',
    progress: 45,
    xp: 180,
    weeklyXP: 60,
    icon: '📚',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '5',
    title: 'Color Grading',
    description: 'Video editing pathway',
    category: 'Media',
    status: 'in-progress',
    progress: 65,
    xp: 260,
    weeklyXP: 80,
    icon: '📚',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: '6',
    title: 'Color Grading',
    description: 'Video editing pathway',
    category: 'Media',
    status: 'in-progress',
    progress: 30,
    xp: 120,
    weeklyXP: 40,
    icon: '📚',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: '7',
    title: 'Graphic design',
    description: 'Cal arts certification',
    category: 'Design',
    status: 'completed',
    progress: 100,
    xp: 500,
    weeklyXP: 0,
    icon: '📚',
    color: 'from-green-500 to-green-600'
  },
  {
    id: '8',
    title: 'Data Visualization',
    description: 'UoW Austin certification',
    category: 'Data',
    status: 'completed',
    progress: 100,
    xp: 450,
    weeklyXP: 0,
    icon: '📚',
    color: 'from-green-500 to-green-600'
  },
  {
    id: '9',
    title: 'Graphic design',
    description: 'Cal arts certification',
    category: 'Design',
    status: 'completed',
    progress: 100,
    xp: 400,
    weeklyXP: 0,
    icon: '📚',
    color: 'from-green-500 to-green-600'
  }
]

export function AchievementsPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const [activeTab, setActiveTab] = useState('goals')

  // Navigate to landing page when user signs out
  React.useEffect(() => {
    if (!user) {
      console.log('🔄 Goals: User is null, navigating to landing page')
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSignOut = async () => {
    try {
      console.log('🔓 Goals: Sign out button clicked')
      const { error } = await signOut()
      if (error) {
        console.error('❌ Goals: Sign out failed:', error)
        navigate('/', { replace: true })
      } else {
        console.log('✅ Goals: Sign out successful, waiting for navigation...')
      }
    } catch (error) {
      console.error('❌ Goals: Sign out exception:', error)
      navigate('/', { replace: true })
    }
  }

  const getGoalsByStatus = (status: string) => {
    return goals.filter(goal => goal.status === status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500 text-white'
      case 'in-progress': return 'bg-blue-500 text-white'
      case 'not-started': return 'bg-gray-600 text-gray-300'
      case 'locked': return 'bg-gray-700 text-gray-400'
      default: return 'bg-gray-600 text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete': return 'Complete'
      case 'in-progress': return 'In Progress'
      case 'not-started': return 'Not Started'
      case 'locked': return 'Locked'
      default: return 'Not Started'
    }
  }

  const renderGoalCard = (goal: Goal, isHighlighted = false) => (
    <div key={goal.id} className={`bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-gray-700/30 transition-colors cursor-pointer ${isHighlighted ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30' : ''}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${goal.color} flex items-center justify-center`}>
          <span className="text-white text-lg">{goal.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{goal.title}</h3>
          <p className="text-gray-400 text-sm">{goal.description}</p>
        </div>
        {goal.status === 'completed' && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <div className="text-xs text-gray-400">SKILLED</div>
          </div>
        )}
      </div>
      
      {goal.status === 'in-progress' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{goal.progress}%</span>
            <span className="text-white">{goal.xp} XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-400">
            {goal.weeklyXP} XP this week
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d3a] via-[#2d3561] to-[#1a1d3a] text-white">
      {/* Sidebar */}
      <Sidebar collapsed={false} onToggle={() => {}} />
      
      {/* Main Content */}
      <div className="ml-[88px]">
        {/* Header */}
        <header className="flex items-center justify-between p-6 pb-8">
          <div className="flex items-center space-x-4">
            {/* Empty space for alignment */}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search.."
                className="bg-gray-800/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-80"
              />
            </div>
            
            {/* Notification Bell */}
            <button className="relative p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Profile Icon */}
            <div className="relative group">
              <button className="flex items-center justify-center p-2 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </button>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-600/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-600/50">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {userName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-sm font-medium truncate">{userName}</div>
                      <div className="text-gray-400 text-xs truncate">{user?.email}</div>
                    </div>
                  </div>
                  <div className="pt-3 space-y-1">
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
                      Account Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
                      Help & Support
                    </button>
                    <div className="border-t border-gray-600/50 pt-1 mt-2">
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700/50 rounded-lg text-sm transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">My goals</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-800/30 rounded-xl p-1 w-fit">
            {[
              { id: 'goals', label: 'Goals' },
              { id: 'all-saved', label: 'All Saved Goals' },
              { id: 'not-started', label: 'Not Started' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'complete', label: 'Complete' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Content - 8 columns */}
            <div className="col-span-8 space-y-6">
              {/* Content based on active tab */}
              {activeTab === 'not-started' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Goals not started</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {getGoalsByStatus('not-started').map((goal, index) => renderGoalCard(goal, index === 0))}
                  </div>
                </div>
              )}

              {activeTab === 'in-progress' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Goals in progress</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {getGoalsByStatus('in-progress').map((goal, index) => renderGoalCard(goal, index === 0))}
                  </div>
                </div>
              )}

              {activeTab === 'complete' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Goals completed</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {getGoalsByStatus('completed').map((goal) => renderGoalCard(goal))}
                  </div>
                </div>
              )}

              {/* Default Goals tab content */}
              {activeTab === 'goals' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">All Goals</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {goals.slice(0, 6).map((goal, index) => renderGoalCard(goal, index === 0))}
                  </div>
                </div>
              )}

              {activeTab === 'all-saved' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">All Saved Goals</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {goals.map((goal, index) => renderGoalCard(goal, index === 0))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - 4 columns */}
            <div className="col-span-4 space-y-6">
              {/* Continue where you left off */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Continue where you left off</h3>
                
                {/* Featured Course */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{featuredCourse.title}</h4>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-300">{featuredCourse.xp} XP</span>
                        <span className="text-blue-300">{featuredCourse.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${featuredCourse.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {featuredCourse.weeklyXP} XP this week
                  </div>
                </div>

                {/* Course List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {continueWhereLeftOff.map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-600/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 text-sm font-medium">{index + 1}</span>
                          <div>
                            <h4 className="text-white text-sm font-medium">{course.title}</h4>
                            <p className="text-gray-400 text-xs">last activity {course.lastActivity}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {getStatusText(course.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}