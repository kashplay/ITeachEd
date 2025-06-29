import React, { useState } from 'react'
import { Trophy, Award, Star, Target, Users, Clock, Book, Briefcase, Search, Bell, ChevronLeft, ChevronRight, Calendar, Play } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
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
    progress: 45,
    xp: 180,
    weeklyXP: 60,
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

// Lessons in progress for main overview
const lessonsInProgress = [
  {
    id: '1',
    title: 'Business Analytics',
    progress: 72,
    xp: 350,
    weeklyXP: 145,
    icon: '📊',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '2',
    title: 'Strategic design',
    progress: 72,
    xp: 260,
    weeklyXP: 120,
    icon: '🎨',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: '3',
    title: 'Video editing',
    progress: 72,
    xp: 170,
    weeklyXP: 60,
    icon: '🎬',
    color: 'from-green-500 to-green-600'
  }
]

// My saved goals for main overview
const mySavedGoals = [
  {
    id: '1',
    title: 'Graphic design',
    description: 'Graphic design',
    icon: '📚',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: '2',
    title: 'Graphic design',
    description: 'Graphic design',
    icon: '📚',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: '3',
    title: 'Graphic design',
    description: 'Graphic design',
    icon: '📚',
    color: 'from-orange-500 to-orange-600'
  }
]

// Goals completed for main overview
const goalsCompleted = [
  {
    id: '1',
    title: 'Graphic design',
    description: 'Graphic design',
    certification: 'Cal arts certification',
    badge: 'SKILLED',
    badgeColor: 'from-green-500 to-green-600',
    icon: '📚'
  },
  {
    id: '2',
    title: 'Data Visualization',
    description: 'Graphic design',
    certification: 'UoW Austin certification',
    badge: 'LEGEND',
    badgeColor: 'from-red-500 to-red-600',
    icon: '📚'
  },
  {
    id: '3',
    title: 'Graphic design',
    description: 'Graphic design',
    certification: 'Cal arts certification',
    badge: 'EXPERT',
    badgeColor: 'from-purple-500 to-purple-600',
    icon: '📚'
  }
]

