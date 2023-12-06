// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Logout() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth.logOut();
        navigate('/');
    }, [auth, navigate]);

    return (
        <div>Logging out...</div>
    );
}

export default Logout;
