import React from 'react'
import { ArrowRight, Search, Bell, Monitor, Target, Hexagon, Film, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from '../components/Layout/Sidebar'

export function DashboardPage() {
  const { user, profile } = useAuth()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Mark Johnson'

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
        <div className="px-6 space-y-8">
          {/* Top Stats Row */}
          <div className="grid grid-cols-4 gap-6">
            {/* Welcome Card */}
            <div className="col-span-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
                <p className="text-gray-300 text-sm mb-6">Nice to see you, {userName}!</p>
                <button className="flex items-center text-white hover:text-blue-300 transition-colors">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Continue your goals</span>
                </button>
              </div>
            </div>

            {/* Guild Level Card */}
            <div className="col-span-1 bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Guild Level</h3>
              
              {/* ROOKIE Badge */}
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center border-4 border-yellow-300/30">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-1">
                      <span className="text-white text-lg">★</span>
                    </div>
                    <span className="text-white text-xs font-bold">ROOKIE</span>
                  </div>
                </div>
              </div>
              
              <div className="text-2xl font-bold mb-1">{profile?.xp || 1245} XP</div>
              <div className="text-green-400 text-sm font-medium">+15% <span className="text-gray-400">since last month</span></div>
            </div>

            {/* Pathways Completed */}
            <div className="col-span-1 bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">Pathways completed</div>
              <div className="text-4xl font-bold">{profile?.pathways_completed || 3}</div>
            </div>

            {/* Guild Rank */}
            <div className="col-span-1 bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-400 text-sm">Guild rank</div>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  50
                </div>
              </div>
              <div className="text-4xl font-bold mb-1">{profile?.guild_rank || 5428}</div>
              <div className="text-green-400 text-sm font-medium">Top 50 percentile!</div>
            </div>
          </div>

          {/* Second Stats Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Total Hours */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">Total Hours of learning</div>
              <div className="text-4xl font-bold">{profile?.total_hours || 1258}</div>
            </div>

            {/* Projects Completed */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">Projects completed</div>
              <div className="flex items-baseline space-x-3">
                <div className="text-4xl font-bold">{profile?.projects_completed || 121}</div>
                <div className="text-green-400 text-sm font-medium">+55%</div>
              </div>
            </div>
          </div>

          {/* Topics Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Begin with exploring these topics</h2>
            
            <div className="grid grid-cols-4 gap-6">
              {/* How to use this platform */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">How to use</h3>
                    <h3 className="font-medium">this platform</h3>
                  </div>
                </div>
              </div>

              {/* Learn skills in your own way */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Learn skills in</h3>
                    <h3 className="font-medium">your own way!</h3>
                  </div>
                </div>
              </div>

              {/* Logo Brand Identity */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Hexagon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Logo Brand</h3>
                    <h3 className="font-medium">Identity</h3>
                  </div>
                </div>
              </div>

              {/* Movie and Animation */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Film className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Movie and</h3>
                    <h3 className="font-medium">Animation</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-semibold">Start doing projects</h2>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Project 1 */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <img 
                    src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Project 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Project 2 */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 relative">
                  <img 
                    src="https://images.pexels.com/photos/3862365/pexels-photo-3862365.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Project 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Project 3 */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 relative">
                  <img 
                    src="https://images.pexels.com/photos/3862634/pexels-photo-3862634.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Project 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}