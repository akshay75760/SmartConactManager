import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axiosConfig';

const AddEditNotePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { noteId } = useParams();
  const isEditing = Boolean(noteId);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    isFavorite: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchNote();
    }
  }, [noteId, isEditing]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/notes/categories');
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/notes/edit/${noteId}`);
      const note = response.data;
      setFormData({
        title: note.title || '',
        content: note.content || '',
        category: note.category || '',
        isFavorite: note.favorite || false
      });
      setError('');
    } catch (err) {
      console.error('Error fetching note:', err);
      setError('Failed to fetch note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await axiosInstance.post(`/user/notes/edit/${noteId}`, formData);
      } else {
        await axiosInstance.post('/user/notes/add', formData);
      }
      
      setSuccess(`Note ${isEditing ? 'updated' : 'created'} successfully!`);
      
      setTimeout(() => {
        navigate('/user/notes');
      }, 1500);
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} note:`, err);
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} note. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user/notes');
  };

  return (
    <div id="content">
      {user && <UserSidebar loggedInUser={user} />}
      <div className="sm:pl-64 pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Note' : 'Add New Note'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Update your note below' : 'Create a new note to organize your thoughts'}
            </p>
          </div>

          {/* Form */}
          <div className="max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter note title..."
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.title.length}/200 characters
                  </p>
                </div>

                {/* Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      list="categories"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter or select category..."
                    />
                    <datalist id="categories">
                      {categories.map((category, index) => (
                        <option key={index} value={category} />
                      ))}
                    </datalist>
                  </div>

                  {/* Favorite */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFavorite"
                      name="isFavorite"
                      checked={formData.isFavorite}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Mark as favorite
                    </label>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows="12"
                    maxLength="5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical"
                    placeholder="Write your note content here..."
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.content.length}/5000 characters
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditing ? 'Updating...' : 'Saving...'}
                      </span>
                    ) : (
                      isEditing ? 'Update Note' : 'Save Note'
                    )}
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

export default AddEditNotePage;
