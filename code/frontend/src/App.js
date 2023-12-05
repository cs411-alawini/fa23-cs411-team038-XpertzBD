import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateCase from './CreateCase';
import SearchCase from './SearchCase';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/report">Report Case</Link> | <Link to="/search">Search Case</Link> 
        </nav>
        <Routes> {/* Change here from Switch to Routes */}
          <Route exact path="/" element={<h1>Welcome to the Home Page</h1>} /> {/* Change for Route */}
          <Route path="/report" element={<CreateCase />} /> {/* Change for Route */}
          <Route path="/search" element={<SearchCase />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
