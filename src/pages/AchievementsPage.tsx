import React, { useState } from 'react'
import { Trophy, Award, Star, Target, Users, Clock, Book, Briefcase, Search, Bell, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Layout/Sidebar'

// Goal data structure
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

// Sample goals data
const goals: Goal[] = [
  {
    id: '1',
    title: 'Business Analytics',
    description: 'Master business analytics fundamentals',
    category: 'Analytics',
    status: 'in-progress',
    progress: 72,
    xp: 350,
    weeklyXP: 145,
    icon: '📊',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '2',
    title: 'Strategic design',
    description: 'Learn strategic design principles',
    category: 'Design',
    status: 'in-progress',
    progress: 72,
    xp: 260,
    weeklyXP: 120,
    icon: '🎨',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: '3',
    title: 'Video editing',
    description: 'Master video editing techniques',
    category: 'Media',
    status: 'in-progress',
    progress: 72,
    xp: 170,
    weeklyXP: 60,
    icon: '🎬',
    color: 'from-green-500 to-green-600'
  },
  {
    id: '4',
    title: 'Color Grading',
    description: 'Video editing pathway',
    category: 'Media',
    status: 'not-started',
    progress: 0,
    xp: 0,
    weeklyXP: 0,
    icon: '🎨',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: '5',
    title: 'Graphic design',
    description: 'Cal arts certification',
    category: 'Design',
    status: 'completed',
    progress: 100,
    xp: 500,
    weeklyXP: 0,
    icon: '🎨',
    color: 'from-green-500 to-green-600'
  },
  {
    id: '6',
    title: 'Data Visualization',
    description: 'UoW Austin certification',
    category: 'Data',
    status: 'completed',
    progress: 100,
    xp: 450,
    weeklyXP: 0,
    icon: '📈',
    color: 'from-blue-500 to-blue-600'
  }
]

// Sample saved goals
const savedGoals = [
  { id: '1', title: 'Graphic design', description: 'Graphic design', icon: '🎨' },
  { id: '2', title: 'Graphic design', description: 'Graphic design', icon: '🎨' },
  { id: '3', title: 'Graphic design', description: 'Graphic design', icon: '🎨' }
]

// Achievement stickers
const stickers = [
  { id: '1', title: 'The amateur solver', icon: '🏆', color: 'from-yellow-400 to-yellow-500' },
  { id: '2', title: 'Daily dasher', icon: '⚡', color: 'from-blue-400 to-blue-500' },
  { id: '3', title: 'No mistake maker', icon: '✨', color: 'from-purple-400 to-purple-500' },
  { id: '4', title: '5 days in a row', icon: '🔥', color: 'from-red-400 to-red-500' }
]

// Calendar data for streak tracking
const generateCalendarData = () => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const days = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: null, status: 'empty' })
  }
  
  // Add days of the month with random activity status
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate()
    const isPast = day < today.getDate()
    
    let status = 'inactive'
    if (isPast) {
      // Random activity for past days
      const rand = Math.random()
      if (rand > 0.7) status = 'high'
      else if (rand > 0.4) status = 'medium'
      else if (rand > 0.2) status = 'low'
    } else if (isToday) {
      status = 'today'
    }
    
    days.push({ day, status })
  }
  
  return days
}

export function AchievementsPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const [activeTab, setActiveTab] = useState('goals')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const calendarDays = generateCalendarData()
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

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

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-yellow-400'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-yellow-600'
      case 'today': return 'bg-white'
      case 'inactive': return 'bg-gray-600'
      default: return 'bg-transparent'
    }
  }

  const renderGoalCard = (goal: Goal, isLarge = false) => (
    <div key={goal.id} className={`bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-gray-700/30 transition-colors cursor-pointer ${isLarge ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30' : ''}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${goal.color} flex items-center justify-center`}>
          <span className="text-white text-lg">{goal.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{goal.title}</h3>
          <p className="text-gray-400 text-sm">{goal.description}</p>
        </div>
        {goal.status === 'completed' && (
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
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
              {activeTab === 'goals' && (
                <>
                  {/* Lessons in Progress */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Lessons in progress</h2>
                    <div className="space-y-4">
                      {getGoalsByStatus('in-progress').map((goal) => renderGoalCard(goal, true))}
                    </div>
                  </div>

                  {/* My Saved Goals */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">My saved goals</h2>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">View more</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {savedGoals.map((goal) => (
                        <div key={goal.id} className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-gray-700/30 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
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

                  {/* Goals Completed */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">Goals completed</h2>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">View more</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {getGoalsByStatus('completed').map((goal) => renderGoalCard(goal))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'all-saved' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">All Saved Goals</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {savedGoals.map((goal) => renderGoalCard(goal))}
                  </div>
                </div>
              )}

              {activeTab === 'not-started' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Goals not started</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {getGoalsByStatus('not-started').map((goal) => renderGoalCard(goal))}
                  </div>
                </div>
              )}

              {activeTab === 'in-progress' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Goals in progress</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {getGoalsByStatus('in-progress').map((goal) => renderGoalCard(goal))}
                  </div>
                </div>
              )}

              {activeTab === 'complete' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Goals completed</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {getGoalsByStatus('completed').map((goal) => renderGoalCard(goal))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - 4 columns */}
            <div className="col-span-4 space-y-6">
              {/* Goal Progress Chart */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Goal progress</h3>
                <div className="relative w-48 h-48 mx-auto">
                  {/* Radar Chart Placeholder */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Grid lines */}
                    <polygon points="100,20 170,65 170,135 100,180 30,135 30,65" fill="none" stroke="#374151" strokeWidth="1"/>
                    <polygon points="100,40 150,75 150,125 100,160 50,125 50,75" fill="none" stroke="#374151" strokeWidth="1"/>
                    <polygon points="100,60 130,85 130,115 100,140 70,115 70,85" fill="none" stroke="#374151" strokeWidth="1"/>
                    
                    {/* Data polygon */}
                    <polygon points="100,30 160,70 140,130 100,170 40,120 60,80" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2"/>
                    <polygon points="100,40 140,80 120,120 100,150 60,110 80,90" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="2"/>
                    
                    {/* Labels */}
                    <text x="100" y="15" textAnchor="middle" className="fill-gray-400 text-xs">A</text>
                    <text x="175" y="70" textAnchor="middle" className="fill-gray-400 text-xs">B</text>
                    <text x="175" y="140" textAnchor="middle" className="fill-gray-400 text-xs">C</text>
                    <text x="100" y="195" textAnchor="middle" className="fill-gray-400 text-xs">D</text>
                    <text x="25" y="140" textAnchor="middle" className="fill-gray-400 text-xs">Retention</text>
                  </svg>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">A</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">B</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">C</span>
                  </div>
                </div>
              </div>

              {/* Your Streak Calendar */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Your Streak!</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-700/50 rounded">
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-white font-medium">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                    <button className="p-1 hover:bg-gray-700/50 rounded">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div className="space-y-2">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => (
                      <div key={day} className="text-center text-xs text-gray-400 font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          day.day ? getActivityColor(day.status) : ''
                        } ${day.status === 'today' ? 'text-black' : 'text-white'}`}
                      >
                        {day.day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticker Wall */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sticker wall</h3>
                <div className="space-y-3">
                  {stickers.map((sticker) => (
                    <div key={sticker.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${sticker.color} flex items-center justify-center`}>
                        <span className="text-white text-lg">{sticker.icon}</span>
                      </div>
                      <span className="text-gray-300 text-sm">{sticker.title}</span>
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