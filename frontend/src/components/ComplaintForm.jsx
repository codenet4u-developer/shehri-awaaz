import React, { useState } from 'react';

function ComplaintForm({ token, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('category', formData.category);
      formPayload.append('location', formData.location);
      if (formData.image) {
        formPayload.append('image', formData.image);
      }

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit complaint');
      }

      setFormData({ title: '', description: '', category: '', location: '', image: null });
      onSubmitSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #1a2332 0%, rgba(30, 41, 59, 0.8) 100%)', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
      <h2 style={{ color: '#4ade80' }}>Report a New Issue</h2>
      {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', animation: 'slideInLeft 0.3s ease-out' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Title*</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Brief title of the issue" required style={{ width: '100%', padding: '0.75rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = 'none'; }} />
        </div>

        <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Description*</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed description of the issue" required style={{ width: '100%', padding: '0.75rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', minHeight: '120px', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = 'none'; }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ animation: 'fadeIn 0.5s ease-out 0.2s both' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Category*</label>
            <select name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = 'none'; }}>
              <option value="">Select category</option>
              <option value="Pothole">Pothole</option>
              <option value="Garbage">Garbage Dumping</option>
              <option value="Street Light">Street Light</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Drainage">Drainage</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Location*</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location of the issue" required style={{ width: '100%', padding: '0.75rem', border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '12px', background: '#0f172a', color: '#f3f4f6', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.target.style.boxShadow = 'none'; }} />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease-out 0.4s both' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4ade80' }}>Image (Optional)</label>
          <input type="file" onChange={handleImageChange} accept="image/*" style={{ width: '100%', padding: '0.75rem', border: '2px dashed rgba(34, 197, 94, 0.3)', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.05)', color: '#f3f4f6', cursor: 'pointer', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.background = 'rgba(34, 197, 94, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(34, 197, 94, 0.3)'; e.target.style.background = 'rgba(34, 197, 94, 0.05)'; }} />
          {formData.image && <p style={{ color: '#4ade80', fontSize: '0.875rem', marginTop: '0.5rem', animation: 'slideInLeft 0.3s ease-out' }}>✓ {formData.image.name}</p>}
        </div>

        <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', opacity: loading ? 0.6 : 1, transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)', animation: 'fadeIn 0.5s ease-out 0.5s both' }} onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.5)'; } }} onMouseLeave={(e) => { if (!loading) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)'; } }}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;
