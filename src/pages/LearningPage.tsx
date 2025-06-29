import React, { useState } from 'react'
import { 
  Play, 
  Clock, 
  Users, 
  BookOpen, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Video,
  CheckCircle,
  Circle,
  Save,
  MessageCircle,
  X,
  Send,
  Bot,
  ArrowLeft,
  Star,
  Award,
  List,
  Download,
  RotateCcw,
  Undo2
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Layout/Sidebar'

// Module and Lesson interfaces
interface Lesson {
  id: string
  title: string
  type: 'video' | 'reading' | 'interactive' | 'quiz'
  duration: string
  completed: boolean
}

interface Module {
  id: string
  title: string
  progress: number
  totalLessons: number
  completedLessons: number
  lessons: Lesson[]
  expanded: boolean
}

// Sample modules data
const modulesData: Module[] = [
  {
    id: '1',
    title: 'Introduction',
    progress: 100,
    totalLessons: 8,
    completedLessons: 8,
    expanded: true,
    lessons: [
      { id: '1-1', title: 'What is Business Analytics?', type: 'video', duration: '12 min', completed: true },
      { id: '1-2', title: 'Key Concepts Overview', type: 'reading', duration: '8 min', completed: true },
      { id: '1-3', title: 'Industry Applications', type: 'video', duration: '15 min', completed: true },
      { id: '1-4', title: 'Tools and Technologies', type: 'reading', duration: '10 min', completed: true },
      { id: '1-5', title: 'Data Types and Sources', type: 'interactive', duration: '20 min', completed: true },
      { id: '1-6', title: 'Analytics Process', type: 'video', duration: '18 min', completed: true },
      { id: '1-7', title: 'Case Study: Retail Analytics', type: 'reading', duration: '25 min', completed: true },
      { id: '1-8', title: 'Module 1 Quiz', type: 'quiz', duration: '15 min', completed: true }
    ]
  },
  {
    id: '2',
    title: 'In Depth Analytics',
    progress: 65,
    totalLessons: 10,
    completedLessons: 6,
    expanded: false,
    lessons: [
      { id: '2-1', title: 'Statistical Foundations', type: 'video', duration: '22 min', completed: true },
      { id: '2-2', title: 'Descriptive Analytics', type: 'reading', duration: '15 min', completed: true },
      { id: '2-3', title: 'Data Visualization Principles', type: 'interactive', duration: '30 min', completed: true },
      { id: '2-4', title: 'Exploratory Data Analysis', type: 'video', duration: '25 min', completed: true },
      { id: '2-5', title: 'Correlation vs Causation', type: 'reading', duration: '12 min', completed: true },
      { id: '2-6', title: 'Hypothesis Testing', type: 'video', duration: '28 min', completed: true },
      { id: '2-7', title: 'A/B Testing Framework', type: 'interactive', duration: '35 min', completed: false },
      { id: '2-8', title: 'Statistical Significance', type: 'reading', duration: '18 min', completed: false },
      { id: '2-9', title: 'Practical Exercises', type: 'interactive', duration: '45 min', completed: false },
      { id: '2-10', title: 'Module 2 Assessment', type: 'quiz', duration: '20 min', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Advanced Maths',
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    expanded: false,
    lessons: [
      { id: '3-1', title: 'Linear Algebra Basics', type: 'video', duration: '30 min', completed: false },
      { id: '3-2', title: 'Matrix Operations', type: 'reading', duration: '20 min', completed: false },
      { id: '3-3', title: 'Calculus for Analytics', type: 'video', duration: '35 min', completed: false },
      { id: '3-4', title: 'Optimization Techniques', type: 'interactive', duration: '40 min', completed: false },
      { id: '3-5', title: 'Probability Theory', type: 'reading', duration: '25 min', completed: false },
      { id: '3-6', title: 'Distributions', type: 'video', duration: '28 min', completed: false },
      { id: '3-7', title: 'Bayesian Statistics', type: 'reading', duration: '22 min', completed: false },
      { id: '3-8', title: 'Monte Carlo Methods', type: 'interactive', duration: '50 min', completed: false },
      { id: '3-9', title: 'Time Series Analysis', type: 'video', duration: '32 min', completed: false },
      { id: '3-10', title: 'Regression Analysis', type: 'reading', duration: '28 min', completed: false },
      { id: '3-11', title: 'Advanced Modeling', type: 'interactive', duration: '60 min', completed: false },
      { id: '3-12', title: 'Final Assessment', type: 'quiz', duration: '30 min', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Deep Tech in BA',
    progress: 0,
    totalLessons: 9,
    completedLessons: 0,
    expanded: false,
    lessons: [
      { id: '4-1', title: 'Machine Learning Overview', type: 'video', duration: '25 min', completed: false },
      { id: '4-2', title: 'Supervised Learning', type: 'reading', duration: '30 min', completed: false },
      { id: '4-3', title: 'Unsupervised Learning', type: 'video', duration: '28 min', completed: false },
      { id: '4-4', title: 'Neural Networks', type: 'interactive', duration: '45 min', completed: false },
      { id: '4-5', title: 'Deep Learning Applications', type: 'reading', duration: '35 min', completed: false },
      { id: '4-6', title: 'Natural Language Processing', type: 'video', duration: '40 min', completed: false },
      { id: '4-7', title: 'Computer Vision', type: 'interactive', duration: '50 min', completed: false },
      { id: '4-8', title: 'AI Ethics in Business', type: 'reading', duration: '20 min', completed: false },
      { id: '4-9', title: 'Capstone Project', type: 'interactive', duration: '120 min', completed: false }
    ]
  },
  {
    id: '5',
    title: 'Summary & Conclusion',
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    expanded: false,
    lessons: [
      { id: '5-1', title: 'Course Review', type: 'video', duration: '20 min', completed: false },
      { id: '5-2', title: 'Industry Best Practices', type: 'reading', duration: '25 min', completed: false },
      { id: '5-3', title: 'Career Pathways', type: 'video', duration: '18 min', completed: false },
      { id: '5-4', title: 'Certification Preparation', type: 'interactive', duration: '60 min', completed: false },
      { id: '5-5', title: 'Final Exam', type: 'quiz', duration: '90 min', completed: false }
    ]
  }
]

// Content tabs
const contentTabs = [
  { id: 'main', label: 'Main Content', active: true },
  { id: 'mindmap', label: 'Mindmap (Recommended)', active: false },
  { id: 'infographic', label: 'Infographic', active: false },
  { id: 'visualized', label: 'Visualized Framework', active: false },
  { id: 'animated', label: 'Animated Diagram', active: false },
  { id: 'interactive', label: 'Drag and Drop: KPI Matching', active: false }
]

// AI Tutor Component - Matching the main overview page design
interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface AITutorProps {
  className?: string
}

const AITutor: React.FC<AITutorProps> = ({ className = "" }) => {
  const { user } = useAuth()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI tutor. I'm here to help you with your learning journey. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a great question! I'm here to help you learn more effectively. Based on your current progress, I'd recommend focusing on your active learning paths. Would you like me to suggest some specific next steps?",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600/50 bg-gradient-to-r from-[#6244FF]/20 to-[#FFAE2D]/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">AI Tutor</h3>
                <p className="text-gray-400 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-[#6244FF] to-[#FFAE2D]' 
                      : 'bg-gradient-to-r from-[#6244FF] to-[#FFAE2D]'
                  }`}>
                    {msg.sender === 'user' ? (
                      <span className="text-white text-xs font-medium">
                        {userName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    ) : (
                      <Bot className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700/50 text-gray-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-600/50">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-8 h-8 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative hover:scale-110"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}
        
        {!isOpen && (
          <>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] animate-ping opacity-20"></div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Ask your AI Tutor
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-800 rotate-45 transform -translate-y-1"></div>
            </div>
          </>
        )}
      </button>
    </div>
  )
}

export function LearningPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  
  const [modules, setModules] = useState<Module[]>(modulesData)
  const [activeTab, setActiveTab] = useState('main')
  const [notes, setNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState<{[key: string]: string}>({})
  const [lastUpdated] = useState('June 16, 2025 12:34')

  // Navigate to landing page when user signs out
  React.useEffect(() => {
    if (!user) {
      console.log('🔄 Learning Portal: User is null, navigating to landing page')
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSignOut = async () => {
    try {
      console.log('🔓 Learning Portal: Sign out button clicked')
      const { error } = await signOut()
      if (error) {
        console.error('❌ Learning Portal: Sign out failed:', error)
        navigate('/', { replace: true })
      } else {
        console.log('✅ Learning Portal: Sign out successful, waiting for navigation...')
      }
    } catch (error) {
      console.error('❌ Learning Portal: Sign out exception:', error)
      navigate('/', { replace: true })
    }
  }

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, expanded: !module.expanded }
        : module
    ))
  }

  const handleLessonClick = (lessonId: string) => {
    console.log('Opening lesson:', lessonId)
    // Here you would navigate to the specific lesson content
  }

  const saveNotes = () => {
    setSavedNotes(prev => ({
      ...prev,
      [activeTab]: notes
    }))
    console.log('Notes saved for', activeTab)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'reading': return <FileText className="w-4 h-4" />
      case 'interactive': return <Star className="w-4 h-4" />
      case 'quiz': return <Award className="w-4 h-4" />
      default: return <Circle className="w-4 h-4" />
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <div className="w-full h-full bg-gray-800 rounded-lg p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Business Analytics Fundamentals</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
                  <p className="text-gray-300 mb-4">
                    Business Analytics is the practice of iterative, methodical exploration of an organization's data, 
                    with an emphasis on statistical analysis. It is used by companies committed to data-driven 
                    decision-making to gain insights that inform business decisions and can be used to automate 
                    and optimize business processes.
                  </p>
                  
                  <h4 className="text-md font-medium text-white mb-2">Key Learning Points:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Understanding the fundamental concepts and terminology of business analytics</li>
                    <li>Learning how to collect, process, and analyze business data effectively</li>
                    <li>Developing skills to interpret analytical results and derive actionable insights</li>
                    <li>Applying business analytics techniques to real-world business problems</li>
                    <li>Understanding the ethical implications and limitations of data-driven decision making</li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Business Analytics Process</h3>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-300">
                    <li>
                      <strong className="text-white">Problem Definition</strong>
                      <p>Clearly articulate the business problem or opportunity that needs to be addressed</p>
                    </li>
                    <li>
                      <strong className="text-white">Data Collection</strong>
                      <p>Gather relevant data from various sources (internal databases, external APIs, surveys, etc.)</p>
                    </li>
                    <li>
                      <strong className="text-white">Data Cleaning & Preparation</strong>
                      <p>Process the raw data to handle missing values, outliers, and ensure consistency</p>
                    </li>
                    <li>
                      <strong className="text-white">Exploratory Analysis</strong>
                      <p>Perform initial data exploration to understand patterns, relationships, and potential insights</p>
                    </li>
                    <li>
                      <strong className="text-white">Advanced Analysis</strong>
                      <p>Apply statistical methods, predictive modeling, or other analytical techniques</p>
                    </li>
                    <li>
                      <strong className="text-white">Results Interpretation</strong>
                      <p>Translate analytical findings into business insights</p>
                    </li>
                    <li>
                      <strong className="text-white">Communication & Action</strong>
                      <p>Present insights to stakeholders and implement data-driven decisions</p>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Types of Business Analytics</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-md font-medium text-white">1. Descriptive Analytics</h4>
                      <p className="text-gray-300">Focuses on understanding what happened in the past through data summarization and visualization</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-white">2. Diagnostic Analytics</h4>
                      <p className="text-gray-300">Examines why something happened by identifying patterns and relationships in data</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-white">3. Predictive Analytics</h4>
                      <p className="text-gray-300">Uses statistical models and forecasting techniques to understand what could happen in the future</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-white">4. Prescriptive Analytics</h4>
                      <p className="text-gray-300">Suggests actions to take based on predictions and the likely outcome of each decision option</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    Key Takeaways
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Business analytics transforms raw data into actionable business insights</li>
                    <li>The process is iterative and requires both technical and business domain knowledge</li>
                    <li>Different types of analytics serve different business purposes and timeframes</li>
                    <li>Effective communication of insights is as important as the analysis itself</li>
                    <li>Ethical considerations should guide all analytics activities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      case 'mindmap':
        return (
          <div className="w-full h-full bg-white rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="w-full max-w-2xl mx-auto">
                <img 
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Business Analytics Mindmap"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <p className="text-gray-600 mt-4">Interactive Business Analytics Mindmap</p>
            </div>
          </div>
        )
      case 'infographic':
        return (
          <div className="w-full h-full bg-white rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="w-full max-w-2xl mx-auto">
                <img 
                  src="https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Business Analytics Infographic"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <p className="text-gray-600 mt-4">Business Intelligence and Analytics Infographic</p>
            </div>
          </div>
        )
      case 'visualized':
        return (
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Porter's Value Chain Analysis</h3>
              <div className="bg-blue-600 rounded-lg p-6 max-w-lg mx-auto">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-blue-500 p-2 rounded">Firm Infrastructure</div>
                  <div className="bg-blue-500 p-2 rounded">Human Resource Management</div>
                  <div className="bg-blue-500 p-2 rounded">Technology Development</div>
                  <div className="bg-blue-500 p-2 rounded">Procurement</div>
                  <div className="bg-blue-700 p-2 rounded">Inbound Logistics</div>
                  <div className="bg-blue-700 p-2 rounded">Operations</div>
                  <div className="bg-blue-700 p-2 rounded">Outbound Logistics</div>
                  <div className="bg-blue-700 p-2 rounded">Marketing & Sales</div>
                  <div className="bg-blue-700 p-2 rounded">Service</div>
                </div>
                <div className="mt-4 text-xs">Primary Activities</div>
              </div>
            </div>
          </div>
        )
      case 'animated':
        return (
          <div className="w-full h-full bg-white rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="w-full max-w-2xl mx-auto">
                <img 
                  src="https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Data Platform Architecture"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <p className="text-gray-600 mt-4">Animated Data Platform Architecture</p>
            </div>
          </div>
        )
      case 'interactive':
        return (
          <div className="w-full h-full bg-gray-800 rounded-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-white text-xl font-bold mb-2">Matching KPIs to Business Functions</h3>
              <p className="text-gray-400">Drag each KPI to the business function it most relates to</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Draggable KPI Cards */}
              <div>
                <h4 className="text-white font-medium mb-4">Draggable KPI Cards</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['Customer Acquisition Cost', 'Net Promoter Score', 'Monthly Recurring Revenue', 'Retention Rate', 'Gross Margin'].map((kpi) => (
                    <div key={kpi} className="bg-blue-500 text-white p-3 rounded-lg text-sm font-medium cursor-move hover:bg-blue-400 transition-colors">
                      {kpi}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Drop Zones */}
              <div>
                <h4 className="text-white font-medium mb-4">Business Functions</h4>
                <div className="space-y-3">
                  {['Marketing', 'Customer Service', 'Finance', 'Operations'].map((func) => (
                    <div key={func} className="flex items-center space-x-4">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium min-w-[120px]">
                        {func}
                      </div>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 flex-1 text-center text-gray-400 hover:border-gray-500 transition-colors">
                        Drop here
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
                    Reset
                  </button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors">
                    Submit matches
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d3a] via-[#2d3561] to-[#1a1d3a] text-white">
      {/* Sidebar */}
      <Sidebar collapsed={false} onToggle={() => {}} />
      
      {/* Main Content */}
      <div className="ml-[88px] flex h-screen">
        {/* Left Panel - Modules and Lessons */}
        <div className="w-80 bg-gray-800/30 backdrop-blur-sm border-r border-white/10 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <button 
                onClick={() => navigate('/achievements')}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Business Analytics</h1>
                <p className="text-sm text-gray-400">5 Modules | 44 Lessons</p>
              </div>
            </div>
            
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">
              0% Completed
            </div>
          </div>

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {modules.map((module) => (
              <div key={module.id} className="bg-gray-700/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-600/30 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{module.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{module.completedLessons}/{module.totalLessons} lessons</span>
                      <span>•</span>
                      <span>{module.progress}%</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${module.expanded ? 'rotate-180' : ''}`} />
                </button>
                
                {module.expanded && (
                  <div className="border-t border-gray-600/50">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson.id)}
                        className="w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-600/30 transition-colors border-b border-gray-600/30 last:border-b-0"
                      >
                        <div className={`w-5 h-5 flex items-center justify-center ${lesson.completed ? 'text-green-400' : 'text-gray-400'}`}>
                          {lesson.completed ? <CheckCircle className="w-4 h-4" /> : getTypeIcon(lesson.type)}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{lesson.title}</div>
                          <div className="text-gray-400 text-xs">{lesson.duration}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search anything"
                  className="bg-gray-800/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-80"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Continue later and Mark as done buttons */}
              <button className="text-gray-400 hover:text-white transition-colors">
                Continue later
              </button>
              <button className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors">
                Mark this done
              </button>
              
              {/* Notification Bell */}
              <button className="relative p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile Icon */}
              <div className="relative group">
                <button className="flex items-center justify-center p-2 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>
                
                {/* Profile Dropdown */}
                <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-600/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-600/50">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {userName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-sm font-medium truncate">{userName}</div>
                        <div className="text-gray-400 text-xs truncate">{user?.email}</div>
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
          </div>

          {/* Content Tabs */}
          <div className="p-6 border-b border-white/10">
            <div className="flex space-x-1 overflow-x-auto pb-2">
              {contentTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.id === 'main' && <List className="w-4 h-4 inline-block mr-1" />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area with Scrolling */}
          <div className="flex-1 p-6">
            <div className="h-full bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              {renderContent()}
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Last updated {lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Notes */}
        <div className="w-80 bg-gray-800/30 backdrop-blur-sm border-l border-white/10 flex flex-col">
          {/* Notes Header with Last Updated, Export, and Star */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Undo2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Last updated {lastUpdated}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Notes</h3>
          </div>
          
          <div className="flex-1 p-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Start typing notes here"
              className="w-full h-full bg-gray-700/30 border border-gray-600/50 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          
          <div className="p-4 border-t border-white/10">
            <Button 
              onClick={saveNotes}
              icon={Save}
              className="w-full"
              size="sm"
            >
              Save Notes
            </Button>
          </div>
        </div>
      </div>

      {/* AI Tutor - Matching the main overview page design */}
      <AITutor />
    </div>
  )
}