import React, { useState } from 'react'
import { User, Bell, Shield, Palette, Globe, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function SettingsPage() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: ''
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Globe }
  ]

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // In a real app, you'd update the user metadata and profile
      console.log('Saving profile:', profileData)
      // await updateProfile(profileData)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, you'd handle account deletion
      console.log('Deleting account...')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  disabled
                  placeholder="your.email@example.com"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <Input
                  label="Location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
                
                <Input
                  label="Website"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <Button onClick={handleSaveProfile} loading={loading}>
                Save Changes
              </Button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
            
            <div className="space-y-4">
              {[
                { id: 'email_digest', label: 'Weekly learning digest', description: 'Get a summary of your weekly progress' },
                { id: 'achievement_notifications', label: 'Achievement notifications', description: 'Get notified when you earn new achievements' },
                { id: 'guild_activity', label: 'Guild activity', description: 'Updates from your guild members and challenges' },
                { id: 'job_recommendations', label: 'Job recommendations', description: 'New job matches based on your skills' },
                { id: 'course_updates', label: 'Course updates', description: 'New content in your enrolled courses' }
              ].map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{notification.label}</div>
                    <div className="text-sm text-gray-400">{notification.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium text-white mb-2">Profile Visibility</h4>
                <p className="text-sm text-gray-400 mb-3">Control who can see your profile and learning progress</p>
                <select className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option>Everyone</option>
                  <option>Guild members only</option>
                  <option>Private</option>
                </select>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium text-white mb-2">Data Export</h4>
                <p className="text-sm text-gray-400 mb-3">Download a copy of your learning data</p>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium text-white mb-2">Change Password</h4>
                <p className="text-sm text-gray-400 mb-3">Update your account password</p>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </Card>

              <Card className="p-4 border-red-500/50">
                <h4 className="font-medium text-red-400 mb-2">Delete Account</h4>
                <p className="text-sm text-gray-400 mb-3">Permanently delete your account and all data</p>
                <Button variant="outline" size="sm" onClick={handleDeleteAccount} icon={Trash2}>
                  Delete Account
                </Button>
              </Card>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
            
            <Card className="p-4">
              <h4 className="font-medium text-white mb-2">Theme</h4>
              <p className="text-sm text-gray-400 mb-3">Choose your preferred color scheme</p>
              <div className="grid grid-cols-3 gap-3">
                {['Dark', 'Light', 'Auto'].map((theme) => (
                  <button
                    key={theme}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      theme === 'Dark' 
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300' 
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium text-white mb-2">Font Size</h4>
              <p className="text-sm text-gray-400 mb-3">Adjust the interface font size</p>
              <select className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                <option>Small</option>
                <option>Medium (Default)</option>
                <option>Large</option>
              </select>
            </Card>
          </div>
        )

      case 'language':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Language & Region</h3>
            
            <Card className="p-4">
              <h4 className="font-medium text-white mb-2">Language</h4>
              <p className="text-sm text-gray-400 mb-3">Choose your preferred language</p>
              <select className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium text-white mb-2">Time Zone</h4>
              <p className="text-sm text-gray-400 mb-3">Used for scheduling and notifications</p>
              <select className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full">
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium text-white mb-2">Date Format</h4>
              <p className="text-sm text-gray-400 mb-3">How dates are displayed</p>
              <select className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full">
                <option>MM/DD/YYYY (US)</option>
                <option>DD/MM/YYYY (EU)</option>
                <option>YYYY-MM-DD (ISO)</option>
              </select>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {renderTabContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}