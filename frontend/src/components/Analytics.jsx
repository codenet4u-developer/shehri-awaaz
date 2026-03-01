import React, { useState, useEffect } from 'react';

function Analytics({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/complaints/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', animation: 'fadeIn 0.5s ease-out' }}>Loading analytics...</div>;
  if (error) return <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', animation: 'slideInLeft 0.3s ease-out' }}>{error}</div>;

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <h1 style={{ marginBottom: '2rem', color: '#4ade80' }}>Dashboard Analytics</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.1)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', animation: 'fadeIn 0.5s ease-out' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-8px) scale(1.02)'; e.target.style.boxShadow = '0 15px 40px rgba(34, 197, 94, 0.25)'; e.target.style.borderColor = 'rgba(34, 197, 94, 0.3)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'; e.target.style.borderColor = 'rgba(34, 197, 94, 0.1)'; }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Complaints</p>
          <div style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'pulse 2s infinite' }}>{analytics?.total_complaints || 0}</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.2)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', animation: 'fadeIn 0.5s ease-out 0.1s both' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-8px) scale(1.02)'; e.target.style.boxShadow = '0 15px 40px rgba(245, 158, 11, 0.25)'; e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'; e.target.style.borderColor = 'rgba(245, 158, 11, 0.2)'; }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pending</p>
          <div style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'bounce 2s infinite' }}>{analytics?.pending || 0}</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', textAlign: 'center', border: '1px solid rgba(6, 182, 212, 0.2)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', animation: 'fadeIn 0.5s ease-out 0.2s both' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-8px) scale(1.02)'; e.target.style.boxShadow = '0 15px 40px rgba(6, 182, 212, 0.25)'; e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'; e.target.style.borderColor = 'rgba(6, 182, 212, 0.2)'; }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>In Progress</p>
          <div style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'pulse 2s infinite' }}>{analytics?.in_progress || 0}</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.3)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', animation: 'fadeIn 0.5s ease-out 0.3s both' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-8px) scale(1.02)'; e.target.style.boxShadow = '0 15px 40px rgba(34, 197, 94, 0.4)'; e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'; e.target.style.borderColor = 'rgba(34, 197, 94, 0.3)'; }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Resolved</p>
          <div style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'glow 2s infinite' }}>{analytics?.resolved || 0}</div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(34, 197, 94, 0.1)', animation: 'slideInRight 0.5s ease-out' }}>
        <h2 style={{ color: '#4ade80', marginTop: 0 }}>Completion Rate</h2>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', overflow: 'hidden', height: '50px', border: '2px solid rgba(34, 197, 94, 0.2)' }}>
            <div
              style={{
                background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #22c55e 100%)',
                height: '100%',
                width: `${analytics?.total_complaints > 0 ? ((analytics?.resolved || 0) / analytics?.total_complaints) * 100 : 0}%`,
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '1rem',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                position: 'relative',
                boxShadow: 'inset 0 0 20px rgba(34, 197, 94, 0.3)',
              }}
            >
              {analytics?.total_complaints > 0 ? Math.round(((analytics?.resolved || 0) / analytics?.total_complaints) * 100) : 0}%
            </div>
          </div>
          <p style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
            {analytics?.resolved || 0} of {analytics?.total_complaints || 0} complaints resolved
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
