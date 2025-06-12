import React, { useState } from 'react';
import { Users, UserCheck, MessageSquare, AlertTriangle, Shield, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Moderation', icon: MessageSquare },
    { id: 'verification', label: 'Verification Requests', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
  ];

  // Mock data
  const pendingDoctors = [
    {
      id: '1',
      name: 'Dr. Emily Rodriguez',
      email: 'emily@email.com',
      specialization: 'Pediatrics',
      license: 'MD-2023-001',
      submittedAt: '2024-01-15',
      documents: ['License', 'Diploma', 'ID']
    },
    {
      id: '2',
      name: 'Dr. David Kim',
      email: 'david@email.com',
      specialization: 'Cardiology',
      license: 'MD-2023-002',
      submittedAt: '2024-01-14',
      documents: ['License', 'Diploma']
    }
  ];

  const flaggedContent = [
    {
      id: '1',
      type: 'question',
      title: 'Is this medication safe?',
      author: 'Anonymous',
      reason: 'Inappropriate medical advice request',
      reportedAt: '2024-01-15',
      status: 'pending'
    },
    {
      id: '2',
      type: 'answer',
      title: 'Diabetes treatment response',
      author: 'Dr. John Smith',
      reason: 'Unverified medical claims',
      reportedAt: '2024-01-14',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Platform administration and moderation</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{pendingDoctors.length}</h3>
                <p className="text-gray-600">Pending Verifications</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{flaggedContent.length}</h3>
                <p className="text-gray-600">Flagged Content</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">23</h3>
                <p className="text-gray-600">Testing Centers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'verification' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Doctor Verification Requests</h2>
                <div className="space-y-6">
                  {pendingDoctors.map((doctor) => (
                    <div key={doctor.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                          <p className="text-gray-600">{doctor.specialization}</p>
                          <p className="text-sm text-gray-500">{doctor.email}</p>
                          <p className="text-sm text-gray-500">License: {doctor.license}</p>
                        </div>
                        <Badge variant="warning">Pending Review</Badge>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Documents:</h4>
                        <div className="flex gap-2">
                          {doctor.documents.map((doc) => (
                            <Badge key={doc} variant="neutral">{doc}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        Submitted on {new Date(doctor.submittedAt).toLocaleDateString()}
                      </div>

                      <div className="flex space-x-3">
                        <Button variant="secondary" size="sm">Approve</Button>
                        <Button variant="outline" size="sm">Reject</Button>
                        <Button variant="ghost" size="sm">View Documents</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Flagged Content</h2>
                <div className="space-y-4">
                  {flaggedContent.map((content) => (
                    <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={content.type === 'question' ? 'primary' : 'neutral'}>
                              {content.type}
                            </Badge>
                            <Badge variant="warning">Flagged</Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">{content.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">by {content.author}</p>
                          <p className="text-sm text-red-600">Reason: {content.reason}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Reported on {new Date(content.reportedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <Button variant="outline" size="sm">Review Content</Button>
                        <Button variant="ghost" size="sm">Approve</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">User management interface would be implemented here.</p>
                  <p className="text-sm text-gray-400 mt-2">Features: User search, ban/unban, role management, activity monitoring</p>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">User Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Active Users</span>
                        <span className="font-medium">423</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Questions Posted Today</span>
                        <span className="font-medium">28</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Answers Provided</span>
                        <span className="font-medium">41</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Content Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Questions</span>
                        <span className="font-medium">2,147</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Answers</span>
                        <span className="font-medium">1,823</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}