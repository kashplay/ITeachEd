import React from 'react'
import { Trophy, Award, Star, Target, Users, Clock, Book, Briefcase, Search, Bell } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from '../components/Layout/Sidebar'

const achievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first learning module',
    icon: Star,
    category: 'Getting Started',
    earned: true,
    earnedDate: '2024-01-15',
    points: 50,
    rarity: 'common'
  },
  {
    id: 2,
    title: 'Week Warrior',
    description: 'Learn for 7 consecutive days',
    icon: Target,
    category: 'Consistency',
    earned: true,
    earnedDate: '2024-01-22',
    points: 100,
    rarity: 'uncommon'
  },
  {
    id: 3,
    title: 'Skill Master',
    description: 'Complete an entire learning path',
    icon: Trophy,
    category: 'Achievement',
    earned: true,
    earnedDate: '2024-02-10',
    points: 500,
    rarity: 'rare'
  },
  {
    id: 4,
    title: 'Community Builder',
    description: 'Help 10 guild members with questions',
    icon: Users,
    category: 'Social',
    earned: false,
    progress: 7,
    total: 10,
    points: 200,
    rarity: 'uncommon'
  },
  {
    id: 5,
    title: 'Speed Learner',
    description: 'Complete 5 modules in one day',
    icon: Clock,
    category: 'Speed',
    earned: false,
    progress: 3,
    total: 5,
    points: 150,
    rarity: 'uncommon'
  },
  {
    id: 6,
    title: 'Knowledge Seeker',
    description: 'Complete 100 learning modules',
    icon: Book,
    category: 'Progress',
    earned: false,
    progress: 67,
    total: 100,
    points: 1000,
    rarity: 'epic'
  },
  {
    id: 7,
    title: 'Career Changer',
    description: 'Land a job through platform connections',
    icon: Briefcase,
    category: 'Career',
    earned: false,
    points: 2000,
    rarity: 'legendary'
  },
  {
    id: 8,
    title: 'Guild Leader',
    description: 'Reach top 10 in guild rankings',
    icon: Award,
    category: 'Competition',
    earned: false,
    progress: 15,
    total: 10,
    points: 800,
    rarity: 'epic'
  }
]

const categories = ['All', 'Getting Started', 'Consistency', 'Achievement', 'Social', 'Speed', 'Progress', 'Career', 'Competition']

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'from-gray-500 to-gray-600'
    case 'uncommon': return 'from-green-500 to-green-600'
    case 'rare': return 'from-blue-500 to-blue-600'
    case 'epic': return 'from-purple-500 to-purple-600'
    case 'legendary': return 'from-yellow-500 to-orange-500'
    default: return 'from-gray-500 to-gray-600'
  }
}

export function AchievementsPage() {
  const { user } = useAuth()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'All' || achievement.category === selectedCategory
  )

  const earnedCount = achievements.filter(a => a.earned).length
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0)

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
              <button className="flex items-center justify-center p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors">
                <div className="w-5 h-5 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {userName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </button>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3">
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-600/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {userName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{userName}</div>
                      <div className="text-gray-400 text-xs">{user?.email}</div>
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
                      <button className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700/50 rounded-lg text-sm transition-colors">
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
            <h1 className="text-2xl font-bold text-white mb-2">Achievements</h1>
            <p className="text-gray-400">Track your learning milestones and unlock rewards</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{earnedCount}</div>
              <div className="text-sm text-gray-400">Achievements Earned</div>
            </Card>

            <Card className="p-6 text-center">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalPoints}</div>
              <div className="text-sm text-gray-400">Total Points</div>
            </Card>

            <Card className="p-6 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Math.round((earnedCount / achievements.length) * 100)}%</div>
              <div className="text-sm text-gray-400">Completion Rate</div>
            </Card>

            <Card className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Gold</div>
              <div className="text-sm text-gray-400">Current Tier</div>
            </Card>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Achievements Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {filteredAchievements.map((achievement) => {
              const IconComponent = achievement.icon
              
              return (
                <Card 
                  key={achievement.id} 
                  className={`p-6 relative overflow-hidden ${achievement.earned ? 'border-yellow-500/50' : ''}`}
                  hover={!achievement.earned}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${getRarityColor(achievement.rarity)}
                      ${achievement.earned ? '' : 'opacity-50 grayscale'}
                    `}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h3>
                        {achievement.earned && (
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>

                      <p className={`text-sm mb-3 ${achievement.earned ? 'text-gray-300' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>

                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          achievement.earned ? 'bg-green-900/50 text-green-300' : 'bg-gray-700/50 text-gray-400'
                        }`}>
                          {achievement.category}
                        </span>
                        <span className={`font-medium ${achievement.earned ? 'text-yellow-400' : 'text-gray-500'}`}>
                          {achievement.points} XP
                        </span>
                      </div>

                      {achievement.earned ? (
                        <div className="text-xs text-gray-400">
                          Earned on {new Date(achievement.earnedDate!).toLocaleDateString()}
                        </div>
                      ) : achievement.progress && achievement.total ? (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-gray-300">{achievement.progress}/{achievement.total}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          Not started
                        </div>
                      )}
                    </div>
                  </div>

                  {achievement.earned && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}