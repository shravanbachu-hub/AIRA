import React, { useState } from 'react';
import { login } from '../lib/api';
import { C, InputField, ErrorMsg, Spinner, AuthBackground, LogoHeader, AuthCard, LinkBtn, goldBtnFull } from './SharedUI';

export default function LoginPage({ onLogin, goRegister, goForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please enter both email and password'); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      if (err.error === 'PENDING') setError("Your registration is pending admin approval. You'll receive an email once approved.");
      else setError('Invalid email or password.');
      setShake(true); setTimeout(() => setShake(false), 600);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 24 }}>
      <AuthBackground />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, animation: shake ? 'shakeX 0.5s ease' : 'fadeSlideUp 0.8s ease forwards' }}>
        <LogoHeader subtitle="Trader Portal — Sign In" />
        <AuthCard>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.WHITE, marginBottom: 6 }}>Welcome Back</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginBottom: 28 }}>Enter your credentials to access the portal</p>
          <InputField icon="✉" label="Email / Gmail ID" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="you@gmail.com" />
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, display: 'block', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.GRAY, fontSize: 15 }}>🔒</span>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="Enter your password"
                style={{ width: '100%', padding: '14px 50px 14px 44px', background: `${C.DARK}80`, border: `1px solid ${C.DARK3}`, borderRadius: 10, color: C.WHITE, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = C.GOLD + '60'} onBlur={e => e.target.style.borderColor = C.DARK3} />
              <span onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: C.GRAY, cursor: 'pointer', fontSize: 14 }}>{showPw ? '🙈' : '👁'}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -10 }}><LinkBtn text="Forgot Password?" onClick={goForgot} /></div>
          <ErrorMsg msg={error} />
          <button onClick={handleSubmit} disabled={loading} style={{ ...goldBtnFull, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? <><Spinner /> Verifying...</> : 'Sign In'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY }}>Don't have an account? <LinkBtn text="Register" onClick={goRegister} /></div>
        </AuthCard>
      </div>
    </div>
  );
}
