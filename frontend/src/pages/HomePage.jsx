import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="border">
      {/* Banner Section */}
      <section className="bg-blue-600 text-white py-20 animate__animated animate__fadeInDown">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Contact Manager</h2>
          <p className="text-lg mb-8">Manage all your contacts effortlessly and securely in one place.</p>
          <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">Get Started</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 animate__animated animate__fadeInUp">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition duration-300 transform hover:scale-105">
              <i className="fas fa-address-book text-blue-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Easy Contact Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Add, edit, and organize your contacts in a user-friendly interface.</p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition duration-300 transform hover:scale-105">
              <i className="fas fa-lock text-blue-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600 dark:text-gray-300">Your data is protected with top-level encryption and security measures.</p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition duration-300 transform hover:scale-105">
              <i className="fas fa-globe text-blue-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
              <p className="text-gray-600 dark:text-gray-300">Access your contacts anytime, anywhere from any device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-20 animate__animated animate__fadeInUp">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Manage Your Contacts?</h2>
          <p className="text-lg mb-8">Sign up today and experience the easiest way to manage your contacts.</p>
          <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">Create an Account</Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 animate__animated animate__fadeInUp">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition duration-300 transform hover:scale-105">
              <p className="text-gray-600 italic dark:text-gray-300">"Contact Manager has changed the way I organize my contacts. It's fast, secure, and incredibly easy to use!"</p>
              <h4 className="text-lg font-semibold mt-4">- John Doe</h4>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition duration-300 transform hover:scale-105">
              <p className="text-gray-600 italic dark:text-gray-300">"A fantastic app with great features! I love the 24/7 access and secure storage options."</p>
              <h4 className="text-lg font-semibold mt-4">- Jane Smith</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-900 animate__animated animate__fadeInUp">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Get in Touch</h2>
          <form className="max-w-lg mx-auto">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <input type="email" placeholder="Your Email" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <textarea placeholder="Your Message" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition duration-300">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Contact Manager. All rights reserved.</p>
          <p>Follow us on <a href="#" className="text-blue-400">Facebook</a>, <a href="#" className="text-blue-400">Twitter</a>, and <a href="#" className="text-blue-400">Instagram</a>.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
