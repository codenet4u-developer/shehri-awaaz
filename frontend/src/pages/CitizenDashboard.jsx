import React, { useState } from 'react';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintList from '../components/ComplaintList';
import Navbar from '../components/Navbar';

function CitizenDashboard({ user, token, onLogout }) {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleComplaintSubmitted = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pk-off-white)' }}>
      {/* Header */}
      <Navbar user={user} onLogout={onLogout} title="Shehri Awaaz" subtitle="Civic Issue Reporting System" />

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
