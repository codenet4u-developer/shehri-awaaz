import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route
          path="/citizen-dashboard"
          element={token && user?.role === 'citizen' ? <CitizenDashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin-dashboard"
          element={token && user?.role === 'admin' ? <AdminDashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={token ? <Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/citizen-dashboard'} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
