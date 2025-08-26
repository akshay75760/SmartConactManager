import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initFlowbite } from 'flowbite';
import telephoneIcon from '../../assets/images/telephone.png'; // Import your image
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import html2canvas from 'html2canvas';

const UserNavbar = ({ loggedInUser }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    initFlowbite(); // Initialize Flowbite components
  }, []);

  // Capture Navbar as image
  const handleCaptureNavbar = async () => {
    const navbar = document.getElementById('user-navbar-capture');
    if (navbar) {
      const canvas = await html2canvas(navbar);
      const link = document.createElement('a');
      link.download = 'navbar-capture.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <nav id="user-navbar-capture" className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg dark:bg-gray-900/95 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-40 w-full">
      <div className="w-full grid grid-cols-3 items-center mx-auto p-4 px-6">
        {/* Left: Sidebar Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            data-drawer-target="logo-sidebar"
            data-drawer-toggle="logo-sidebar"
            aria-controls="logo-sidebar"
            type="button"
            className="inline-flex items-center p-3 text-sm text-gray-500 rounded-xl sm:hidden hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:focus:ring-purple-600 transition-all duration-200"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
            </svg>
          </button>
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
              <img src={telephoneIcon} className="relative h-10 w-10 shadow-lg rounded-full object-cover border-2 border-white/20" alt="SCM Logo" />
            </div>
            <span className="self-center text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Smart Contact Manager
            </span>
          </Link>
        </div>
        {/* Center: Navigation Menu */}
        <div className="flex justify-center">
          <ul className="flex gap-6 font-medium items-center">
            <li><Link to="/home" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200">Home</Link></li>
            <li><Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200">About</Link></li>
            <li><Link to="/services" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200">Services</Link></li>
            {loggedInUser?.roleList?.includes('ROLE_ADMIN') && (
              <>
                <li><Link to="/admin/dashboard" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200"><i className="fa-solid fa-crown mr-1"></i>Admin</Link></li>
                <li><Link to="/admin/profile-management" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200"><i className="fa-solid fa-users-gear mr-1"></i>Profile</Link></li>
              </>
            )}
            <li><Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200">Contact</Link></li>
          </ul>
        </div>
        {/* Right: Actions */}
        <div className="flex gap-2 justify-end items-center">
          <button id="theme_change_button" onClick={toggleTheme} className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 transition-all duration-300 shadow-lg group">
            <i className="fa-solid fa-circle-half-stroke text-gray-700 dark:text-gray-300 group-hover:rotate-180 transition-transform duration-300"></i>
          </button>
          <Link to="/user/profile" className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-medium text-sm shadow-lg transition-all duration-300">
            <div className="w-6 h-6 rounded-full bg-white/20 mr-2 flex items-center justify-center">
              <span className="text-xs font-bold">{(loggedInUser?.name || 'U')[0].toUpperCase()}</span>
            </div>
            <span>{loggedInUser?.name || 'Profile'}</span>
          </Link>
          <button onClick={logout} className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium text-sm shadow-lg transition-all duration-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
