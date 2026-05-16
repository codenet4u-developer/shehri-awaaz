import React, { useState, useEffect } from 'react';

function Navbar({ user, onLogout, title, subtitle }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('shehri-theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('shehri-theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <header style={{ background: 'var(--pk-green)', padding: '1.5rem', borderBottom: '2px solid var(--pk-border)', boxShadow: '0 8px 32px var(--pk-shadow)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', animation: 'slideInLeft 0.5s ease-out' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Emblem_of_Pakistan.svg" 
            alt="Government of Pakistan Emblem"
            style={{ height: '50px', filter: 'brightness(0) invert(1)' }}
          />
          <div>
            <h1 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--pk-white)', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '1.5rem' }}>
              <span>شہری آواز</span>
              <span style={{ fontWeight: 'normal', opacity: 0.5 }}>|</span>
              <span>Shehri Awaaz</span>
              {title && title !== 'Shehri Awaaz' && <span>- {title.replace('Shehri Awaaz - ', '')}</span>}
            </h1>
            <p style={{ margin: 0, color: 'var(--pk-white)', fontSize: '0.875rem', opacity: 0.9 }}>{subtitle}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', animation: 'slideInRight 0.5s ease-out' }}>
          <button className="dark-mode-btn" onClick={toggleDarkMode}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: 'var(--pk-white)', fontWeight: 'bold' }}>{user.name}</p>
            <p style={{ margin: 0, color: 'var(--pk-white)', fontSize: '0.875rem', opacity: 0.9 }}>{user.email}</p>
          </div>
          <button onClick={onLogout} style={{ background: 'var(--pk-white)', color: 'var(--pk-green)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease' }}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
