import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserSidebar from '../../components/user/UserSidebar';
import axiosInstance from '../../api/axiosConfig';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    profilePictureUrl: ''
  });

  useEffect(() => {
    console.log('UserProfile - useEffect triggered with user:', user);
    if (user?.id) {
      console.log('UserProfile - Fetching profile for user ID:', user.id);
      fetchProfile();
    } else {
      console.log('UserProfile - No user ID available, user object:', user);
      setIsLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('UserProfile - Making API call to:', `/api/users/${user.id}/profile`);
      const response = await axiosInstance.get(`/api/users/${user.id}/profile`);
      
      console.log('UserProfile - API response:', response.data);
      
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || '',
          bio: profileData.bio || '',
          profilePictureUrl: profileData.profilePictureUrl || ''
        });
      }
    } catch (error) {
      console.error('UserProfile - Error fetching profile:', error);
      if (error.response?.status === 404) {
        console.log('UserProfile - Profile not found (404), showing create form');
        setProfile(null);
        setIsEditing(true);
      } else {
        setError('Failed to fetch profile');
        console.error('Error fetching profile:', error);
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      let response;
      
      if (profile) {
        response = await axiosInstance.put(`/api/users/${user.id}/profile`, formData);
      } else {
        response = await axiosInstance.post(`/api/users/${user.id}/profile`, formData);
      }

      if (response.data.success) {
        setProfile(response.data.data);
        setIsEditing(false);
        setSuccess(profile ? 'Profile updated successfully!' : 'Profile created successfully!');
      }
    } catch (error) {
      setError('Failed to save profile');
      console.error('Error saving profile:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        profilePictureUrl: profile.profilePictureUrl || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (isLoading) {
    return (
      <>
        <UserSidebar loggedInUser={user} />
        <div className="sm:ml-72 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserSidebar loggedInUser={user} />
      <div className="sm:ml-72 min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-2xl mx-auto py-8">
          {/* Simple Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information
            </p>
          </div>

          {/* Messages */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {!isEditing && profile ? (
              /* Display Mode */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center">
                    {profile.profilePictureUrl ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        src={profile.profilePictureUrl}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Name
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.fullName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Bio
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.bio || 'No bio provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit/Create Mode */
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile ? 'Edit Profile' : 'Create Profile'}
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Profile Picture URL */}
                  <div>
                    <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      id="profilePictureUrl"
                      name="profilePictureUrl"
                      value={formData.profilePictureUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    {profile && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {profile ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {!profile && !isEditing && (
              /* No Profile State */
              <div className="text-center py-12">
                <div className="h-12 w-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No profile found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Get started by creating your profile.
                </p>
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
