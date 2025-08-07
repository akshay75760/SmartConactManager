import React, { useEffect } from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Force a re-check of authentication when profile page loads
    // This is particularly useful for OAuth redirects
    console.log('ProfilePage mounted, current user:', user);
  }, [user]);

  if (loading) {
    return (
      <div className="sm:pl-64 pt-20 text-center text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="sm:pl-64 pt-20 text-center text-gray-500 dark:text-gray-400">
        <p>Unable to load user data. Please try logging in again.</p>
        <a href="/login" className="text-blue-600 hover:underline mt-2 inline-block">Go to Login</a>
      </div>
    );
  }

  return (
    <div id="content">
      {user && <UserSidebar loggedInUser={user} />}
      <div className="sm:pl-64 pt-20" style={{ height: '1000px' }}>
        <div className="flex items-center justify-center md:pt-32 flex-col">
          {/* Profile card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex flex-col items-center">
              <img
                src={user.profilePic || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'}
                alt="Profile Photo"
                className="w-44 h-44 rounded-full shadow-lg object-cover mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{user.phoneNumber}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{user.about}</p>
              <div className="w-full flex justify-between">
                <p className="text-sm text-gray-500">
                  Email Verified: <span className="font-medium text-gray-700 dark:text-gray-200">{user.emailVerified ? 'YES' : 'NO'}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Phone Verified: <span className="font-medium text-gray-700 dark:text-gray-200">{user.phoneVerified ? 'YES' : 'NO'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
