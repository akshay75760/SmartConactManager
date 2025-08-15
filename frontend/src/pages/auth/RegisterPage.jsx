import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MessageBox from '../../components/common/MessageBox';
import axios from '../../api/axiosConfig';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    about: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setMessage(null); // Clear previous messages
    setIsLoading(true);

    try {
      const response = await axios.post('/do-register', formData);
      console.log('Registration successful:', response.data);
      setMessage({ content: 'Registration Successful! You can now log in.', type: 'green' });
      setFormData({
        name: '',
        email: '',
        password: '',
        about: '',
        phoneNumber: '',
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          const newErrors = {};
          error.response.data.errors.forEach(err => {
            newErrors[err.field] = err.defaultMessage;
          });
          setErrors(newErrors);
          setMessage({ content: 'Please correct the form errors.', type: 'red' });
        } else if (error.response.data.message) {
          setMessage({ content: error.response.data.message, type: 'red' });
        } else {
          setMessage({ content: 'An unexpected error occurred during registration.', type: 'red' });
        }
      } else {
        setMessage({ content: 'Network error or server is unreachable.', type: 'red' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      about: '',
      phoneNumber: '',
    });
    setErrors({});
    setMessage(null);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep1 = () => {
    return formData.name && formData.email && formData.password;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <i className="fas fa-user-plus text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join us to manage your contacts
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep >= 1 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 rounded transition-all duration-300 ${
                currentStep >= 2 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep >= 2 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                2
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep} of 2
            </div>
          </div>

          {message && (
            <div className="mb-6 animate-fadeIn">
              <MessageBox message={message} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-slideIn">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Basic Information</h3>
                
                {/* Name Field */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                        errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                        errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400"></i>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                        errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.password}</p>}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep1()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>Continue</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            )}

            {/* Step 2: Additional Info */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-slideIn">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Additional Information</h3>
                
                {/* Phone Number Field */}
                <div className="relative">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-phone text-gray-400"></i>
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                        errors.phoneNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="e.g., +1 (555) 123-4567"
                      required
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.phoneNumber}</p>}
                </div>

                {/* About Field */}
                <div className="relative">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    About Yourself
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <i className="fas fa-info-circle text-gray-400"></i>
                    </div>
                    <textarea
                      id="about"
                      name="about"
                      rows="4"
                      value={formData.about}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none ${
                        errors.about ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Tell us a bit about yourself..."
                    ></textarea>
                  </div>
                  {errors.about && <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.about}</p>}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full border border-white/20 dark:border-gray-700/20">
            <i className="fas fa-shield-alt text-green-500 mr-2"></i>
            <span className="text-sm text-gray-600 dark:text-gray-400">Your data is safe with us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
