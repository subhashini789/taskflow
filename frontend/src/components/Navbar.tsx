'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setTheme('light');
      document.body.classList.add('theme-light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.body.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    } else {
      setTheme('dark');
      document.body.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    }
  };

  if (!user) return null;

  return (
    <nav className={`glass-panel ${styles.navbar}`}>
      <div className={styles.logo}>TaskFlow</div>
      <div className={styles.userInfo}>
        <button 
          onClick={toggleTheme} 
          style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.badge}>{user.role}</span>
        <button className="btn-primary" onClick={logout} style={{ padding: '6px 12px', fontSize: '14px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
