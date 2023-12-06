// src/AuthContext.js
import React, { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('access_token'));

    useEffect(() => {
        // Update the login state based on the presence of the token in local storage
        setLoggedIn(!!localStorage.getItem('access_token'));
    }, []);


    const logIn = () => setLoggedIn(true);
    const logOut = () => {
        localStorage.removeItem('access_token');
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
