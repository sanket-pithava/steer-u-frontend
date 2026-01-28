import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchProfileData = async () => {
        try {
            const { data } = await api.get('/api/profile/me');
            setProfile(data);
        } catch (error) {
            console.error("AuthContext: Failed to fetch profile", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (authToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            fetchProfileData();
        } else {
            setIsLoading(false);
        }
    }, []);
    const login = (token) => {
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthToken(token);
        setIsLoading(true);
        fetchProfileData();
    };
    const logout = () => {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setAuthToken(null);
        setProfile(null);
        setIsLoading(false);
    };
    const updateProfileData = (newProfileData) => {
        setProfile(prev => ({ ...prev, ...newProfileData }));
    };
    const isAuthenticated = !!authToken;

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            authToken,
            profile,
            isLoading,
            login,
            logout,
            updateProfileData
        }}>
            {children}
        </AuthContext.Provider>
    );
};
