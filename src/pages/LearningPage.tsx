import React from 'react'
import { Play, Clock, Users, BookOpen, Search, Bell } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Layout/Sidebar'

const learningPaths = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    description: 'Master both frontend and backend development with modern technologies',
    category: 'Development',
    difficulty: 'Intermediate',
    duration: '120 hours',
    enrolled: 15420,
    progress: 65,
    skills: ['React', 'Node.js', 'Database Design', 'API Development'],
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 2,
    title: 'Data Science & Analytics',
    description: 'Learn to analyze data and build machine learning models',
    category: 'Data Science',
    difficulty: 'Advanced',
    duration: '90 hours',
    enrolled: 8930,
    progress: 30,
    skills: ['Python', 'Machine Learning', 'Data Visualization', 'Statistics'],
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 3,
    title: 'Digital Marketing Mastery',
    description: 'Comprehensive guide to modern digital marketing strategies',
    category: 'Marketing',
    difficulty: 'Beginner',
    duration: '60 hours',
    enrolled: 12340,
    progress: 0,
    skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
    image: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 4,
    title: 'UX/UI Design Fundamentals',
    description: 'Create beautiful and user-friendly digital experiences',
    category: 'Design',
    difficulty: 'Beginner',
    duration: '80 hours',
    enrolled: 9876,
    progress: 0,
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 5,
    title: 'Cloud Architecture & DevOps',
    description: 'Build scalable applications with cloud technologies',
    category: 'Infrastructure',
    difficulty: 'Advanced',
    duration: '100 hours',
    enrolled: 6543,
    progress: 0,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    image: 'https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 6,
    title: 'Project Management Excellence',
    description: 'Lead projects successfully with modern methodologies',
    category: 'Management',
    difficulty: 'Intermediate',
    duration: '70 hours',
    enrolled: 11200,
    progress: 0,
    skills: ['Agile', 'Scrum', 'Risk Management', 'Leadership'],
    image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
]

const categories = ['All', 'Development', 'Data Science', 'Marketing', 'Design', 'Infrastructure', 'Management']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export function LearningPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('All')

  // Navigate to landing page when user signs out
  React.useEffect(() => {
    if (!user) {
      console.log('🔄 Learning: User is null, navigating to landing page')
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSignOut = async () => {
    try {
      console.log('🔓 Learning: Sign out button clicked')
      const { error } = await signOut()
      if (error) {
        console.error('❌ Learning: Sign out failed:', error)
        navigate('/', { replace: true })
      } else {
        console.log('✅ Learning: Sign out successful, waiting for navigation...')
      }
    } catch (error) {
      console.error('❌ Learning: Sign out exception:', error)
      navigate('/', { replace: true })
    }
  }

  const filteredPaths = learningPaths.filter(path => {
    const categoryMatch = selectedCategory === 'All' || path.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'All' || path.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

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
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700/50 rounded-lg text-sm transition-colors"
                      >
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Learning Paths</h1>
              <p className="text-gray-400">Discover curated learning journeys to advance your career</p>
            </div>
            <Button>
              Browse All Courses
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {filteredPaths.map((path) => (
              <Card key={path.id} className="overflow-hidden group" hover>
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={path.image} 
                    alt={path.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {path.progress > 0 && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {path.progress}% Complete
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button size="sm" className="w-full" icon={path.progress > 0 ? BookOpen : Play}>
                      {path.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">
                      {path.category}
                    </span>
                    <span className={`text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{path.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{path.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {path.enrolled.toLocaleString()} enrolled
                    </div>
                  </div>

                  {path.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{path.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}