import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Settings from './components/Settings/Settings';
import Monitor from './components/Monitor/Monitor';
import Home from './components/Home/Home';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ margin: '20px', padding: '20px' }}>
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Monitor" element={<Monitor />} />
            <Route path="/Settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
