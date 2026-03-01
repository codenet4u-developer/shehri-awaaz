import React, { useState } from 'react';

function StatusUpdateModal({ complaint, token, onClose, onStatusUpdated }) {
  const [status, setStatus] = useState(complaint.status);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/complaints/${complaint.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, message }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update complaint');
      }

      onStatusUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, backdropFilter: 'blur(5px)', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.95) 100%)', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(34, 197, 94, 0.2)', animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <h2 style={{ color: '#4ade80', marginTop: 0 }}>Update Complaint Status</h2>
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', animation: 'slideInLeft 0.3s ease-out' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Status*</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = 'none'; }}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Message (Optional)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a message for the user" style={{ width: '100%', padding: '0.75rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', minHeight: '100px', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = 'none'; }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', animation: 'fadeIn 0.5s ease-out 0.2s both' }}>
            <button type="submit" disabled={loading} style={{ flex: 1, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', opacity: loading ? 0.6 : 1, transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }} onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.5)'; } }} onMouseLeave={(e) => { if (!loading) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)'; } }}>
              {loading ? 'Updating...' : 'Update Status'}
            </button>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)', color: '#4ade80', border: '2px solid #22c55e', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)'; }} onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)'; }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StatusUpdateModal;
