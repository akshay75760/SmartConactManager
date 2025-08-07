import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const OAuthSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { oauthLogin } = useContext(AuthContext);
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return; // Prevent multiple executions

        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');

        if (token && email) {
            // Store JWT token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                email: email,
                name: name
            }));

            // Update auth context
            oauthLogin({
                email: email,
                name: name
            });

            hasProcessed.current = true; // Mark as processed
            // Redirect to dashboard
            navigate('/user/dashboard', { replace: true });
        } else {
            hasProcessed.current = true; // Mark as processed
            // If no token, redirect to login
            navigate('/login', { replace: true });
        }
    }, []); // Empty dependency array - run only once

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    Completing OAuth login...
                </h2>
                <p className="mt-2 text-gray-600">
                    Please wait while we log you in.
                </p>
            </div>
        </div>
    );
};

export default OAuthSuccessPage;
