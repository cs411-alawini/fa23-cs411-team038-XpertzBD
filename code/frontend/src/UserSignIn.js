// SignIn.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const auth = useAuth();
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Perform the SignIn
        try {
            const response = await fetch('http://127.0.0.1:5000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Extract the JSON from the response
            localStorage.setItem('access_token', data.access_token); // Store the token

            auth.logIn(); // Update the AuthContext
            navigate('/');
        } catch (error) {
            console.error('SignIn failed:', error);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">SignIn</button>
        </form>
    );
}

export default SignIn;
