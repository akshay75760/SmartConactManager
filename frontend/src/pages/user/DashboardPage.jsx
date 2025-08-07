import React from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div id="content">
      {user && <UserSidebar loggedInUser={user} />}
      <div className="sm:pl-64 pt-20" style={{ height: '1000px' }}>
        <div className="flex justify-center flex-col items-center">
          <h1 className="text-5xl">Welcome to Dashboard page</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequatur, ratione!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
