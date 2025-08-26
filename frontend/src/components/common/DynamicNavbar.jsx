import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../common/Navbar';
import UserNavbar from '../user/UserNavbar';

const DynamicNavbar = () => {
  const { user } = useAuth();

  // If user is logged in, show UserNavbar, otherwise show regular Navbar
  return user ? <UserNavbar loggedInUser={user} /> : <Navbar />;
};

export default DynamicNavbar;
