import React, { useState, useEffect } from 'react';
import ComplaintList from '../components/ComplaintList';
import Analytics from '../components/Analytics';
import Navbar from '../components/Navbar';

function AdminDashboard({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pk-off-white)' }}>
      {/* Header */}
      <Navbar user={user} onLogout={onLogout} title="Shehri Awaaz - Admin" subtitle="Civic Issue Management Dashboard" />

      {/* Navigation */}
      <nav style={{ background: 'var(--pk-card)', borderBottom: '2px solid var(--pk-border)', padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ background: activeTab === 'dashboard' ? 'var(--pk-green)' : 'transparent', color: activeTab === 'dashboard' ? 'white' : 'var(--pk-green)', border: '2px solid var(--pk-green)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { if (activeTab !== 'dashboard') { e.target.style.background = 'var(--pk-shadow)'; } }} onMouseLeave={(e) => { if (activeTab !== 'dashboard') { e.target.style.background = 'transparent'; } }}>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('complaints')} style={{ background: activeTab === 'complaints' ? 'var(--pk-green)' : 'transparent', color: activeTab === 'complaints' ? 'white' : 'var(--pk-green)', border: '2px solid var(--pk-green)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { if (activeTab !== 'complaints') { e.target.style.background = 'var(--pk-shadow)'; } }} onMouseLeave={(e) => { if (activeTab !== 'complaints') { e.target.style.background = 'transparent'; } }}>
            All Issues
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {activeTab === 'dashboard' && <Analytics token={token} />}
        {activeTab === 'complaints' && <ComplaintList token={token} userRole="admin" />}
      </div>
    </div>
  );
}

export default AdminDashboard;
