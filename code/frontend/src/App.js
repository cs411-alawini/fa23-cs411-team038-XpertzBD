// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation'; // Import the Navigation component
import CreateCase from './CreateCase';
import SearchCase from './SearchCase';
import SignIn from './UserSignIn';
import SignUp from './UserSignUp'
// import Signup from './UserSignup'; // Uncomment when you have a Signup component

function App() {
  return (
    <Router>
      <div>
        <Navigation /> {/* Use the Navigation component */}
        <Routes>
          <Route exact path="/" element={<h1>Welcome to the Home Page</h1>} />
          <Route path="/report" element={<CreateCase />} />
          <Route path="/search" element={<SearchCase />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />}></Route>
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* ... other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
