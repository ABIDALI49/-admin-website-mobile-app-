import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/adminlogin';
import Dashboard from './pages/dashboard';
import Appointments from './pages/appointment';
import HelpRequests from './pages/helprequest';

import Layout from '../src/components/layout'; // ⬅️ sidebar layout wrapper

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AdminLogin />} />

        {/* Protected Routes with Sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/helprequests" element={<HelpRequests />} />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
