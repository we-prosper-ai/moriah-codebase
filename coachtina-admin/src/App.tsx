import React, { useState, useEffect } from 'react'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    teachings: 0,
    upcomingEvents: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats from backend
    fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {}) // Demo mode if backend not available
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">CoachTinaMarie Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Active Subscriptions</p>
            <p className="text-3xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}/mo</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Teachings</p>
            <p className="text-3xl font-bold text-blue-600">{stats.teachings}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Content</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Teaching
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Browse Teachings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Community</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Event
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                View Members
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const App: React.FC = () => {
  return <Dashboard />
}
