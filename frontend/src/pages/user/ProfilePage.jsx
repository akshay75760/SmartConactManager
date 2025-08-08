import React, { useState, useEffect } from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosConfig';

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
        updateUser(response.data); // Update auth context
        setIsEditing(false);
        toast.success('Profile updated successfully! 🎉');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
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
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {user && <UserSidebar loggedInUser={user} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">Unable to load user data. Please try logging in again.</p>
            <a 
              href="/login" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-block"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {user && <UserSidebar loggedInUser={user} />}
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">👤 My Profile</h1>
            <p className="text-gray-600 text-lg">Manage your personal information and preferences</p>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Cover Photo Section */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
              <div className="absolute top-4 right-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
                  >
                    <i className="fas fa-edit"></i>
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-500 bg-opacity-80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          <span>Save</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 bg-opacity-80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all duration-200 flex items-center space-x-2"
                    >
                      <i className="fas fa-times"></i>
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-8 pb-8">
              {/* Profile Picture and Basic Info */}
              <div className="flex flex-col items-center -mt-16 mb-8">
                <div className="relative">
                  <img
                    src={formData.profilePic || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'}
                    alt="Profile Photo"
                    className="w-32 h-32 rounded-full shadow-xl object-cover border-4 border-white"
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                
                {/* Name */}
                {isEditing ? (
                  <div className="mt-4 w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <h2 className="mt-4 text-3xl font-bold text-gray-800">{user.name}</h2>
                )}
                
                <p className="text-gray-600 mt-1 flex items-center">
                  <i className="fas fa-envelope mr-2 text-blue-500"></i>
                  {user.email}
                </p>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-phone text-blue-500 text-xl mr-3"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Phone Number</h3>
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg">{user.phoneNumber || 'Not provided'}</p>
                  )}
                </div>

                {/* Profile Picture URL */}
                {isEditing && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <i className="fas fa-image text-blue-500 text-xl mr-3"></i>
                      <h3 className="text-lg font-semibold text-gray-800">Profile Picture URL</h3>
                    </div>
                    <input
                      type="url"
                      name="profilePic"
                      value={formData.profilePic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter image URL"
                    />
                  </div>
                )}

                {/* Verification Status */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-shield-alt text-blue-500 text-xl mr-3"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Verification Status</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email Verified</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.emailVerified ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Phone Verified</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.phoneVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.phoneVerified ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Provider */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-key text-blue-500 text-xl mr-3"></i>
                    <h3 className="text-lg font-semibold text-gray-800">Account Provider</h3>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      user.provider === 'GOOGLE' 
                        ? 'bg-red-100 text-red-800' 
                        : user.provider === 'GITHUB'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.provider === 'GOOGLE' && <i className="fab fa-google mr-2"></i>}
                      {user.provider === 'GITHUB' && <i className="fab fa-github mr-2"></i>}
                      {user.provider === 'SELF' && <i className="fas fa-user mr-2"></i>}
                      {user.provider || 'LOCAL'}
                    </span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mt-6 bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <i className="fas fa-user-circle text-blue-500 text-xl mr-3"></i>
                  <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
                </div>
                {isEditing ? (
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {user.about || 'No description provided yet. Click Edit Profile to add one!'}
                  </p>
                )}
              </div>

              {/* Account Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
                  <i className="fas fa-calendar-alt text-3xl mb-2"></i>
                  <h4 className="text-sm font-medium opacity-90">Member Since</h4>
                  <p className="text-lg font-bold">
                    {user.createdDate ? new Date(user.createdDate).getFullYear() : 'N/A'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl text-center">
                  <i className="fas fa-check-circle text-3xl mb-2"></i>
                  <h4 className="text-sm font-medium opacity-90">Account Status</h4>
                  <p className="text-lg font-bold">
                    {user.enabled ? 'Active' : 'Inactive'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center">
                  <i className="fas fa-star text-3xl mb-2"></i>
                  <h4 className="text-sm font-medium opacity-90">Profile</h4>
                  <p className="text-lg font-bold">
                    {user.emailVerified && user.phoneVerified ? 'Complete' : 'Incomplete'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
