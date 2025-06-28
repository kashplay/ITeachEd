import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Users, 
  Briefcase, 
  Settings,
  ChevronLeft
} from 'lucide-react'

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

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <div className={`bg-[#1a1d3a] border-r border-gray-700/50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-20'} fixed left-0 top-0 h-full z-40`}>
      <div className="flex flex-col h-full py-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">e</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-gray-600 mx-auto mb-8" />

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <ul className="space-y-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-[#6366f1] shadow-lg shadow-blue-500/25' 
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      }
                    `}
                    title={item.name}
                  >
                    <item.icon className="w-6 h-6" />
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}