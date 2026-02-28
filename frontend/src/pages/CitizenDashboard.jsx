import React, { useState } from 'react';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintList from '../components/ComplaintList';

function CitizenDashboard({ user, token, onLogout }) {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleComplaintSubmitted = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1a2332 50%, #064e3b 100%)' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', padding: '1.5rem', borderBottom: '2px solid rgba(34, 197, 94, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ animation: 'slideInLeft 0.5s ease-out' }}>
            <h1 style={{ margin: 0, marginBottom: '0.25rem', color: '#4ade80' }}>Shehri Awaaz</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>Civic Issue Reporting System</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', animation: 'slideInRight 0.5s ease-out' }}>
            <div>
              <p style={{ margin: 0, color: '#4ade80' }}>{user.name}</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{user.email}</p>
            </div>
            <button onClick={onLogout} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)'; }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Action Buttons */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', animation: 'fadeIn 0.6s ease-out' }}>
          <button onClick={() => setShowForm(!showForm)} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)'; }}>
            {showForm ? '✕ Cancel' : '+ Report New Issue'}
          </button>
        </div>

        {/* Complaint Form */}
        {showForm && <ComplaintForm token={token} onSubmitSuccess={handleComplaintSubmitted} />}

        {/* Complaints List */}
        <ComplaintList token={token} userRole="citizen" refreshKey={refreshKey} />
      </div>
    </div>
  );
}

export default CitizenDashboard;
