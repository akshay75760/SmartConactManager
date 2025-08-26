import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axiosConfig';

const AdminProfileManagement = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    bio: '',
    profilePictureUrl: ''
  });

  useEffect(() => {
    if (user?.roleList?.includes('ROLE_ADMIN')) {
      fetchAllProfiles();
    }
  }, [user]);

  const fetchAllProfiles = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await axiosInstance.get('/api/admin/profiles');
      
      if (response.data.success) {
        setProfiles(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to fetch profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.userId.trim() || !formData.fullName.trim()) {
      setError('User ID and Full Name are required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const response = await axiosInstance.post('/api/admin/profiles', formData);

      if (response.data.success) {
        setSuccess('Profile created successfully!');
        setShowCreateModal(false);
        setFormData({ userId: '', fullName: '', bio: '', profilePictureUrl: '' });
        fetchAllProfiles(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setError(error.response?.data?.message || 'Failed to create profile');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      setError('Full Name is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const response = await axiosInstance.put(`/api/admin/profiles/${editingProfile.userId}`, {
        userId: editingProfile.userId,
        fullName: formData.fullName,
        bio: formData.bio,
        profilePictureUrl: formData.profilePictureUrl
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setEditingProfile(null);
        setFormData({ userId: '', fullName: '', bio: '', profilePictureUrl: '' });
        fetchAllProfiles(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteProfile = async (userId, fullName) => {
    if (!window.confirm(`Are you sure you want to delete the profile for ${fullName}?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const response = await axiosInstance.delete(`/api/admin/profiles/${userId}`);

      if (response.data.success) {
        setSuccess('Profile deleted successfully!');
        fetchAllProfiles(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError(error.response?.data?.message || 'Failed to delete profile');
    }
  };

  const handleEditClick = (profile) => {
    setEditingProfile(profile);
    setFormData({
      userId: profile.userId,
      fullName: profile.fullName,
      bio: profile.bio || '',
      profilePictureUrl: profile.profilePictureUrl || ''
    });
    setShowCreateModal(false);
  };

  const handleCancelEdit = () => {
    setEditingProfile(null);
    setFormData({ userId: '', fullName: '', bio: '', profilePictureUrl: '' });
  };

  const resetForm = () => {
    setFormData({ userId: '', fullName: '', bio: '', profilePictureUrl: '' });
    setShowCreateModal(false);
    setEditingProfile(null);
    setError('');
    setSuccess('');
  };

  if (!user?.roleList?.includes('ROLE_ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20 mx-4 mt-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20 mx-4 mt-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-20 mx-4 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Profile Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage user profiles through the microservice
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Create New Profile
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingProfile) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingProfile ? 'Edit Profile' : 'Create New Profile'}
              </h2>

              <form onSubmit={editingProfile ? handleUpdateProfile : handleCreateProfile}>
                {/* User ID (only for create) */}
                {!editingProfile && (
                  <div className="mb-4">
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      User ID *
                    </label>
                    <input
                      type="text"
                      id="userId"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter user ID"
                    />
                  </div>
                )}

                {/* Full Name */}
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter bio..."
                  />
                </div>

                {/* Profile Picture URL */}
                <div className="mb-6">
                  <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    id="profilePictureUrl"
                    name="profilePictureUrl"
                    value={formData.profilePictureUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={editingProfile ? handleCancelEdit : resetForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                  >
                    {editingProfile ? 'Update Profile' : 'Create Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Profiles Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Profiles ({profiles.length})
            </h2>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No profiles found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating the first user profile.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Bio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {profile.profilePictureUrl ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={profile.profilePictureUrl}
                                alt={profile.fullName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {profile.fullName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {profile.userId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {profile.bio || 'No bio provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(profile)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.userId, profile.fullName)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileManagement;
