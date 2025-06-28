import React from 'react'
import { Trophy, Award, Star, Target, Users, Clock, Book, Briefcase } from 'lucide-react'
import { Card } from '../components/ui/Card'

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
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'All' || achievement.category === selectedCategory
  )

  const earnedCount = achievements.filter(a => a.earned).length
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="p-6 space-y-6">
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
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${achievement.earned ? 'text-blue-400' : 'text-gray-500'}`}>
                      {achievement.points} XP
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      achievement.earned ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {achievement.category}
                    </span>
                  </div>

                  {achievement.earned && achievement.earnedDate && (
                    <div className="mt-2 text-xs text-gray-500">
                      Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                    </div>
                  )}

                  {!achievement.earned && achievement.progress !== undefined && achievement.total && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-400">{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {achievement.earned && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}