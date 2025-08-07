import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import MessageBox from '../../components/common/MessageBox';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axiosConfig';

const DirectMessagePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientEmail: '',
    subject: '',
    messageBody: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    const maxFiles = 5;

    if (files.length > maxFiles) {
      setMessage({ content: `Maximum ${maxFiles} files allowed`, type: 'red' });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setMessage({ content: `File ${file.name} is too large. Maximum size is 10MB`, type: 'red' });
        return false;
      }
      return true;
    });

    setAttachments(validFiles);
    setMessage(null);
  };

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Recipient email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.messageBody.trim()) {
      newErrors.messageBody = 'Message body is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      let response;
      
      if (attachments.length > 0) {
        // Use FormData for multipart request with attachments
        const formDataObj = new FormData();
        formDataObj.append('recipientEmail', formData.recipientEmail);
        formDataObj.append('subject', formData.subject);
        formDataObj.append('messageBody', formData.messageBody);
        
        // Add attachments
        attachments.forEach((file) => {
          formDataObj.append('attachments', file);
        });

        response = await axios.post('/api/messages/send-with-attachments', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use JSON for simple message without attachments
        response = await axios.post('/api/messages/send', {
          recipientEmail: formData.recipientEmail,
          subject: formData.subject,
          messageBody: formData.messageBody
        });
      }

      console.log('Message sent successfully:', response.data);
      setMessage({ content: 'Message sent successfully!', type: 'green' });
      
      // Reset form after successful send
      setFormData({
        recipientEmail: '',
        subject: '',
        messageBody: ''
      });
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          const newErrors = {};
          error.response.data.errors.forEach(err => {
            newErrors[err.field] = err.defaultMessage;
          });
          setErrors(newErrors);
          setMessage({ content: 'Please correct the following errors', type: 'red' });
        } else if (error.response.data.message) {
          setMessage({ content: error.response.data.message, type: 'red' });
        } else {
          setMessage({ content: 'An unexpected error occurred.', type: 'red' });
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
      recipientEmail: '',
      subject: '',
      messageBody: ''
    });
    setAttachments([]);
    setErrors({});
    setMessage(null);
  };

  const handleTestEmail = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await axios.post('/api/messages/test');
      console.log('Test email sent:', response.data);
      setMessage({ content: response.data.content || 'Test email sent successfully!', type: 'green' });
    } catch (error) {
      console.error('Test email failed:', error);
      const errorMessage = error.response?.data?.content || 'Test email failed. Please check your email configuration.';
      setMessage({ content: errorMessage, type: 'red' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="content">
      {user && <UserSidebar loggedInUser={user} />}
      <div className="sm:pl-64 pt-20" style={{ minHeight: '100vh' }}>
        <div className="grid grid-cols-12">
          <div className="col-span-1"></div>
          <div className="col-span-12 md:col-span-10">
            <div className="card block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              {message && <MessageBox message={message} />}

              <div className="flex items-center mb-6">
                <i className="fa-solid fa-envelope text-2xl text-blue-600 mr-3"></i>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Send Direct Message</h1>
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                {/* Recipient Email field */}
                <div className="mb-6">
                  <label htmlFor="recipientEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Recipient Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i className="fa-regular fa-envelope w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                    </div>
                    <input
                      type="email"
                      id="recipientEmail"
                      name="recipientEmail"
                      value={formData.recipientEmail}
                      onChange={handleChange}
                      className={`bg-gray-50 border ${errors.recipientEmail ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="recipient@example.com"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.recipientEmail && <p className="text-red-500 text-sm mt-1">{errors.recipientEmail}</p>}
                </div>

                {/* Subject field */}
                <div className="mb-6">
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Subject *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i className="fa-solid fa-tag w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`bg-gray-50 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Enter subject"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                {/* Message Body field */}
                <div className="mb-6">
                  <label htmlFor="messageBody" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Message *
                  </label>
                  <textarea
                    id="messageBody"
                    name="messageBody"
                    rows="8"
                    value={formData.messageBody}
                    onChange={handleChange}
                    className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${errors.messageBody ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="Write your message here..."
                    disabled={isLoading}
                  ></textarea>
                  {errors.messageBody && <p className="text-red-500 text-sm mt-1">{errors.messageBody}</p>}
                </div>

                {/* Attachments field */}
                <div className="mb-6">
                  <label htmlFor="attachments" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Attachments (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="attachments"
                      name="attachments"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      disabled={isLoading}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Maximum 5 files, 10MB each. Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, ZIP, RAR
                  </p>
                  
                  {/* Attachment previews */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</p>
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-file text-blue-600 dark:text-blue-400"></i>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            disabled={isLoading}
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="button-container text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg text-white font-medium mr-3 ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                    } transition-colors duration-200`}
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane mr-2"></i>
                        Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium mr-3 transition-colors duration-200"
                  >
                    <i className="fa-solid fa-undo mr-2"></i>
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors duration-200"
                  >
                    <i className="fa-solid fa-flask mr-2"></i>
                    Test Email
                  </button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  How it works
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Enter the recipient's email address</li>
                  <li>• Add a clear, descriptive subject line</li>
                  <li>• Compose your message in the text area</li>
                  <li>• Optionally attach files (max 5 files, 10MB each)</li>
                  <li>• Click "Send Message" to deliver via email</li>
                  <li>• Use "Test Email" to send a test message to yourself</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessagePage;
