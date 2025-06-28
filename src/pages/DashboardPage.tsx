import React from 'react'
import { ArrowRight, TrendingUp, Users, Clock, Trophy, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function DashboardPage() {
  const { user, profile } = useAuth()

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 relative overflow-hidden" gradient>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-gray-300 mb-4">Nice to see you, {userName}!</p>
            <Button icon={ArrowRight} iconPosition="right">
              Continue your goals
            </Button>
          </div>
        </Card>

        <Card className="p-6 text-center" gradient>
          <h3 className="text-lg font-semibold text-white mb-2">Guild Level</h3>
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Star className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-400 mb-1">{profile?.guild_level || 'ROOKIE'}</div>
            <div className="text-2xl font-bold text-white mb-2">{profile?.xp || 1245} XP</div>
            <div className="text-sm text-green-400">+15% since last month</div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Pathways completed</h3>
          <div className="text-3xl font-bold text-white">{profile?.pathways_completed || 3}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Guild rank</h3>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              50
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{profile?.guild_rank || 5428}</div>
          <div className="text-sm text-green-400">Top 50 percentile!</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Hours of learning</h3>
          <div className="text-3xl font-bold text-white">{profile?.total_hours || 1258}</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Projects completed</h3>
          <div className="text-3xl font-bold text-white">{profile?.projects_completed || 121}</div>
          <div className="text-sm text-green-400">+55%</div>
        </Card>
      </div>

      {/* Learning Topics */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Begin with exploring these topics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'How to use this platform', icon: '💻', color: 'from-blue-500 to-blue-600' },
            { title: 'Learn skills in your own way!', icon: '🎯', color: 'from-purple-500 to-purple-600' },
            { title: 'Logo Brand Identity', icon: '🎨', color: 'from-indigo-500 to-indigo-600' },
            { title: 'Movie and Animation', icon: '🎬', color: 'from-pink-500 to-pink-600' }
          ].map((topic, index) => (
            <Card key={index} className="p-4 hover:scale-105 transition-transform cursor-pointer" hover>
              <div className={`w-12 h-12 bg-gradient-to-r ${topic.color} rounded-lg flex items-center justify-center mb-3`}>
                <span className="text-2xl">{topic.icon}</span>
              </div>
              <h3 className="text-white font-medium">{topic.title}</h3>
            </Card>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Start doing projects</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=800'
          ].map((image, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer" hover>
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={image} 
                  alt={`Project ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Button size="sm" className="w-full">
                    Start Project
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}