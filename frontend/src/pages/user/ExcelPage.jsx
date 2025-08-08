import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import UserSidebar from '../../components/user/UserSidebar';
import axiosInstance from '../../api/axiosConfig';

const ExcelPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [totalContacts, setTotalContacts] = useState(0);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load contact stats on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchContactStats();
    }
  }, [isAuthenticated]);

  const fetchContactStats = async () => {
    try {
      const response = await axiosInstance.get('/api/excel/stats');
      setTotalContacts(response.data.totalContacts || 0);
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convert to MB
      const fileName = file.name.toLowerCase();
      
      if (fileSize > 5) {
        toast.error('File size must be less than 5MB');
        event.target.value = '';
        return;
      }
      
      if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        toast.error('Please select a valid Excel file (.xlsx or .xls)');
        event.target.value = '';
        return;
      }
      
      setSelectedFile(file);
    }
  };

  // Handle file import
  const handleImport = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select an Excel file to import');
      return;
    }

    setImporting(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axiosInstance.post('/api/excel/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message + ' 🎉');
        setSelectedFile(null);
        document.getElementById('excelFile').value = '';
        // Refresh contact stats
        fetchContactStats();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Import error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error importing contacts. Please check your file format.');
      }
    } finally {
      setImporting(false);
    }
  };

  // Download template
  const downloadTemplate = async () => {
    try {
      const response = await axiosInstance.get('/api/excel/template', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contact_import_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully! 📄');
    } catch (error) {
      console.error('Template download error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      toast.error('Error downloading template');
    }
  };

  // Export all contacts
  const exportAllContacts = async () => {
    try {
      const response = await axiosInstance.get('/api/excel/export', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'all_contacts.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('All contacts exported successfully! 📤');
    } catch (error) {
      console.error('Export error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      toast.error('Error exporting contacts');
    }
  };

  // Export favorite contacts
  const exportFavoriteContacts = async () => {
    try {
      const response = await axiosInstance.get('/api/excel/export?favorites=true', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'favorite_contacts.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Favorite contacts exported successfully! ⭐');
    } catch (error) {
      console.error('Export error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      toast.error('Error exporting favorite contacts');
    }
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div id="content">
      {user && <UserSidebar loggedInUser={user} />}
      <div className="sm:pl-64 pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <i className="fa-solid fa-file-excel text-green-600 mr-3"></i>
              Import/Export Contacts
            </h1>
            
            {/* Statistics */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <i className="fa-solid fa-chart-bar text-blue-600 mr-3"></i>
                <span className="text-blue-800 dark:text-blue-200">
              Total Contacts: <strong>{totalContacts}</strong>
            </span>
          </div>
        </div>
        
        {/* Excel Import/Export Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import Section */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
              <i className="fa-solid fa-upload mr-2"></i>
              Import Contacts
            </h2>
            
            <div className="space-y-4">
              {/* Template Download */}
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  <i className="fa-solid fa-download mr-2 text-blue-600"></i>
                  Step 1: Download Template
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Download the Excel template with sample data and required format.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fa-solid fa-file-excel mr-2"></i>
                  Download Template
                </button>
              </div>
              
              {/* File Upload */}
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  <i className="fa-solid fa-file-upload mr-2 text-green-600"></i>
                  Step 2: Upload Excel File
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Upload your filled Excel file to import contacts.
                </p>
                
                <form onSubmit={handleImport} className="space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      id="excelFile"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      required
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/20 dark:file:text-green-400"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={importing || !selectedFile}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importing ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Importing...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-upload mr-2"></i>
                        Import Contacts
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              {/* Import Guidelines */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Import Guidelines
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Required fields: Name, Email, Phone, Address</li>
                  <li>• Phone numbers must be 10 digits</li>
                  <li>• Email addresses must be valid</li>
                  <li>• Duplicate emails will be skipped</li>
                  <li>• Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Export Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
              <i className="fa-solid fa-download mr-2"></i>
              Export Contacts
            </h2>
            
            <div className="space-y-4">
              {/* Export All */}
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  <i className="fa-solid fa-users mr-2 text-blue-600"></i>
                  Export All Contacts
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Download all your contacts as an Excel file.
                </p>
                <button
                  onClick={exportAllContacts}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fa-solid fa-file-excel mr-2"></i>
                  Export All
                </button>
              </div>
              
              {/* Export Favorites */}
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  <i className="fa-solid fa-star mr-2 text-yellow-500"></i>
                  Export Favorite Contacts
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Download only your favorite contacts as an Excel file.
                </p>
                <button
                  onClick={exportFavoriteContacts}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <i className="fa-solid fa-star mr-2"></i>
                  Export Favorites
                </button>
              </div>
              
              {/* Export Info */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Export Information
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Exports include all contact details</li>
                  <li>• Files are generated in Excel format (.xlsx)</li>
                  <li>• Contact images are not included in export</li>
                  <li>• Data is sorted alphabetically by name</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back to Contacts */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/user/contacts')}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Contacts
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelPage;
