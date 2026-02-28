import React, { useState, useEffect } from 'react';
import StatusUpdateModal from './StatusUpdateModal';

function ComplaintList({ token, userRole, refreshKey }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [refreshKey]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'Pending') return { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#78350f' };
    if (status === 'In Progress') return { background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#164e63' };
    if (status === 'Resolved') return { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#172121' };
    return { background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' };
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleEditStatus = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handleStatusUpdated = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    fetchComplaints();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', animation: 'fadeIn 0.5s ease-out' }}>Loading complaints...</div>;
  if (error) return <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', animation: 'slideInLeft 0.3s ease-out' }}>{error}</div>;

  return (
    <div>
      {complaints.length === 0 ? (
        <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: '#94a3b8', border: '1px solid rgba(34, 197, 94, 0.1)', animation: 'fadeIn 0.5s ease-out' }}>
          No complaints found.
        </div>
      ) : (
        <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(34, 197, 94, 0.1)', overflow: 'hidden', animation: 'slideInRight 0.5s ease-out' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(34, 197, 94, 0.1)', borderBottom: '2px solid rgba(34, 197, 94, 0.3)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4ade80' }}>Title</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4ade80' }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4ade80' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4ade80' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4ade80' }}>Submitted</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4ade80' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, idx) => (
                <tr key={complaint.id} style={{ borderBottom: '1px solid rgba(34, 197, 94, 0.1)', transition: 'all 0.3s ease', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }} onMouseEnter={(e) => { e.target.style.background = 'rgba(34, 197, 94, 0.08)'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}>
                  <td style={{ padding: '1rem', color: '#f3f4f6' }}>{complaint.title}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{complaint.category}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{complaint.location}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ ...getStatusBadgeColor(complaint.status), padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600', display: 'inline-block', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease', cursor: 'default' }}>
                      {complaint.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{new Date(complaint.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <button onClick={() => handleViewDetails(complaint)} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', marginRight: '0.5rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'; }}>
                      View
                    </button>
                    {userRole === 'admin' && (
                      <button onClick={() => handleEditStatus(complaint)} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'; }}>
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {selectedComplaint && !showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.95) 100%)', borderRadius: '12px', padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(34, 197, 94, 0.2)', animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <h2 style={{ color: '#4ade80', marginTop: 0 }}>{selectedComplaint.title}</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              <strong>Category:</strong> {selectedComplaint.category}
            </p>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              <strong>Location:</strong> {selectedComplaint.location}
            </p>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              <strong>Status:</strong>{' '}
              <span
                style={{
                  ...getStatusBadgeColor(selectedComplaint.status),
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                {selectedComplaint.status}
              </span>
            </p>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              <strong>Description:</strong>
            </p>
            <p style={{ color: '#f3f4f6', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{selectedComplaint.description}</p>
            {selectedComplaint.image_path && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                  <strong>Image:</strong>
                </p>
                <img src={`http://localhost:5000${selectedComplaint.image_path}`} alt="Complaint" style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.2)' }} />
              </div>
            )}
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              <strong>Submitted:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}
            </p>
            <button onClick={() => setSelectedComplaint(null)} style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)', color: '#4ade80', border: '2px solid #22c55e', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)'; }} onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)'; }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showModal && <StatusUpdateModal complaint={selectedComplaint} token={token} onClose={() => setShowModal(false)} onStatusUpdated={handleStatusUpdated} />}
    </div>
  );
}

export default ComplaintList;
