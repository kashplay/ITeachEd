import React from 'react'
import { Users, Crown, Trophy, TrendingUp, MessageCircle, Plus } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const myGuild = {
  id: 1,
  name: 'Code Warriors',
  description: 'A community of passionate developers helping each other grow',
  memberCount: 234,
  rank: 7,
  totalGuilds: 150,
  weeklyXP: 15420,
  avatar: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=100'
}

const topMembers = [
  { name: 'Alex Chen', xp: 2450, rank: 1, avatar: '👨‍💻' },
  { name: 'Sarah Kim', xp: 2380, rank: 2, avatar: '👩‍💻' },
  { name: 'You', xp: 1245, rank: 15, avatar: '👤', isCurrentUser: true },
  { name: 'Mike Johnson', xp: 2100, rank: 3, avatar: '👨‍💻' },
  { name: 'Lisa Wang', xp: 1980, rank: 4, avatar: '👩‍💻' }
]

const availableGuilds = [
  {
    id: 2,
    name: 'Data Scientists United',
    description: 'Exploring the world of data science and machine learning together',
    memberCount: 189,
    category: 'Data Science',
    weeklyXP: 12300,
    avatar: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 3,
    name: 'Design Masters',
    description: 'Creative minds crafting beautiful user experiences',
    memberCount: 156,
    category: 'Design',
    weeklyXP: 9800,
    avatar: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 4,
    name: 'Marketing Mavens',
    description: 'Digital marketing experts sharing strategies and insights',
    memberCount: 203,
    category: 'Marketing',
    weeklyXP: 11200,
    avatar: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
]

const challenges = [
  {
    id: 1,
    title: 'Weekly Learning Sprint',
    description: 'Complete 10 modules this week',
    timeLeft: '3 days',
    participants: 89,
    reward: '500 XP',
    status: 'active'
  },
  {
    id: 2,
    title: 'Project Showcase',
    description: 'Share your latest project with the guild',
    timeLeft: '1 week',
    participants: 23,
    reward: '1000 XP',
    status: 'upcoming'
  }
]

export function GuildsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">My Guild</h1>
          <p className="text-gray-400">Connect with fellow learners and achieve goals together</p>
        </div>
        <Button icon={Plus}>
          Create Guild
        </Button>
      </div>

      {/* My Guild Overview */}
      <Card className="p-6" gradient>
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={myGuild.avatar} 
              alt={myGuild.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{myGuild.name}</h2>
              <p className="text-gray-300 text-sm mb-2">{myGuild.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {myGuild.memberCount} members
                </span>
                <span className="flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Rank #{myGuild.rank}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:ml-auto grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{myGuild.weeklyXP.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Weekly XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">#{myGuild.rank}</div>
              <div className="text-sm text-gray-400">Guild Rank</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Guild Leaderboard
          </h3>
          
          <div className="space-y-3">
            {topMembers.sort((a, b) => a.rank - b.rank).map((member) => (
              <div 
                key={member.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  member.isCurrentUser ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    member.rank === 1 ? 'bg-yellow-500 text-black' :
                    member.rank === 2 ? 'bg-gray-400 text-black' :
                    member.rank === 3 ? 'bg-orange-500 text-black' :
                    'bg-gray-600 text-white'
                  }`}>
                    {member.rank}
                  </div>
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <div className={`font-medium ${member.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-400">{member.xp} XP</div>
                  </div>
                </div>
                
                {member.rank <= 3 && (
                  <Trophy className={`w-5 h-5 ${
                    member.rank === 1 ? 'text-yellow-500' :
                    member.rank === 2 ? 'text-gray-400' :
                    'text-orange-500'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Active Challenges */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Active Challenges
          </h3>
          
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-medium text-white mb-1">{challenge.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{challenge.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{challenge.participants} participants</span>
                  <span>{challenge.timeLeft} left</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-400">{challenge.reward}</span>
                  <Button size="sm" variant={challenge.status === 'active' ? 'primary' : 'outline'}>
                    {challenge.status === 'active' ? 'Join' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Discover Other Guilds */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Discover Other Guilds</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {availableGuilds.map((guild) => (
            <Card key={guild.id} className="p-6" hover>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={guild.avatar} 
                  alt={guild.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-white">{guild.name}</h3>
                  <span className="text-sm text-blue-400">{guild.category}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">{guild.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {guild.memberCount} members
                </span>
                <span>{guild.weeklyXP.toLocaleString()} XP/week</span>
              </div>

              <Button variant="outline" className="w-full">
                Join Guild
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}