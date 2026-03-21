import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@stores/authStore'
import type { Teaching, ChatSession } from '@types'

export const Dashboard: React.FC = () => {
  const { user, token } = useAuthStore()
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        setLoading(true)
        setError(null)

        // Fetch recent teachings
        const teachingsRes = await fetch('/api/teachings?limit=6&sort=recent', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (teachingsRes.ok) {
          setTeachings(await teachingsRes.json())
        }

        // Fetch recent chat sessions
        const sessionsRes = await fetch('/api/chat/sessions?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (sessionsRes.ok) {
          setSessions(await sessionsRes.json())
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.name}! 🎯
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your personal AI coach is ready to help you scale
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Chat Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat with Coach Tina</h2>
              <div className="bg-gray-100 rounded-lg p-6 min-h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="text-gray-500 text-center">
                    <p className="mb-2">👋 Hi {user?.name}!</p>
                    <p>Start by asking me anything about building your business,</p>
                    <p>managing finances, or scaling your impact.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Teachings */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Teachings</h2>
              <div className="space-y-4">
                {teachings.length > 0 ? (
                  teachings.map((teaching) => (
                    <div key={teaching.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer">
                      <h3 className="font-bold text-lg text-gray-900">{teaching.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{teaching.core_concept}</p>
                      <div className="mt-3 flex gap-2">
                        {teaching.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No teachings available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Subscription Status */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Subscription</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">{user?.subscription_tier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Renews on</p>
                  <p className="text-lg font-bold text-gray-900">April 21, 2026</p>
                </div>
                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                  Manage Subscription
                </button>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Conversations</h3>
              <div className="space-y-3">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <div key={session.id} className="p-3 bg-gray-50 rounded hover:bg-blue-50 cursor-pointer transition">
                      <p className="font-medium text-gray-900 text-sm">{session.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
