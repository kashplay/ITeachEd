import React, { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown, ChevronRight, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, Quote, Code, Type, Palette, RotateCcw, Star, MessageCircle, X, Send, Bot, Search, Bell, Play, Clock, CheckCircle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Layout/Sidebar'

// AI Tutor Component
interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface AITutorProps {
  className?: string
}

function AITutor({ className = "" }: AITutorProps) {
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
      {/* Chat Window - Only show when open */}
      {isOpen && (
        <div className="w-80 h-96 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
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

      {/* Floating Button - Only show when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-gradient-to-r from-[#6244FF] to-[#FFAE2D] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative hover:scale-110"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          
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
        </button>
      )}
    </div>
  )
}

// Rich Text Toolbar Component
interface RichTextToolbarProps {
  onFormat: (command: string, value?: string) => void
}

function RichTextToolbar({ onFormat }: RichTextToolbarProps) {
  const [fontSize, setFontSize] = useState('14')
  const [textColor, setTextColor] = useState('#ffffff')

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#ffc0cb'
  ]

  const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32']

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    onFormat('fontSize', size + 'px')
  }

  const handleColorChange = (color: string) => {
    setTextColor(color)
    onFormat('foreColor', color)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-600/30 bg-gray-800/20">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-600/30">
        <button
          onClick={() => onFormat('bold')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('italic')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('underline')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Underline"
        >
          <Underline className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('strikeThrough')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-600/30">
        <button
          onClick={() => onFormat('justifyLeft')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('justifyCenter')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('justifyRight')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('justifyFull')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Justify"
        >
          <AlignJustify className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-600/30">
        <Type className="w-4 h-4 text-gray-400" />
        <select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="bg-gray-700/50 border border-gray-600/50 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>

      {/* Text Color */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-600/30">
        <Palette className="w-4 h-4 text-gray-400" />
        <div className="flex flex-wrap gap-1">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className="w-4 h-4 rounded border border-gray-600/50 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={`Color: ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Lists and Special */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onFormat('insertUnorderedList')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('insertOrderedList')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Numbered List"
        >
          <span className="text-gray-300 text-sm font-medium">1.</span>
        </button>
        <button
          onClick={() => onFormat('formatBlock', 'blockquote')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Quote"
        >
          <Quote className="w-4 h-4 text-gray-300" />
        </button>
        <button
          onClick={() => onFormat('formatBlock', 'pre')}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Code Block"
        >
          <Code className="w-4 h-4 text-gray-300" />
        </button>
      </div>
    </div>
  )
}

// Lesson interface
interface Lesson {
  id: number
  title: string
  duration: string
  type: 'video' | 'reading' | 'quiz' | 'assignment'
  completed: boolean
}

// Module interface with lessons
interface Module {
  id: number
  title: string
  lessons: Lesson[]
  completed: boolean
  progress: number
}

// Module data with lessons
const modules: Module[] = [
  {
    id: 1,
    title: 'Introduction',
    completed: true,
    progress: 100,
    lessons: [
      { id: 1, title: 'Welcome to Business Analytics', duration: '5 min', type: 'video', completed: true },
      { id: 2, title: 'Course Overview', duration: '3 min', type: 'reading', completed: true },
      { id: 3, title: 'What is Business Analytics?', duration: '8 min', type: 'video', completed: true },
      { id: 4, title: 'Key Concepts', duration: '6 min', type: 'reading', completed: true },
      { id: 5, title: 'Industry Applications', duration: '10 min', type: 'video', completed: true },
      { id: 6, title: 'Tools Overview', duration: '7 min', type: 'reading', completed: true },
      { id: 7, title: 'Getting Started', duration: '4 min', type: 'video', completed: true },
      { id: 8, title: 'Module 1 Quiz', duration: '10 min', type: 'quiz', completed: true }
    ]
  },
  {
    id: 2,
    title: 'In Depth Analytics',
    completed: false,
    progress: 75,
    lessons: [
      { id: 9, title: 'Data Collection Methods', duration: '12 min', type: 'video', completed: true },
      { id: 10, title: 'Data Sources', duration: '8 min', type: 'reading', completed: true },
      { id: 11, title: 'Data Quality Assessment', duration: '15 min', type: 'video', completed: true },
      { id: 12, title: 'Data Cleaning Techniques', duration: '20 min', type: 'video', completed: true },
      { id: 13, title: 'Exploratory Data Analysis', duration: '18 min', type: 'video', completed: true },
      { id: 14, title: 'Statistical Analysis', duration: '25 min', type: 'video', completed: true },
      { id: 15, title: 'Data Visualization', duration: '16 min', type: 'video', completed: true },
      { id: 16, title: 'Interpretation Techniques', duration: '14 min', type: 'reading', completed: true },
      { id: 17, title: 'Case Study Analysis', duration: '30 min', type: 'assignment', completed: true },
      { id: 18, title: 'Advanced Techniques', duration: '22 min', type: 'video', completed: false },
      { id: 19, title: 'Predictive Modeling', duration: '28 min', type: 'video', completed: false },
      { id: 20, title: 'Module 2 Quiz', duration: '15 min', type: 'quiz', completed: false }
    ]
  },
  {
    id: 3,
    title: 'Advanced Maths',
    completed: false,
    progress: 0,
    lessons: [
      { id: 21, title: 'Statistical Foundations', duration: '20 min', type: 'video', completed: false },
      { id: 22, title: 'Probability Theory', duration: '18 min', type: 'reading', completed: false },
      { id: 23, title: 'Hypothesis Testing', duration: '25 min', type: 'video', completed: false },
      { id: 24, title: 'Regression Analysis', duration: '30 min', type: 'video', completed: false },
      { id: 25, title: 'Correlation Analysis', duration: '22 min', type: 'video', completed: false },
      { id: 26, title: 'Time Series Analysis', duration: '35 min', type: 'video', completed: false },
      { id: 27, title: 'Forecasting Methods', duration: '28 min', type: 'video', completed: false },
      { id: 28, title: 'Mathematical Modeling', duration: '40 min', type: 'assignment', completed: false },
      { id: 29, title: 'Optimization Techniques', duration: '32 min', type: 'video', completed: false },
      { id: 30, title: 'Module 3 Quiz', duration: '20 min', type: 'quiz', completed: false }
    ]
  },
  {
    id: 4,
    title: 'Deep Tech in BA',
    completed: false,
    progress: 0,
    lessons: [
      { id: 31, title: 'Machine Learning Basics', duration: '25 min', type: 'video', completed: false },
      { id: 32, title: 'AI in Business Analytics', duration: '20 min', type: 'reading', completed: false },
      { id: 33, title: 'Big Data Technologies', duration: '30 min', type: 'video', completed: false },
      { id: 34, title: 'Cloud Analytics Platforms', duration: '22 min', type: 'video', completed: false },
      { id: 35, title: 'Real-time Analytics', duration: '28 min', type: 'video', completed: false },
      { id: 36, title: 'Advanced Visualization', duration: '24 min', type: 'video', completed: false },
      { id: 37, title: 'Automation in Analytics', duration: '26 min', type: 'video', completed: false },
      { id: 38, title: 'Module 4 Quiz', duration: '15 min', type: 'quiz', completed: false }
    ]
  },
  {
    id: 5,
    title: 'Summary & Conclusion',
    completed: false,
    progress: 0,
    lessons: [
      { id: 39, title: 'Course Recap', duration: '15 min', type: 'video', completed: false },
      { id: 40, title: 'Key Takeaways', duration: '10 min', type: 'reading', completed: false },
      { id: 41, title: 'Industry Best Practices', duration: '20 min', type: 'video', completed: false },
      { id: 42, title: 'Career Opportunities', duration: '12 min', type: 'reading', completed: false },
      { id: 43, title: 'Final Project', duration: '60 min', type: 'assignment', completed: false },
      { id: 44, title: 'Final Assessment', duration: '30 min', type: 'quiz', completed: false }
    ]
  }
]

// Tab content data
const tabContent = {
  'Main Content': {
    title: 'Business Analytics Fundamentals',
    content: `
      <div class="space-y-6">
        <div class="bg-gray-700/30 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Overview</h3>
          <p class="text-gray-300 leading-relaxed mb-4">
            Business Analytics is the practice of iterative, methodical exploration of an organization's data, with 
            an emphasis on statistical analysis. It is used by companies committed to data-driven decision-
            making to gain insights that inform business decisions and can be used to automate and optimize 
            business processes.
          </p>
          
          <h4 class="text-lg font-medium text-white mb-3">Key Learning Points:</h4>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Understanding the fundamental concepts and terminology of business analytics
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Learning how to collect, process, and analyze business data effectively
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Developing skills to interpret analytical results and derive actionable insights
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Applying business analytics techniques to real-world business problems
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Understanding the ethical implications and limitations of data-driven decision making
            </li>
          </ul>
        </div>

        <div class="bg-gray-700/30 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Business Analytics Process</h3>
          
          <div class="space-y-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h4 class="text-lg font-medium text-white mb-2">1. Problem Definition</h4>
              <p class="text-gray-300">Clearly articulate the business problem or opportunity that needs to be addressed</p>
            </div>
            
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="text-lg font-medium text-white mb-2">2. Data Collection</h4>
              <p class="text-gray-300">Gather relevant data from various internal and external sources</p>
            </div>
            
            <div class="border-l-4 border-yellow-500 pl-4">
              <h4 class="text-lg font-medium text-white mb-2">3. Data Preparation</h4>
              <p class="text-gray-300">Clean, transform, and organize data for analysis</p>
            </div>
            
            <div class="border-l-4 border-purple-500 pl-4">
              <h4 class="text-lg font-medium text-white mb-2">4. Analysis & Modeling</h4>
              <p class="text-gray-300">Apply statistical and analytical techniques to extract insights</p>
            </div>
            
            <div class="border-l-4 border-red-500 pl-4">
              <h4 class="text-lg font-medium text-white mb-2">5. Interpretation & Action</h4>
              <p class="text-gray-300">Translate findings into actionable business recommendations</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-700/30 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Types of Business Analytics</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-600/30 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-2">Descriptive Analytics</h4>
              <p class="text-gray-300 text-sm">What happened? Analyzes historical data to understand past performance.</p>
            </div>
            
            <div class="bg-gray-600/30 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-2">Predictive Analytics</h4>
              <p class="text-gray-300 text-sm">What might happen? Uses statistical models to forecast future outcomes.</p>
            </div>
            
            <div class="bg-gray-600/30 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-2">Prescriptive Analytics</h4>
              <p class="text-gray-300 text-sm">What should we do? Recommends actions to optimize outcomes.</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  'Mindmap (Recommended)': {
    title: 'Business Analytics Mindmap',
    content: `
      <div class="flex items-center justify-center h-96 bg-gray-700/30 rounded-xl">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Interactive Mindmap</h3>
          <p class="text-gray-400">Visual representation of Business Analytics concepts and relationships</p>
        </div>
      </div>
    `
  },
  'Infographic': {
    title: 'Business Analytics Infographic',
    content: `
      <div class="flex items-center justify-center h-96 bg-gray-700/30 rounded-xl">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Data Visualization</h3>
          <p class="text-gray-400">Comprehensive infographic showing key statistics and insights</p>
        </div>
      </div>
    `
  },
  'Visualized Framework': {
    title: 'Analytics Framework',
    content: `
      <div class="flex items-center justify-center h-96 bg-gray-700/30 rounded-xl">
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Framework Structure</h3>
          <p class="text-gray-400">Structured approach to implementing business analytics</p>
        </div>
      </div>
    `
  },
  'Animated Diagram': {
    title: 'Process Flow',
    content: `
      <div class="flex items-center justify-center h-96 bg-gray-700/30 rounded-xl">
        <div class="text-center">
          <div class="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Animated Process</h3>
          <p class="text-gray-400">Step-by-step animated guide through the analytics process</p>
        </div>
      </div>
    `
  },
  'Drag and Drop: KPI Matching': {
    title: 'Interactive Exercise',
    content: `
      <div class="flex items-center justify-center h-96 bg-gray-700/30 rounded-xl">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">KPI Matching Exercise</h3>
          <p class="text-gray-400">Interactive drag-and-drop exercise to match KPIs with business functions</p>
        </div>
      </div>
    `
  }
}

export function LearningPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const [activeTab, setActiveTab] = useState('Main Content')
  const [notes, setNotes] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [expandedModules, setExpandedModules] = useState<number[]>([])

  // Auto-save notes functionality
  useEffect(() => {
    const savedNotes = localStorage.getItem('learning-notes-business-analytics')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (notes.trim()) {
        localStorage.setItem('learning-notes-business-analytics', notes)
        setLastUpdated(new Date())
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [notes])

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

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const handleNotesChange = (e: React.FormEvent<HTMLDivElement>) => {
    setNotes(e.currentTarget.innerHTML)
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return date.toLocaleDateString('en-US', options)
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'reading': return <div className="w-4 h-4 flex items-center justify-center text-xs font-bold">A</div>
      case 'quiz': return <div className="w-4 h-4 flex items-center justify-center text-xs font-bold">?</div>
      case 'assignment': return <div className="w-4 h-4 flex items-center justify-center text-xs font-bold">📝</div>
      default: return <Play className="w-4 h-4" />
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-400'
      case 'reading': return 'text-green-400'
      case 'quiz': return 'text-yellow-400'
      case 'assignment': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d3a] via-[#2d3561] to-[#1a1d3a] text-white">
      {/* Sidebar */}
      <Sidebar collapsed={false} onToggle={() => {}} />
      
      {/* Main Content */}
      <div className="ml-[88px] flex h-screen">
        {/* Header - Fixed at top with notification and profile icons */}
        <div className="fixed top-0 right-0 z-40 flex items-center space-x-4 p-6">
          {/* Notification Bell */}
          <button className="relative p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors backdrop-blur-sm">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Profile Icon */}
          <div className="relative group">
            <button className="flex items-center justify-center p-2 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors backdrop-blur-sm">
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

        {/* Left Sidebar - Modules */}
        <div className="w-80 bg-gray-800/30 backdrop-blur-sm border-r border-white/10 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-white">Business Analytics</h1>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-gray-600/50 transition-colors">
                Continue later
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                Mark this done
              </button>
            </div>
            
            <div className="text-sm text-gray-400">
              <span className="text-white font-medium">5 Modules</span> | <span className="text-white font-medium">44 Lessons</span>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium">
                  35% Completed
                </div>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {modules.map((module) => (
              <div key={module.id} className="bg-gray-700/30 rounded-xl overflow-hidden">
                <div 
                  className="p-4 hover:bg-gray-600/30 transition-colors cursor-pointer"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{module.id}. {module.title}</h3>
                    <div className="flex items-center space-x-2">
                      {module.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {module.progress > 0 && (
                    <div className="mb-2">
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-400">
                    {module.lessons.length} lessons
                  </div>
                </div>

                {/* Expanded Lessons */}
                {expandedModules.includes(module.id) && (
                  <div className="border-t border-gray-600/30 bg-gray-800/20">
                    <div className="p-2 space-y-1">
                      {module.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600/30 transition-colors cursor-pointer group"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            lesson.completed 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-600 text-gray-300'
                          } ${getLessonTypeColor(lesson.type)}`}>
                            {lesson.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium truncate ${
                              lesson.completed ? 'text-gray-300' : 'text-white'
                            }`}>
                              {lesson.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration}</span>
                              <span className="capitalize">{lesson.type}</span>
                            </div>
                          </div>

                          {!lesson.completed && (
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-500/20 rounded">
                              <Play className="w-3 h-3 text-blue-400" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="border-b border-white/10 bg-gray-800/20 px-6 py-4">
            <div className="flex space-x-1 overflow-x-auto">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: tabContent[activeTab as keyof typeof tabContent]?.content || '' 
              }}
            />
          </div>
        </div>

        {/* Right Sidebar - Notes */}
        <div className="w-80 bg-gray-800/30 backdrop-blur-sm border-l border-white/10 flex flex-col">
          {/* Notes Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Last updated {formatDate(lastUpdated)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Notes</h3>
          </div>

          {/* Rich Text Toolbar */}
          <RichTextToolbar onFormat={handleFormat} />

          {/* Notes Content */}
          <div className="flex-1 p-4">
            <div
              contentEditable
              onInput={handleNotesChange}
              className="w-full h-full bg-gray-700/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[300px] overflow-y-auto"
              style={{ 
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#ffffff'
              }}
              suppressContentEditableWarning={true}
              data-placeholder="Start typing notes here"
            />
          </div>
        </div>
      </div>

      {/* AI Tutor */}
      <AITutor />
    </div>
  )
}