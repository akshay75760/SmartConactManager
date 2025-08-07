import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MessageBox from '../components/common/MessageBox';

const SuccessPage = () => {
  const location = useLocation();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    } else {
      setMessage({ content: 'Operation successful!', type: 'green' });
    }
  }, [location]);

  return (
    <div id="content" className="text-center mt-5 md:w-1/2 mx-auto">
      {message && <MessageBox message={message} />}
      <Link to="/login" className="bg-green-900 mt-2 text-white px-3 py-2 rounded">
        Login
      </Link>
    </div>
  );
};

export default SuccessPage;
