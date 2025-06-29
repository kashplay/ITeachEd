import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import eLogoLight from '../../assets/images/e-logo-full-light.svg'

// Import both selected and unselected SVG icons
// Using the correct dashboard SVG files
import selectedHomePage from '../../assets/images/selected-home-dashboard.svg'
import unselectedHomePage from '../../assets/images/unselected-home-dashboard.svg'
import selectedCoursePage from '../../assets/images/selected-course-page.svg'
import unselectedCoursePage from '../../assets/images/unselected-course-page.svg'
import selectedMyGoals from '../../assets/images/selected-my-goals.svg'
import unselectedMyGoals from '../../assets/images/unselected-my-goals.svg'
import selectedMyNotes from '../../assets/images/selected-my-notes.svg'
import unselectedMyNotes from '../../assets/images/unselected-my-notes.svg'
import selectedSetting from '../../assets/images/selected-setting.svg'
import unselectedSetting from '../../assets/images/unselected-setting.svg'

// Custom icon component for smooth transitions between selected/unselected states
interface CustomIconProps {
  selectedSrc: string
  unselectedSrc: string
  isActive: boolean
  alt: string
  isDashboard?: boolean
}

const CustomIcon: React.FC<CustomIconProps> = ({ selectedSrc, unselectedSrc, isActive, alt, isDashboard = false }) => {
  // Special sizing for dashboard icon to prevent shrinking
  const selectedSize = isDashboard ? '56px' : '48px'
  const unselectedSize = isDashboard ? '32px' : '24px'
  
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Unselected icon */}
      <img 
        src={unselectedSrc} 
        alt={alt}
        className={`absolute transition-all duration-300 ease-out ${
          isActive 
            ? 'opacity-0 scale-95' 
            : 'opacity-100 scale-100'
        }`}
        style={{ 
          width: unselectedSize, 
          height: unselectedSize,
          objectFit: 'contain'
        }}
      />
      {/* Selected icon */}
      <img 
        src={selectedSrc} 
        alt={alt}
        className={`absolute transition-all duration-300 ease-out ${
          isActive 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
        style={{ 
          width: selectedSize, 
          height: selectedSize,
          objectFit: 'contain'
        }}
      />
    </div>
  )
}

// Navigation items with both selected and unselected icons
const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    selectedIcon: selectedHomePage,
    unselectedIcon: unselectedHomePage,
    isDashboard: true
  },
  { 
    name: 'Learning Paths', 
    href: '/learning', 
    selectedIcon: selectedCoursePage,
    unselectedIcon: unselectedCoursePage
  },
  { 
    name: 'My Goals', 
    href: '/achievements', 
    selectedIcon: selectedMyGoals,
    unselectedIcon: unselectedMyGoals
  },
  { 
    name: 'My Notes', 
    href: '/notes', 
    selectedIcon: selectedMyNotes,
    unselectedIcon: unselectedMyNotes
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    selectedIcon: selectedSetting,
    unselectedIcon: unselectedSetting
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
                  : 'text-gray-400 hover:scale-110 hover:shadow-md hover:shadow-blue-500/10'
                }
              `}
              title={item.name}
            >
              <CustomIcon
                selectedSrc={item.selectedIcon}
                unselectedSrc={item.unselectedIcon}
                isActive={isActive}
                alt={item.name}
                isDashboard={item.isDashboard}
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