import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import eLogoLight from '../../assets/images/e-logo-full-light.svg'

// Import only unselected SVG icons
import unselectedHomePage from '../../assets/images/unselected-home-page.svg'
import unselectedCoursePage from '../../assets/images/unselected-course-page.svg'
import unselectedMyGoals from '../../assets/images/unselected-my-goals.svg'
import unselectedMyNotes from '../../assets/images/unselected-my-notes.svg'
import unselectedSetting from '../../assets/images/unselected-setting.svg'

// Simple icon component that only uses unselected icons
interface IconProps {
  src: string
  alt: string
  isActive: boolean
}

const Icon: React.FC<IconProps> = ({ src, alt, isActive }) => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <img 
        src={src} 
        alt={alt}
        className={`transition-all duration-300 ease-out ${
          isActive 
            ? 'opacity-100 scale-110 brightness-125' 
            : 'opacity-70 scale-100 hover:opacity-100 hover:scale-105'
        }`}
        style={{ 
          width: '24px', 
          height: '24px',
          objectFit: 'contain',
          filter: isActive ? 'brightness(1.3) saturate(1.2)' : 'brightness(0.9)'
        }}
      />
    </div>
  )
}

// Navigation items with only unselected icons
const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: unselectedHomePage
  },
  { 
    name: 'Learning Paths', 
    href: '/learning', 
    icon: unselectedCoursePage
  },
  { 
    name: 'My Goals', 
    href: '/achievements', 
    icon: unselectedMyGoals
  },
  { 
    name: 'My Notes', 
    href: '/notes', 
    icon: unselectedMyNotes
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: unselectedSetting
  },
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
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-gradient-to-r from-[#6244FF]/20 to-[#FFAE2D]/20 border-2 border-[#6244FF]/40 shadow-lg shadow-[#6244FF]/25 scale-105' 
                  : 'hover:bg-gray-700/30 hover:scale-110 hover:shadow-md hover:shadow-blue-500/10'
                }
              `}
              title={item.name}
            >
              <Icon
                src={item.icon}
                isActive={isActive}
                alt={item.name}
              />
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#6244FF] rounded-full shadow-lg"></div>
              )}
              
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