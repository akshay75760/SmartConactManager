import React, { useState } from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import MessageBox from '../../components/common/MessageBox';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axiosConfig';

const AddContactPage = () => {
  const { user } = useAuth();
  
  // Debug: Check if user is properly authenticated
  console.log('Current user:', user);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    description: '',
    favorite: true,
    websiteLink: '',
    linkedInLink: '',
    contactImage: null,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else {
        setImagePreview('');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    // Check if user is authenticated
    if (!user) {
      setMessage({ content: 'You must be logged in to add a contact', type: 'red' });
      return;
    }

    // Basic client-side validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ content: 'Please fix the errors below', type: 'red' });
      return;
    }

    const data = new FormData();
    
    // Create contact JSON object excluding the file
    const contactData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      description: formData.description,
      favorite: formData.favorite,
      websiteLink: formData.websiteLink,
      linkedInLink: formData.linkedInLink
    };
    
    // Add contact data as JSON part
    data.append('contact', new Blob([JSON.stringify(contactData)], {
      type: 'application/json'
    }));
    
    // Add file if selected
    if (formData.contactImage) {
      data.append('contactImage', formData.contactImage);
    }

    // Debug: Log the FormData contents
    console.log('FormData being sent:');
    console.log('Contact JSON:', JSON.stringify(contactData));
    if (formData.contactImage) {
      console.log('Image file:', formData.contactImage.name);
    }

    try {
      const response = await axios.post('/user/contacts/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Contact added successfully:', response.data);
      setMessage({ content: 'You have successfully added a new contact', type: 'green' });
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        description: '',
        favorite: true,
        websiteLink: '',
        linkedInLink: '',
        contactImage: null,
      });
      setImagePreview('');
    } catch (error) {
      console.error('Error adding contact:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response && error.response.data) {
        // Check for authentication issues
        if (error.response.status === 401 || error.response.status === 403) {
          setMessage({ content: 'You are not authenticated. Please login again.', type: 'red' });
          return;
        }
        
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
          setMessage({ content: `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`, type: 'red' });
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
      phoneNumber: '',
      address: '',
      description: '',
      favorite: true,
      websiteLink: '',
      linkedInLink: '',
      contactImage: null,
    });
    setErrors({});
    setMessage(null);
    setImagePreview('');
  };

  return (
    <div id="content">
      {user && <UserSidebar loggedInUser={user} />}
      <div className="sm:pl-64 pt-20" style={{ height: '1000px' }}>
        <div className="grid grid-cols-12">
          <div className="col-span-3"></div>
          <div className="col-span-12 md:col-span-6">
            <div className="card block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              {message && <MessageBox message={message} />}

              <h1 className="text-2xl font-semibold">Add New Contact</h1>
              <p className="text-gray-500">
                This contact will be stored on cloud, you can direct email this
                client from scm...
              </p>

              <form onSubmit={handleSubmit} className="mt-8" encType="multipart/form-data">
                {/* Name field */}
                <div className="mb-3">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contact Name
                  </label>
                  <div className="relative mb-1">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i className="fa-regular w-4 h-4 fa-user"></i>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                {/* Email field */}
                <div className="mb-3">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contact Email
                  </label>
                  <div className="relative mb-1">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i className="fa-regular w-4 h-4 fa-envelope"></i>
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="example@gmail.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>

                {/* Phone number field */}
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contact Phone
                  </label>
                  <div className="relative mb-1">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <i className="fa-solid w-4 h-4 fa-phone"></i>
                    </div>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="9823525525"
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                </div>

                {/* Address field */}
                <div className="mb-3">
                  <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contact Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Address of the contact"
                  ></textarea>
                  {errors.address && <p className="text-red-500">{errors.address}</p>}
                </div>

                {/* Description field */}
                <div className="mb-3">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contact Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write about your contact"
                  ></textarea>
                </div>

                {/* Social links */}
                <div className="flex space-x-3 mb-3">
                  <div className="w-full">
                    {/* Website link */}
                    <div className="mb-3">
                      <div className="relative mb-6">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <i className="fa-solid w-4 h-4 fa-earth-americas"></i>
                        </div>
                        <input
                          type="text"
                          id="websiteLink"
                          name="websiteLink"
                          value={formData.websiteLink}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="http://yourwebsite.com/"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    {/* LinkedIn link */}
                    <div className="mb-3">
                      <div className="relative mb-6">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <i className="fa-brands w-4 h-4 fa-linkedin"></i>
                        </div>
                        <input
                          type="text"
                          id="linkedInLink"
                          name="linkedInLink"
                          value={formData.linkedInLink}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="http://yourLinkedin.com/"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact image field */}
                <div className="mb-3">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="contactImage">
                    Contact Image <span className="text-gray-500 text-sm">(Optional)</span>
                  </label>
                  <input
                    id="contactImage"
                    name="contactImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You can upload a profile picture for this contact (optional)
                  </p>
                  {errors.contactImage && <p className="text-red-500">{errors.contactImage}</p>}
                  {imagePreview && (
                    <img
                      className="max-h-52 mx-auto rounded-lg shadow m-3"
                      src={imagePreview}
                      alt="Contact Preview"
                    />
                  )}
                </div>

                {/* Favorite checkbox */}
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="favorite"
                    name="favorite"
                    checked={formData.favorite}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="favorite" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Is this contact your favorite one?
                  </label>
                </div>

                <div className="button-container text-center">
                  <button
                    type="submit"
                    className="px-3 py-2 dark:bg-blue-600 hover:dark:bg-blue-700 rounded bg-black text-white"
                  >
                    Add Contact
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-2 dark:bg-blue-600 hover:dark:bg-blue-700 rounded bg-black text-white ml-2"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactPage;
