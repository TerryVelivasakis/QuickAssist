import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HelpForm from './components/HelpForm';  // Adjust the path as necessary
import AdminPanel from './components/AdminPanel';  // Adjust the path as necessary

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the help form (the room ID is part of the URL) */}
          <Route path="/room/:roomId" element={<HelpForm />} />
          
          {/* Route for the admin panel */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Default route or 404 if needed */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
