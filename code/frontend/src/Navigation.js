// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navigation = () => {
    const auth = useAuth();

    return (
        <nav>
            <Link to="/">Home</Link>
            {auth.isLoggedIn ? (
                <>
                    | <Link to="/report">Report Case</Link>
                    | <Link to="/search">Search Case</Link>
                    | <Link to="/advancedSQL1">AdvQuery1(FreqList)</Link>
                    | <Link to="/summary1">Summary 1</Link>
                    | <Link to="/advancedSQL2">AdvQuery2(StatByHour)</Link>
                    | <Link to="/summary2">Summary 2</Link>
                    | <button onClick={auth.logOut}>Log Out</button>
                </>
            ) : (
                <>
                    | <Link to="/signin">Log In</Link>
                    | <Link to="/signup">Sign Up</Link>
                </>
            )}
        </nav>
    );
};

export default Navigation;
