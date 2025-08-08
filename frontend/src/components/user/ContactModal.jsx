import React, { useEffect, useState } from 'react';

const ContactModal = ({ contact, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!contact || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal container */}
      <div
        className={`relative w-full max-w-4xl mx-4 transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Modal content */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 text-white hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
          </div>

          {/* Profile section */}
          <div className="relative px-8 pb-6">
            {/* Profile image */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <img
                  onError={(e) => e.target.src = 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png'}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                  src={contact.picture}
                  alt={`${contact.name} profile`}
                />
                {/* Online status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
            </div>

            {/* Contact info header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {contact.name}
              </h2>
              <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-envelope text-blue-500"></i>
                  <span className="font-medium">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-phone text-green-500"></i>
                  <span className="font-medium">{contact.phoneNumber}</span>
                </div>
              </div>
              
              {/* Favorite status */}
              {contact.favorite && (
                <div className="flex items-center justify-center mt-3 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-lg"></i>
                  ))}
                  <span className="ml-2 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Favorite Contact
                  </span>
                </div>
              )}
            </div>

            {/* Contact details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              {contact.address && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <i className="fas fa-map-marker-alt text-red-500 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{contact.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* About */}
              {contact.description && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <i className="fas fa-user text-purple-500 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">About</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{contact.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Website */}
              {contact.websiteLink && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <i className="fas fa-globe text-blue-500 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Website</h3>
                      <a
                        href={contact.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium break-all hover:underline transition-colors"
                      >
                        {contact.websiteLink}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {contact.linkedInLink && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <i className="fab fa-linkedin text-blue-600 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">LinkedIn</h3>
                      <a
                        href={contact.linkedInLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium break-all hover:underline transition-colors"
                      >
                        {contact.linkedInLink}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <i className="fas fa-phone"></i>
                <span>Call</span>
              </button>
              
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <i className="fas fa-envelope"></i>
                <span>Email</span>
              </button>
              
              <button className="flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </button>
              
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <i className="fas fa-times"></i>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
