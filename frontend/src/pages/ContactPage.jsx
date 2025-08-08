import React from 'react';

const ContactPage = () => {
  return (
    <div id="content">
      {/* Contact Section */}
      <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="mb-10 text-lg text-gray-700 dark:text-gray-300">
            Feel free to connect with me or drop an email. I’m open to new opportunities and collaborations!
          </p>

          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
            <div className="text-left space-y-4">
              <p><strong>Name:</strong> Akshay Kumar</p>
              <p><strong>Name:</strong> Wasim Siddique</p>
              <p><strong>Email:</strong> <a href="mailto:kakshay70007@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">kakshay70007@gmail.com</a></p>
              <p><strong>GitHub:</strong>
                <a href="https://github.com/akshay75760" target="_blank" className="inline-flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition">
                  <i className="fab fa-github mr-2"></i> github.com/akshay75760
                </a>
              </p>
              <p><strong>LinkedIn:</strong>
                <a href="https://www.linkedin.com/in/akshay-kumar-7b6058252/" target="_blank" className="inline-flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition">
                  <i className="fab fa-linkedin mr-2"></i> linkedin.com/in/akshay-kumar-7b6058252
                </a>
              </p>
            </div>

            {/* Email Button */}
            <div className="mt-8 flex justify-center space-x-4">
              <a href="mailto:kakshay70007@gmail.com" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition">
                Send Email
              </a>

              {/* LinkedIn Connect Button */}
              <a href="https://www.linkedin.com/in/akshay-kumar-7b6058252/" target="_blank" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition">
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
