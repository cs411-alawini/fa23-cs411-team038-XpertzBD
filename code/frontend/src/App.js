// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation'; // Import the Navigation component
import CreateCase from './CreateCase';
import SearchCase from './SearchCase';
import AdvancedSQL1 from './AdvancedSQL1';
import AdvancedSQL2 from './AdvancedSQL2';
import Summary2 from './Summary2';
import Summary1 from './Summary1';
import SignIn from './UserSignIn';
import SignUp from './UserSignUp'
// import Signup from './UserSignup'; // Uncomment when you have a Signup component

function App() {
  return (
    <Router>
      <div>
        <Navigation /> {/* Use the Navigation component */}
        <Routes> {/* Change here from Switch to Routes */}
          <Route exact path="/" element={<><h1>Welcome to the Home Page</h1> <p>fa23-cs411-team038-XpertzBD LACrimeGuard</p>
            <p>Rubric</p>
            <p>Arriving on time and completing the presentation within the given time frame (+1%)</p>

            <p>A clear demo featuring a user's end-to-end process interacting with the system that involves presenting the CRUD operations, the advanced database program, and the creative function (10%)</p>

            <p>Ability to insert, update, and delete rows from the database and reflect the change on the frontend interface (7%)</p>

            <p>Search the database using a keyword search. Your application should allow the user to input their search keyword and return the result to the interface (5%)</p>

            <p>The advanced database program contains at least a sophisticated transaction+trigger or a stored procedure+trigger (+12%):</p>

            <p>If you implemented transaction+trigger (12%):
              Transaction requirements (8%): A complete and functioning transaction with the correct and justified isolation level (2%), involves at least two advanced queries (2%, 1% each), involves control (e.g., IF statements) structures (2%), and provides useful functionality to the application (2%).
              Trigger requirements (4%): A complete and functioning trigger (1.5%), involves event, condition (IF statement), and action (Update, Insert or Delete) (1.5%), provides useful functionality to the application (1%).</p>

            <p>If you implemented stored procedure+trigger (12%):
              Stored procedure requirements (8%): A complete and functioning stored procedure (2%), involves at least two advanced queries (2%, 1% each), uses cursors, involves looping and control (e.g., IF statements) structures (2%), provides useful functionality to the application (2%).
              Trigger requirements (4%): A complete and functioning trigger (1.5%), involves event, condition (IF statement), and action (Update, Insert or Delete) (1.5%), provides useful functionality to the application (1%).</p>

            <p>Extra Credit: A functioning and interesting creative component that is relevant to your application (up to +2% of the entire project grade)</p>
          </>} /> {/* Change for Route */}
          <Route path="/advancedSQL1" element={<AdvancedSQL1 />} />
          <Route path="/advancedSQL2" element={<AdvancedSQL2 />} />
          <Route path="/summary2" element={<Summary2 />} />
          <Route path="/summary1" element={<Summary1 />} />
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
