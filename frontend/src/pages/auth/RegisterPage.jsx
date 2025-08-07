import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setMessage(null); // Clear previous messages

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
  };

  return (
    <div id="content">
      <div className="grid grid-cols-12 mt-4">
        <div className="col-span-4 md:col-span-2 lg:col-span-3 xl:col-span-4"></div>
        <div className="col-span-12 md:col-span-8 lg:col-span-6 xl:col-span-4">
          <div className="block p-6 border-t-[10px] border-green-700 bg-white rounded-xl shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-700 dark:hover:bg-gray-700">
            {message && <MessageBox message={message} />}

            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Signup Here
            </h5>
            <p className="font-normal text-gray-400 dark:text-gray-400">
              Start managing contacts on cloud ...
            </p>

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="mb-3">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter your name"
                  required
                />
                {errors.name && <p className="text-red-600 px-1 py-2">{errors.name}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@example.com"
                  required
                />
                {errors.email && <p className="text-red-600 px-1 py-2">{errors.email}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                {errors.password && <p className="text-red-600 px-1 py-2">{errors.password}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="e.g., 9876543210"
                  required
                />
                {errors.phoneNumber && <p className="text-red-600 px-1 py-2">{errors.phoneNumber}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="about" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Write something about yourself
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows="6"
                  value={formData.about}
                  onChange={handleChange}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write here..."
                ></textarea>
                {errors.about && <p className="text-red-600 px-1 py-2">{errors.about}</p>}
              </div>

              <div className="mb-3 flex justify-center space-x-3">
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-900 text-white dark:bg-blue-800 dark:hover:bg-blue-700"
                >
                  Signup
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 rounded bg-orange-800 hover:bg-orange-700 text-white dark:bg-orange-800 dark:hover:bg-orange-700"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
