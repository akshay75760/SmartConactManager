import React, { useState, useEffect } from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosConfig';

// Helper to get provider and email verified
function getProviderAndVerified(user) {
  let provider = 'SELF';
  let emailVerified = false;
  if (user?.provider) {
    if (user.provider.toLowerCase().includes('google')) {
      provider = 'Google';
      emailVerified = true;
    } else if (user.provider.toLowerCase().includes('github')) {
      provider = 'GitHub';
      emailVerified = true;
    } else if (user.provider.toLowerCase().includes('oauth')) {
      provider = 'OAuth';
      emailVerified = true;
    } else {
      provider = user.provider;
      emailVerified = true;
    }
  } else if (user?.roleList?.some(role => role.toLowerCase().includes('oauth'))) {
    provider = 'OAuth';
    emailVerified = true;
  }
  return { provider, emailVerified };
}

const ProfilePage = () => {
  const { user, loading, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    phoneNumber: '',
    profilePic: ''
  });

  const { provider, emailVerified } = getProviderAndVerified(user);

  // Function to get profile image with fallback
  const getProfileImage = () => {
    if (formData.profilePic && formData.profilePic.startsWith('http')) {
      return formData.profilePic;
    }
    return 'https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg';
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        about: user.about || '',
        phoneNumber: user.phoneNumber || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.put('/api/user/profile', formData);
      if (response.data) {
        updateUser(response.data);
        setIsEditing(false);
        toast.success('Profile updated successfully! 🎉');
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      about: user.about || '',
      phoneNumber: user.phoneNumber || '',
      profilePic: user.profilePic || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="sm:ml-72 min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="sm:ml-72 min-h-screen flex items-center justify-center pt-20">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Unable to load user data. Please try logging in again.</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserSidebar loggedInUser={user} />
      <div className="sm:ml-72 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 px-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Enhanced Profile Header */}
          <div className="relative mb-10 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 rounded-2xl"></div>
            <div 
              className="absolute inset-0 h-48 opacity-30 rounded-2xl" 
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
              }}
            ></div>
            
            {/* Profile Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-48 pt-8">
              <div className="relative mb-4">
                {/* Profile Image with Ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full blur opacity-75"></div>
                <img
                  src={getProfileImage()}
                  alt="Profile Photo"
                  className="relative h-28 w-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl"
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = 'https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg'; 
                  }}
                />
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-400 border-2 border-white dark:border-gray-700 rounded-full"></div>
              </div>
              
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{user.name}</h1>
                <p className="text-blue-100 text-sm mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  {user.email}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${emailVerified ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'}`}>
                    {emailVerified ? '✓ Verified' : '⚠ Not Verified'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                    {provider}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Profile Information</h2>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-900 dark:text-white font-medium">{user.phoneNumber || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    About Me
                  </label>
                  {isEditing ? (
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 min-h-[120px]">
                      <p className="text-gray-900 dark:text-white font-medium">{user.about || 'No description provided'}</p>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="group">
                    <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      name="profilePic"
                      value={formData.profilePic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">Active</p>
                    </div>
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email Status</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{emailVerified ? 'Verified' : 'Pending'}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${emailVerified ? 'bg-green-100 dark:bg-green-900/20' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
                      <svg className={`w-5 h-5 ${emailVerified ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {emailVerified ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        )}
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-600/10 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Login Provider</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{provider}</p>
                    </div>
                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
