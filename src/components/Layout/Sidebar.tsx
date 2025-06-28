import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Users, 
  Briefcase, 
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import eLogoLight from '../../assets/images/e-logo-full-light.svg'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learning Paths', href: '/learning', icon: BookOpen },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Guilds', href: '/guilds', icon: Users },
  { name: 'Job Matching', href: '/jobs', icon: Briefcase },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed: _collapsed, onToggle: _onToggle }: SidebarProps) {
  const location = useLocation()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="w-[88px] h-screen bg-[#1a1d3a] border-r border-gray-700/30 fixed left-0 top-0 z-40 flex flex-col items-center py-8">
      {/* Logo */}
      <div className="mb-6">
        <Link to="/dashboard" className="block hover:opacity-80 transition-opacity duration-200">
          <img 
            src={eLogoLight} 
            alt="E Logo" 
            className="w-12 h-8 object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-gray-600/50 mb-6" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-[#6366f1] shadow-lg shadow-blue-500/25 text-white' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white hover:scale-110'
                }
              `}
              title={item.name}
            >
              <item.icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                {item.name}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleSignOut}
        className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group relative"
        title="Sign Out"
      >
        <LogOut className="w-6 h-6" />
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
          Sign Out
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </button>
    </div>
  )
}