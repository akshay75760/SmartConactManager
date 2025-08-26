import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { initFlowbite } from 'flowbite';
import { useAuth } from '../../contexts/AuthContext';

const UserSidebar = ({ loggedInUser }) => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Initialize Flowbite components
    initFlowbite();
    
    // Manually handle sidebar toggle for React state
    const handleSidebarToggle = () => {
      setIsSidebarOpen(prev => !prev);
    };

    const sidebarToggle = document.querySelector('[data-drawer-toggle="logo-sidebar"]');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', handleSidebarToggle);
      
      // Cleanup event listener on unmount
      return () => {
        sidebarToggle.removeEventListener('click', handleSidebarToggle);
      };
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside
        id="logo-sidebar"
        className={`fixed top-20 left-4 z-30 w-72 h-[calc(100vh-6rem)] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/user/profile" className="flex flex-col items-center group">
              <div className="relative">
                <img
                  onError={(e) => e.target.src = 'https://flowbite.com/docs/images/logo.svg'}
                  src={loggedInUser?.profilePic || 'https://flowbite.com/docs/images/logo.svg'}
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md transition-transform duration-200 group-hover:scale-105"
                  alt="Profile"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-gray-900 dark:text-white font-semibold text-base">{loggedInUser?.name || 'User Name'}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome to SCM</p>
              </div>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {/* Personal Section */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Personal</p>
                
                <Link
                  to="/user/notes"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/notes') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 002 0V3a2 2 0 012 2v6.5a1.5 1.5 0 01-.44 1.06l-3 3a1.5 1.5 0 01-2.12 0l-3-3A1.5 1.5 0 014 11.5V5zm3 2.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">My Notes</span>
                </Link>

                <Link
                  to="/user/profile"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/profile') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">Profile (Legacy)</span>
                  <span className="ml-auto text-xs text-orange-500 bg-orange-100 dark:bg-orange-900/20 px-1.5 py-0.5 rounded">Old</span>
                </Link>

                <Link
                  to="/user/profile-microservice"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/profile-microservice') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                  <span className="font-medium">Profile (Microservice)</span>
                  <span className="ml-auto text-xs text-green-500 bg-green-100 dark:bg-green-900/20 px-1.5 py-0.5 rounded">New</span>
                </Link>
              </div>

              {/* Actions Section */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Actions</p>
                
                <Link
                  to="/user/notes/add"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/notes/add') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">Add Note</span>
                </Link>

                <Link
                  to="/user/contacts/add"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/contacts/add') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-user-plus w-4 h-4 mr-3"></i>
                  <span className="font-medium">Add Contact</span>
                </Link>
              </div>

              {/* Management Section */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Management</p>
                
                <Link
                  to="/user/contacts"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/contacts') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-regular fa-address-book w-4 h-4 mr-3"></i>
                  <span className="font-medium">Contacts</span>
                </Link>

                <Link
                  to="/user/excel"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/excel') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fa-solid fa-file-excel w-4 h-4 mr-3 text-green-600"></i>
                  <span className="font-medium">Import/Export</span>
                  <span className="ml-auto text-xs text-green-500 bg-green-100 dark:bg-green-900/20 px-1.5 py-0.5 rounded">Excel</span>
                </Link>

                <Link
                  to="/user/direct-message"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive('/user/direct-message') 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="font-medium">Direct Message</span>
                </Link>
              </div>

              {/* Admin Section - Only show for admin users */}
              {loggedInUser?.roleList?.includes('ROLE_ADMIN') && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Administration</p>
                  
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                      isActive('/admin/dashboard') 
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' 
                        : 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>

                  <Link
                    to="/admin/profile-management"
                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                      isActive('/admin/profile-management') 
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' 
                        : 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    <span className="font-medium">Profile Management</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Bottom Section - Help & Logout */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="space-y-1">
              <button
                onClick={() => alert('Help documentation coming soon!')}
                className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Help & Support</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-150"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 z-20 sm:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default UserSidebar;
