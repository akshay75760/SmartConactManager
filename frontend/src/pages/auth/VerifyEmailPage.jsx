import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MessageBox from '../../components/common/MessageBox';
import axios from '../../api/axiosConfig';

const VerifyEmailPage = () => {
  const location = useLocation();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await axios.get(`/auth/verify-email?token=${token}`);
          setMessage({ content: response.data.message || 'Email verified successfully. You can now log in.', type: 'green' });
        } catch (error) {
          console.error('Email verification error:', error);
          if (error.response && error.response.data && error.response.data.message) {
            setMessage({ content: error.response.data.message, type: 'red' });
          } else {
            setMessage({ content: 'Email verification failed. Invalid or expired token.', type: 'red' });
          }
        }
      };
      verifyEmail();
    } else {
      setMessage({ content: 'No verification token found.', type: 'red' });
    }
  }, [location]);

  return (
    <div id="content" className="text-center mt-5 md:w-1/2 mx-auto">
      {message && <MessageBox message={message} />}
      {message && message.type === 'green' ? (
        <Link to="/login" className="bg-green-900 mt-2 text-white px-3 py-2 rounded">
          Login
        </Link>
      ) : (
        <Link to="/login" className="bg-gray-900 mt-2 text-white px-3 py-2 rounded">
          Go to Login
        </Link>
      )}
    </div>
  );
};

export default VerifyEmailPage;
