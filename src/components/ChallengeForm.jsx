import React, { useState } from 'react';
import { submitChallenge } from '../lib/api';
import { C, ErrorMsg, SuccessMsg, Spinner } from './SharedUI';

const goldBtnFull = {
  width: '100%', padding: 16, background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, color: C.DARK,
  border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
  cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: `0 4px 20px ${C.GOLD}30`,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
};

const fieldLabel = {
  fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GOLD, textTransform: 'uppercase',
  letterSpacing: '1.5px', fontWeight: 600, display: 'block', marginBottom: 8,
};

const fieldInput = {
  width: '100%', padding: '14px 16px', background: `${C.DARK}80`, border: `1px solid ${C.DARK3}`,
  borderRadius: 10, color: C.WHITE, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
  outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box',
};

const selectStyle = {
  ...fieldInput, appearance: 'none', WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='%238A8F9E'%3E%3Cpath d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={fieldInput}
      onFocus={e => e.target.style.borderColor = C.GOLD + '60'}
      onBlur={e => e.target.style.borderColor = C.DARK3} />
  );
}

export default function ChallengeForm({ onClose }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', address: '',
    experience: '', platform: '', paymentMethod: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = details, 2 = payment

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const goToPayment = () => {
    setError('');
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('First name and last name are required'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { setError('Valid email address is required'); return; }
    if (!form.address.trim()) { setError('Address is required'); return; }
    if (!form.experience) { setError('Please select your trading experience'); return; }
    if (!form.platform) { setError('Please select a trading platform'); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.paymentMethod) { setError('Please select a payment method'); return; }
    setLoading(true);
    try {
      await submitChallenge(form);
      setSuccess('Challenge application submitted! Check your email for payment instructions.');
    } catch (err) {
      setError(err.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
        background: `linear-gradient(160deg, ${C.DARK2}, ${C.DARK3})`, border: `1px solid ${C.GOLD}25`,
        borderRadius: 20, padding: '40px 36px', position: 'relative',
        animation: 'fadeSlideUp 0.4s ease forwards',
      }}>
        {/* Top gold line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.GOLD}, transparent)` }} />

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 8,
          background: `${C.DARK}80`, border: `1px solid ${C.DARK3}`, color: C.GRAY, fontSize: 18,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, borderRadius: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: C.DARK,
            marginBottom: 14, boxShadow: `0 8px 32px ${C.GOLD}25`,
          }}>A</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.WHITE, marginBottom: 6 }}>
            Start Your <span style={{ color: C.GOLD }}>Challenge</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY }}>
            $200,000 Funded Account — Challenge Fee: $1,050
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {['Your Details', 'Payment'].map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                height: 3, borderRadius: 2, marginBottom: 8,
                background: step > i ? C.GOLD : `${C.DARK3}`,
                transition: 'background 0.3s ease',
              }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                color: step > i ? C.GOLD : C.GRAY, textTransform: 'uppercase', letterSpacing: '1px',
              }}>{label}</span>
            </div>
          ))}
        </div>

        {success ? (
          <div>
            <SuccessMsg msg={success} />
            <div style={{
              background: `${C.GOLD}10`, border: `1px solid ${C.GOLD}25`, borderRadius: 12,
              padding: 24, marginBottom: 24, textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.WHITE, marginBottom: 8 }}>Application Received</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, lineHeight: 1.7 }}>
                Our team will review your application and send payment instructions to <strong style={{ color: C.WHITE }}>{form.email}</strong> within 24 hours.
              </p>
            </div>
            <button onClick={onClose} style={goldBtnFull}>Close</button>
          </div>
        ) : step === 1 ? (
          <div>
            {/* Step 1: Personal details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="First Name">
                <TextInput value={form.firstName} onChange={set('firstName')} placeholder="John" />
              </Field>
              <Field label="Last Name">
                <TextInput value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
              </Field>
            </div>

            <Field label="Email Address">
              <TextInput type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
            </Field>

            <Field label="Full Address">
              <textarea value={form.address} onChange={set('address')} placeholder="Street, City, State, Country, ZIP"
                rows={3} style={{ ...fieldInput, resize: 'vertical', minHeight: 80 }}
                onFocus={e => e.target.style.borderColor = C.GOLD + '60'}
                onBlur={e => e.target.style.borderColor = C.DARK3} />
            </Field>

            <Field label="Years of Trading Experience">
              <select value={form.experience} onChange={set('experience')} style={selectStyle}>
                <option value="" disabled>Select experience</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-2 years">1–2 years</option>
                <option value="3-5 years">3–5 years</option>
                <option value="5-10 years">5–10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </Field>

            <Field label="Trading Platform">
              <div style={{ display: 'flex', gap: 12 }}>
                {['MT5', 'Ninja Trader'].map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, platform: p }))}
                    style={{
                      flex: 1, padding: '14px 16px', borderRadius: 10, fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: form.platform === p ? `${C.GOLD}20` : `${C.DARK}80`,
                      border: `1.5px solid ${form.platform === p ? C.GOLD : C.DARK3}`,
                      color: form.platform === p ? C.GOLD : C.GRAY,
                    }}>
                    {p === 'MT5' ? '📊 ' : '📈 '}{p}
                  </button>
                ))}
              </div>
            </Field>

            <ErrorMsg msg={error} />

            <button onClick={goToPayment} style={goldBtnFull}>
              Continue to Payment →
            </button>
          </div>
        ) : (
          <div>
            {/* Step 2: Payment */}
            <div style={{
              background: `${C.DARK}60`, border: `1px solid ${C.DARK3}`, borderRadius: 12,
              padding: 20, marginBottom: 24,
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GRAY, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Order Summary</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                <span style={{ color: C.GRAY }}>Challenge Fee</span>
                <span style={{ color: C.WHITE, fontWeight: 600 }}>$1,050</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                <span style={{ color: C.GRAY }}>Security Deposit</span>
                <span style={{ color: C.WHITE, fontWeight: 600 }}>9,500 USDT</span>
              </div>
              <div style={{ height: 1, background: C.DARK3, margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                <span style={{ color: C.GRAY }}>Platform</span>
                <span style={{ color: C.GOLD, fontWeight: 600 }}>{form.platform}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                <span style={{ color: C.GRAY }}>Applicant</span>
                <span style={{ color: C.WHITE, fontWeight: 600 }}>{form.firstName} {form.lastName}</span>
              </div>
            </div>

            <Field label="Payment Method">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { value: 'USDT (TRC20)', icon: '💎', desc: 'Tether on TRON — lowest fees' },
                  { value: 'USDT (ERC20)', icon: '⟠', desc: 'Tether on Ethereum' },
                  { value: 'Bitcoin', icon: '₿', desc: 'BTC network' },
                  { value: 'Bank Transfer', icon: '🏦', desc: 'Wire transfer — 2-3 business days' },
                ].map(m => (
                  <button key={m.value}
                    onClick={() => setForm(f => ({ ...f, paymentMethod: m.value }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                      background: form.paymentMethod === m.value ? `${C.GOLD}15` : `${C.DARK}80`,
                      border: `1.5px solid ${form.paymentMethod === m.value ? C.GOLD : C.DARK3}`,
                    }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: form.paymentMethod === m.value ? C.GOLD : C.WHITE }}>{m.value}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GRAY }}>{m.desc}</div>
                    </div>
                    {form.paymentMethod === m.value && (
                      <span style={{ marginLeft: 'auto', color: C.GOLD, fontSize: 16 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </Field>

            <div style={{
              background: `${C.GREEN}10`, border: `1px solid ${C.GREEN}25`, borderRadius: 10,
              padding: '14px 16px', marginBottom: 20,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GREEN, lineHeight: 1.6,
            }}>
              ✓ Challenge fee ($1,050) is <strong>fully refundable</strong> with your first payout<br />
              ✓ Security deposit (9,500 USDT) is <strong>fully refundable</strong> on account closure
            </div>

            <ErrorMsg msg={error} />

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setStep(1); setError(''); }}
                style={{
                  flex: '0 0 auto', padding: '16px 24px', background: `${C.DARK}80`,
                  border: `1px solid ${C.DARK3}`, borderRadius: 10, color: C.GRAY, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
                }}>← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                style={{ ...goldBtnFull, flex: 1, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? <><Spinner /> Submitting...</> : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
