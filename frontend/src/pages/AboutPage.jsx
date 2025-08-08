import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">About Smart Contact Manager</h1>

      <p className="text-lg mb-6">
        Smart Contact Manager is a web-based application that allows users to efficiently manage their personal and professional contacts.
        It features login with Email, Google, and GitHub, supports storing and organizing contact details, and provides integrated email functionality.
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Developer</h2>
        <p className="mt-1">Name: Akshay Kumar</p>
        <p className="mt-1">Name: Wasim Siddique</p>
        <p>Email: <a href="mailto:kakshay70007@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">kakshay70007@gmail.com</a></p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Connect with Me</h2>
        <div className="mt-3 flex space-x-4">
          <a href="https://github.com/akshay75760" target="_blank"
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/akshay-kumar-7b6058252/" target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
