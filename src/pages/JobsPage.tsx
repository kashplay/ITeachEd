import React from 'react'
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Bookmark, TrendingUp } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const jobMatches = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $160k',
    matchPercentage: 95,
    postedDate: '2 days ago',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'CSS'],
    missingSkills: ['GraphQL'],
    description: 'Join our dynamic team to build cutting-edge web applications...',
    logo: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'DataFlow Analytics',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$110k - $140k',
    matchPercentage: 78,
    postedDate: '1 week ago',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    missingSkills: ['Deep Learning', 'TensorFlow'],
    description: 'Analyze complex datasets to drive business insights...',
    logo: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'Design Studio Pro',
    location: 'Remote',
    type: 'Contract',
    salary: '$80k - $100k',
    matchPercentage: 85,
    postedDate: '3 days ago',
    requiredSkills: ['Figma', 'User Research', 'Prototyping'],
    missingSkills: ['After Effects', 'Design Systems'],
    description: 'Create intuitive and beautiful user experiences...',
    logo: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 4,
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$130k - $170k',
    matchPercentage: 72,
    postedDate: '5 days ago',
    requiredSkills: ['Product Strategy', 'Agile', 'Analytics'],
    missingSkills: ['SQL', 'A/B Testing', 'User Research'],
    description: 'Lead product development and strategy for our flagship product...',
    logo: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
]

const skillGaps = [
  { skill: 'GraphQL', demand: 92, yourLevel: 0, courses: 3 },
  { skill: 'Deep Learning', demand: 88, yourLevel: 20, courses: 5 },
  { skill: 'TensorFlow', demand: 85, yourLevel: 10, courses: 4 },
  { skill: 'A/B Testing', demand: 76, yourLevel: 30, courses: 2 },
  { skill: 'User Research', demand: 81, yourLevel: 40, courses: 3 }
]

const getMatchColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-400'
  if (percentage >= 75) return 'text-yellow-400'
  return 'text-red-400'
}

export function JobsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Job Matching</h1>
          <p className="text-gray-400">AI-powered job recommendations based on your skills and learning progress</p>
        </div>
        <Button>
          View All Jobs
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Job Matches */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">Recommended for You</h2>
          
          <div className="space-y-4">
            {jobMatches.map((job) => (
              <Card key={job.id} className="p-6" hover>
                <div className="flex items-start gap-4">
                  <img 
                    src={job.logo} 
                    alt={job.company}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                        <p className="text-gray-400">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getMatchColor(job.matchPercentage)}`}>
                          {job.matchPercentage}% Match
                        </div>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.postedDate}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{job.description}</p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-sm text-gray-400">Required Skills:</span>
                        {job.requiredSkills.map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {job.missingSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-400">Missing Skills:</span>
                          {job.missingSkills.map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" icon={ExternalLink} iconPosition="right">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Skill Gap Analysis
            </h3>
            
            <div className="space-y-4">
              {skillGaps.map((gap) => (
                <div key={gap.skill} className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">{gap.skill}</span>
                    <span className="text-sm text-gray-400">{gap.demand}% demand</span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Your Level</span>
                      <span className="text-gray-400">{gap.yourLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${gap.yourLevel}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{gap.courses} courses available</span>
                    <Button size="sm" variant="outline">
                      Learn
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Application Tracker */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Application Tracker</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-white text-sm">Frontend Developer</div>
                  <div className="text-xs text-gray-400">TechCorp Inc.</div>
                </div>
                <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs rounded-full">
                  In Review
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-white text-sm">UX Designer</div>
                  <div className="text-xs text-gray-400">Design Studio</div>
                </div>
                <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full">
                  Interview
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}