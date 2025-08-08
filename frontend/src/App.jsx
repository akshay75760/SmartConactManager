import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OAuthSuccessPage from './pages/auth/OAuthSuccessPage';
import DashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import AddContactPage from './pages/user/AddContactPage';
import ContactsPage from './pages/user/ContactsPage';
import UpdateContactPage from './pages/user/UpdateContactPage';
import SearchContactsPage from './pages/user/SearchContactsPage';
import DirectMessagePage from './pages/user/DirectMessagePage';
import NotesPage from './pages/user/NotesPage';
import AddEditNotePage from './pages/user/AddEditNotePage';
import ExcelPage from './pages/user/ExcelPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Navbar from './components/common/Navbar';
import UserNavbar from './components/user/UserNavbar';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

// Create a separate component that uses useAuth
function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <UserNavbar loggedInUser={user} /> : <Navbar />}
      <main className="dark:bg-gray-900 bg-gray-100 dark:text-white min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth-success" element={<OAuthSuccessPage />} />
          <Route path="/success_page" element={<SuccessPage />} />
          <Route path="/error_page" element={<ErrorPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/user/dashboard" element={<DashboardPage />} />
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/contacts/add" element={<AddContactPage />} />
            <Route path="/user/contacts" element={<ContactsPage />} />
            <Route path="/user/contacts/view/:contactId" element={<UpdateContactPage />} />
            <Route path="/user/contacts/search" element={<SearchContactsPage />} />
            <Route path="/user/direct-message" element={<DirectMessagePage />} />
            <Route path="/user/notes" element={<NotesPage />} />
            <Route path="/user/notes/add" element={<AddEditNotePage />} />
            <Route path="/user/notes/edit/:noteId" element={<AddEditNotePage />} />
            <Route path="/user/excel" element={<ExcelPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
