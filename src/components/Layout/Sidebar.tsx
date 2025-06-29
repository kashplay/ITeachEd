import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import eLogoLight from '../../assets/images/e-logo-full-light.svg'

// Import only the selected SVG icons
import selectedHomePage from '../../assets/images/selected-home-page.svg'
import selectedCoursePage from '../../assets/images/selected-course-page.svg'
import selectedMyGoals from '../../assets/images/selected-my-goals.svg'
import selectedMyNotes from '../../assets/images/selected-my-notes.svg'
import selectedSetting from '../../assets/images/selected-setting.svg'

// Custom icon component that uses only selected SVGs with CSS effects for inactive state
interface CustomIconProps {
  selectedSrc: string
  isActive: boolean
  alt: string
}

const CustomIcon: React.FC<CustomIconProps> = ({ selectedSrc, isActive, alt }) => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <img 
        src={selectedSrc} 
        alt={alt}
        className={`transition-all duration-300 ease-out ${
          isActive 
            ? 'opacity-100 scale-100 filter-none' 
            : 'opacity-40 scale-90 grayscale hover:opacity-60 hover:scale-95 hover:grayscale-0'
        }`}
        style={{ width: '48px', height: '48px' }}
      />
    </div>
  )
}

// Navigation items - all using selected icons with CSS effects for inactive state
const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    selectedIcon: selectedHomePage
  },
  { 
    name: 'Learning Paths', 
    href: '/learning', 
    selectedIcon: selectedCoursePage
  },
  { 
    name: 'Achievements', 
    href: '/achievements', 
    selectedIcon: selectedMyGoals
  },
  { 
    name: 'My Notes', 
    href: '/notes', 
    selectedIcon: selectedMyNotes
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    selectedIcon: selectedSetting
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
                  ? 'bg-transparent scale-105 shadow-lg shadow-blue-500/25' 
                  : 'hover:scale-110 hover:shadow-md hover:shadow-blue-500/10'
                }
              `}
              title={item.name}
            >
              <CustomIcon
                selectedSrc={item.selectedIcon}
                isActive={isActive}
                alt={item.name}
              />
              
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