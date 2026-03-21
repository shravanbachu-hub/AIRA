import React, { useState, useEffect } from 'react';
import { getMe, getToken } from './lib/api';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPage from './components/ForgotPage';
import Dashboard from './components/Dashboard';
import { C, Spinner } from './components/SharedUI';

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing token on load
  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then(u => setUser(u))
        .catch(() => { localStorage.removeItem('aira_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 52, height: 52, background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 26, color: C.DARK }}>A</div>
        <Spinner />
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={() => { setUser(null); setPage('login'); }} />;
  }

  return (
    <>
      {page === 'login' && <LoginPage onLogin={u => setUser(u)} goRegister={() => setPage('register')} goForgot={() => setPage('forgot')} />}
      {page === 'register' && <RegisterPage goLogin={() => setPage('login')} />}
      {page === 'forgot' && <ForgotPage goLogin={() => setPage('login')} />}
    </>
  );
}
