import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const LoginSuccessHandler = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState('Authenticating..');

    useEffect(() => {

        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);

        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            login(token);
            setStatusMessage('Login successful. Redirecting, please wait…');
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } else if (error) {
            const decodedError = decodeURIComponent(error);
            setStatusMessage(`Oops! Login failed: ${decodedError}. Please close this window and try again.`);
            console.error("Social Login Error:", decodedError);
        } else {
            setStatusMessage('We couldn’t verify your login — token not found. Please try again.');
        }
    }, [login, navigate]);
    return (
        <div
            className="flex items-center justify-center min-h-screen text-center"
            style={{ backgroundColor: '#6b2400', color: 'white' }}
        >
            <div className="p-8 rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <h1 className="text-xl font-bold mb-2">Process ongoing...</h1>
                <p>{statusMessage}</p>
            </div>
        </div>
    );
};

export default LoginSuccessHandler;
