import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';

function Login({ setToken, setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? 'register' : 'login';
      const payload = isSignUp ? formData : { email: formData.email, password: formData.password };

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Authentication failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      navigate(data.user.role === 'admin' ? '/admin-dashboard' : '/citizen-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1a2332 50%, #064e3b 100%)', animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.95) 100%)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(34, 197, 94, 0.2)', animation: 'slideInRight 0.5s ease-out' }}>
        <h1 style={{ marginBottom: '0.5rem', textAlign: 'center', color: '#4ade80', fontSize: '2.5rem', letterSpacing: '-0.02em' }}>Shehri Awaaz</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#94a3b8', fontSize: '1rem', fontWeight: '500' }}>Civic Issue Reporting System</p>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', animation: 'slideInLeft 0.3s ease-out' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required={isSignUp} style={{ width: '100%', padding: '0.875rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', fontSize: '1rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'; }} />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required style={{ width: '100%', padding: '0.875rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', fontSize: '1rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'; }} />
          </div>

          <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out 0.2s both' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required style={{ width: '100%', padding: '0.875rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', fontSize: '1rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'; }} />
          </div>

          {isSignUp && (
            <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out 0.3s both' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Account Type</label>
              <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '0.875rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', fontSize: '1rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'; }}>
                <option value="citizen" style={{ background: '#0f172a', color: '#f3f4f6' }}>Citizen</option>
                <option value="admin" style={{ background: '#0f172a', color: '#f3f4f6' }}>Admin</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)', fontSize: '1rem', animation: 'fadeIn 0.5s ease-out 0.4s both' }} onHover={(e) => { if (!loading) { e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.5)'; e.target.style.transform = 'translateY(-2px)'; } }}>
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8', animation: 'fadeIn 0.6s ease-out 0.5s both' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem', fontWeight: '600', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.color = '#22c55e'; }} onMouseLeave={(e) => { e.target.style.color = '#4ade80'; }}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
