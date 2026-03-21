import React, { useState } from 'react';
import { register } from '../lib/api';
import { C, InputField, ErrorMsg, SuccessMsg, Spinner, AuthBackground, LogoHeader, AuthCard, LinkBtn, goldBtnFull } from './SharedUI';

export default function RegisterPage({ goLogin }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(''); setSuccess('');
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) { setError('All fields are required'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), phone.trim(), password);
      setSuccess("Registration submitted! You'll receive an email once the admin approves your account.");
      setName(''); setEmail(''); setPhone(''); setPassword(''); setConfirm('');
    } catch (err) {
      if (err.error === 'ALREADY_PENDING') setError('Registration already submitted. Awaiting admin approval.');
      else if (err.error === 'ALREADY_EXISTS') setError('This email is already registered.');
      else setError(err.error || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 24 }}>
      <AuthBackground />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, animation: 'fadeSlideUp 0.8s ease forwards' }}>
        <LogoHeader subtitle="Create Your Trader Account" />
        <AuthCard>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.WHITE, marginBottom: 6 }}>Register</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginBottom: 28 }}>Submit your details — admin will review & approve</p>
          <InputField icon="👤" label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
          <InputField icon="✉" label="Gmail / Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" />
          <InputField icon="📱" label="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
          <InputField icon="🔒" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
          <InputField icon="🔒" label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRegister()} placeholder="Re-enter password" />
          <ErrorMsg msg={error} /><SuccessMsg msg={success} />
          <button onClick={handleRegister} disabled={loading} style={{ ...goldBtnFull, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Spinner /> Submitting...</> : 'Submit Registration'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY }}>Already have an account? <LinkBtn text="Sign In" onClick={goLogin} /></div>
        </AuthCard>
      </div>
    </div>
  );
}
