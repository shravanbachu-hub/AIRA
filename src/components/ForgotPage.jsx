import React, { useState } from 'react';
import { forgotPassword } from '../lib/api';
import { C, InputField, ErrorMsg, SuccessMsg, Spinner, AuthBackground, LogoHeader, AuthCard, LinkBtn, goldBtnFull } from './SharedUI';

export default function ForgotPage({ goLogin }) {
  const [email, setEmail] = useState(''); const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [loading, setLoading] = useState(false);
  const handleReset = async () => {
    setError(''); setSuccess('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSuccess(`New temporary password sent to ${email.trim().toLowerCase()}. Check your inbox.`);
    } catch (err) { setError(err.error || 'Failed to reset. Try again.'); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight: '100vh', background: C.DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 24 }}>
      <AuthBackground />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, animation: 'fadeSlideUp 0.8s ease forwards' }}>
        <LogoHeader subtitle="Reset Your Password" />
        <AuthCard>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.WHITE, marginBottom: 6 }}>Forgot Password</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginBottom: 28 }}>Enter your email and we'll send a new password</p>
          <InputField icon="✉" label="Registered Email" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} placeholder="you@gmail.com" />
          <ErrorMsg msg={error} /><SuccessMsg msg={success} />
          <button onClick={handleReset} disabled={loading} style={{ ...goldBtnFull, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Spinner /> Sending...</> : 'Reset Password'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY }}>Remember your password? <LinkBtn text="Sign In" onClick={goLogin} /></div>
        </AuthCard>
      </div>
    </div>
  );
}
