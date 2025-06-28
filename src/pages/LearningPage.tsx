import React from 'react'
import { Play, Clock, Users, BookOpen } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

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
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('All')

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
    <div className="p-6 space-y-6">
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
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {path.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}