// Goal data structure for other tabs
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
  const [currentMonth, setCurrentMonth] = useState('JAN 2022')

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

  const handleContinueCourse = (courseId: string, courseTitle: string) => {
    console.log(`Continuing course: ${courseTitle} (ID: ${courseId})`)
    // Here you would navigate to the course or open the learning module
    // For now, we'll just log it
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

  // Calendar component for Your Streak
  const renderCalendar = () => {
    const daysInMonth = 31
    const startDay = 6 // Saturday (0 = Sunday, 6 = Saturday)
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    
    // Sample streak data - yellow for active days, gray for inactive
    const streakData = [
      false, false, false, false, false, true, false, // Week 1
      true, true, true, true, true, true, false, // Week 2
      true, true, false, true, false, true, false, // Week 3
      false, false, false, false, false, false, false, // Week 4
      false, false, false // Remaining days
    ]

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button className="p-1 hover:bg-gray-700/50 rounded">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-white font-medium text-sm">{currentMonth}</span>
          <button className="p-1 hover:bg-gray-700/50 rounded">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs">
          {days.map(day => (
            <div key={day} className="text-center text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startDay }, (_, i) => (
            <div key={`empty-${i}`} className="w-6 h-6" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayIndex = i
            const isActive = streakData[dayIndex]
            return (
              <div
                key={i + 1}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isActive 
                    ? 'bg-yellow-500 text-black font-medium' 
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Sticker wall component
  const renderStickerWall = () => {
    const stickers = [
      { id: '1', title: 'The amateur solver', icon: '🏆' },
      { id: '2', title: 'Daily dasher', icon: '⚡' },
      { id: '3', title: 'No mistake maker', icon: '🎯' },
      { id: '4', title: '5 days in a row', icon: '🔥' }
    ]

    return (
      <div className="space-y-3">
        {stickers.map(sticker => (
          <div key={sticker.id} className="flex items-center space-x-3 p-2 bg-gray-700/30 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">{sticker.icon}</span>
            </div>
            <span className="text-white text-sm">{sticker.title}</span>
          </div>
        ))}
      </div>
    )
  }

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
              {/* Main Goals Overview */}
              {activeTab === 'goals' && (
                <div className="space-y-6">
                  {/* Lessons in progress */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Lessons in progress</h2>
                    <div className="space-y-4">
                      {lessonsInProgress.map((lesson) => (
                        <div key={lesson.id} className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${lesson.color} flex items-center justify-center`}>
                              <span className="text-white text-xl">{lesson.icon}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium text-lg">{lesson.title}</h3>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-gray-300">{lesson.xp} XP</span>
                                <span className="text-blue-300">{lesson.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${lesson.progress}%` }}
                                />
                              </div>
                              <div className="text-right text-sm text-gray-400 mt-1">
                                {lesson.weeklyXP} XP this week
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* My saved goals */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">My saved goals</h2>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">View more</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {mySavedGoals.map((goal) => (
                        <div key={goal.id} className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-gray-700/30 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${goal.color} flex items-center justify-center`}>
                              <span className="text-white text-lg">{goal.icon}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{goal.title}</h3>
                              <p className="text-gray-400 text-sm">{goal.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goals completed */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">Goals completed</h2>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">View more</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {goalsCompleted.map((goal) => (
                        <div key={goal.id} className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-gray-700/30 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${goal.badgeColor} flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">{goal.badge}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                              <span className="text-white text-lg">{goal.icon}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{goal.title}</h3>
                              <p className="text-gray-400 text-sm">{goal.certification}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Other tab content */}
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
              {/* Goals Overview - Goal progress chart */}
              {activeTab === 'goals' && (
                <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Goal progress</h3>
                  
                  {/* Radar Chart Placeholder */}
                  <div className="relative w-full h-48 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      {/* Outer pentagon */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <polygon
                          points="50,10 80,35 70,70 30,70 20,35"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                        />
                        <polygon
                          points="50,25 65,40 60,60 40,60 35,40"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                        {/* Data polygon */}
                        <polygon
                          points="50,20 70,38 65,55 45,58 30,42"
                          fill="rgba(59, 130, 246, 0.3)"
                          stroke="rgb(59, 130, 246)"
                          strokeWidth="2"
                        />
                      </svg>
                      
                      {/* Labels */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">A</div>
                      <div className="absolute top-6 -right-2 text-xs text-gray-400">B</div>
                      <div className="absolute bottom-4 right-2 text-xs text-gray-400">C</div>
                      <div className="absolute bottom-4 left-2 text-xs text-gray-400">D</div>
                      <div className="absolute top-6 -left-2 text-xs text-gray-400">E</div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-400 mt-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>A</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>B</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>C</span>
                      </div>
                    </div>
                    <div className="mt-2">Retention</div>
                  </div>
                </div>
              )}

              {/* Your Streak - Calendar */}
              {activeTab === 'goals' && (
                <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Streak!</h3>
                  {renderCalendar()}
                </div>
              )}

              {/* Sticker wall */}
              {activeTab === 'goals' && (
                <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Sticker wall</h3>
                  {renderStickerWall()}
                </div>
              )}

              {/* Continue where you left off - for other tabs */}
              {activeTab !== 'goals' && (
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
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${featuredCourse.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        {featuredCourse.weeklyXP} XP this week
                      </div>
                      <Button 
                        size="sm" 
                        icon={Play}
                        onClick={() => handleContinueCourse(featuredCourse.id, featuredCourse.title)}
                        className="text-xs px-3 py-1"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>

                  {/* Course List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {continueWhereLeftOff.map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-600/30 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-400 text-sm font-medium">{index + 1}</span>
                            <div className="flex-1">
                              <h4 className="text-white text-sm font-medium">{course.title}</h4>
                              <p className="text-gray-400 text-xs">last activity {course.lastActivity}</p>
                            </div>
                          </div>
                          
                          {/* Progress bar for in-progress courses */}
                          {course.status === 'in-progress' && course.progress > 0 && (
                            <div className="mt-2 ml-8">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">{course.progress}%</span>
                                <span className="text-gray-300">{course.xp} XP</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-1">
                                <div 
                                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Continue button for in-progress courses */}
                          {course.status === 'in-progress' && (
                            <Button 
                              size="sm" 
                              icon={Play}
                              onClick={() => handleContinueCourse(course.id, course.title)}
                              className="text-xs px-2 py-1 mr-2"
                            >
                              Continue
                            </Button>
                          )}
                          
                          {/* Status badge */}
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                            {getStatusText(course.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}