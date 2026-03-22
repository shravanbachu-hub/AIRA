// import React, { useState, useEffect, useRef } from 'react';
// import { logout, getPending } from '../lib/api';
// import AdminPanel from './AdminPanel';
// import { C } from './SharedUI';
// import ChallengeForm from './ChallengeForm';

// const ADMIN_EMAIL = 'admin@airapropfirm.com';

// const rules = [
//   { label: 'Account Size', value: '$200,000' }, { label: 'Challenge Fee', value: '$1,050 (Refundable)' },
//   { label: 'Security Deposit', value: '9,500 USDT (Refundable)' }, { label: 'Profit Target Phase 1', value: '8% ($16,000)' },
//   { label: 'Profit Target Phase 2', value: '5% ($10,000)' }, { label: 'Max Daily Loss', value: '5% ($10,000)' },
//   { label: 'Max Overall Loss', value: '10% ($20,000)' }, { label: 'Min Trading Days', value: '5 Days per Phase' },
//   { label: 'Time Limit', value: 'P1: 30 Days · P2: 60 Days' }, { label: 'Profit Split', value: '80% / 20%' },
//   { label: 'Scaling Plan', value: 'Up to 90%' }, { label: 'Leverage', value: '1:100' },
//   { label: 'MT5 Logins', value: 'Single Session Only' }, { label: 'Mobile Trading', value: 'Not Permitted' },
// ];
// const steps = [
//   { num: '01', title: 'Register & Pay', desc: 'Pay the $1,050 challenge fee + 9,500 USDT security deposit. Both fully refundable.' },
//   { num: '02', title: 'Pass Phase 1', desc: 'Hit 8% profit target within 30 days. Min 5 trading days.' },
//   { num: '03', title: 'Pass Phase 2', desc: 'Achieve 5% profit target within 60 days. Same risk rules.' },
//   { num: '04', title: 'Get Funded', desc: 'Receive your $200,000 funded account. Fee refunded with first payout.' },
// ];
// const faqs = [
//   { q: 'What instruments can I trade?', a: 'Forex pairs, Gold (XAUUSD), Indices, and Commodities.' },
//   { q: 'Is the challenge fee refundable?', a: 'Yes. $1,050 is fully refunded with your first profit split after passing.' },
//   { q: 'What is the security deposit for?', a: '9,500 USDT is held as collateral. Fully refunded on account closure or violation.' },
//   { q: 'Can I hold trades over the weekend?', a: 'Yes, weekend holding is allowed. Be mindful of gap risk.' },
//   { q: 'What platform do I trade on?', a: 'We provide accounts on MetaTrader 5 (MT5). Login credentials are provided by AiraPropFirm upon account activation. You must only use the MT5 credentials we provide.' },
//   { q: 'Can I trade from my mobile phone?', a: 'No. Mobile trading is strictly prohibited. You must trade exclusively from a desktop or laptop using the MT5 Desktop terminal. Any mobile login detected will be treated as a rule violation.' },
//   { q: 'Can I log into MT5 from multiple devices?', a: 'No. Multiple simultaneous MT5 logins are strictly prohibited. You are allowed only ONE active MT5 session at a time. Logging in from a second device while already logged in is considered a violation and may result in immediate account termination.' },
//   { q: 'Are EAs and bots allowed?', a: "Yes, as long as they don't exploit platform inefficiencies (latency arbitrage, tick scalping, etc)." },
//   { q: 'What happens if I violate a rule?', a: 'If any rule is breached (daily loss, max loss, multiple MT5 logins, mobile trading, or restricted strategies), the account is terminated. Your 9,500 USDT security deposit is returned within 5 business days.' },
// ];
// const payouts = [
//   { milestone: 'First Payout', split: '80%', note: 'Challenge fee refunded' },
//   { milestone: '$25K Profit', split: '85%', note: 'Scaling unlocked' },
//   { milestone: '$50K Profit', split: '90%', note: 'Max split achieved' },
// ];

// function AnimatedCounter({ target, prefix = '', suffix = '' }) {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null); const started = useRef(false);
//   useEffect(() => {
//     const obs = new IntersectionObserver(([e]) => {
//       if (e.isIntersecting && !started.current) {
//         started.current = true; let s = 0;
//         const step = (ts) => { if (!s) s = ts; const p = Math.min((ts - s) / 1800, 1); setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(step); };
//         requestAnimationFrame(step);
//       }
//     }, { threshold: 0.3 });
//     if (ref.current) obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, [target]);
//   return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
// }

// function FAQItem({ q, a, isOpen, onClick }) {
//   return (
//     <div onClick={onClick} style={{ borderBottom: `1px solid ${C.DARK3}`, padding: '20px 0', cursor: 'pointer' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <span style={{ color: C.WHITE, fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{q}</span>
//         <span style={{ color: C.GOLD, fontSize: 22, transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0, marginLeft: 16 }}>+</span>
//       </div>
//       <div style={{ maxHeight: isOpen ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
//         <p style={{ color: C.GRAY, fontSize: 14, lineHeight: 1.7, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
//       </div>
//     </div>
//   );
// }

// export default function Dashboard({ user, onLogout }) {
//   const [openFaq, setOpenFaq] = useState(null);
//   const [showAdmin, setShowAdmin] = useState(false);
//   const [showChallenge, setShowChallenge] = useState(false);
//   const [pendingCount, setPendingCount] = useState(0);
//   const userEmail = user?.email || '';
//   const isAdmin = userEmail === ADMIN_EMAIL;

//   useEffect(() => {
//     if (isAdmin) getPending().then(p => setPendingCount(p.length)).catch(() => {});
//   }, [isAdmin, showAdmin]);

//   const handleLogout = async () => { await logout(); onLogout(); };

//   const sec = { padding: '100px 24px', maxWidth: 1200, margin: '0 auto' };
//   const st = { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', color: C.WHITE, marginBottom: 12, fontWeight: 700 };
//   const gb = { background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, color: C.DARK, border: 'none', padding: '16px 40px', fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", borderRadius: 6, cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: `0 4px 20px ${C.GOLD}33` };
//   const ob = { background: 'transparent', color: C.GOLD, border: `1.5px solid ${C.GOLD}`, padding: '16px 40px', fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", borderRadius: 6, cursor: 'pointer', textTransform: 'uppercase' };

//   return (
//     <div style={{ background: C.DARK, minHeight: '100vh', color: C.WHITE, overflowX: 'hidden' }}>
//       {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
//       {showChallenge && <ChallengeForm onClose={() => setShowChallenge(false)} />}

//       {/* NAV */}
//       <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${C.DARK}EE`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.DARK3}` }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 17, color: C.DARK }}>A</div>
//           <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700 }}>Aira<span style={{ color: C.GOLD }}>PropFirm</span></span>
//         </div>
//         <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, flexWrap: 'wrap' }}>
//           {['How It Works', 'Rules', 'Payouts', 'FAQ'].map(t => (
//             <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`} style={{ color: C.GRAY, textDecoration: 'none' }}>{t}</a>
//           ))}
//           {isAdmin && (
//             <button onClick={() => setShowAdmin(true)} style={{ position: 'relative', padding: '8px 16px', background: `${C.GOLD}15`, border: `1px solid ${C.GOLD}30`, borderRadius: 8, color: C.GOLD, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
//               Admin Panel
//               {pendingCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: C.RED, borderRadius: '50%', color: C.WHITE, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingCount}</span>}
//             </button>
//           )}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px 4px 4px', background: `${C.DARK3}90`, borderRadius: 100, border: `1px solid ${C.DARK3}` }}>
//             <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${C.GOLD}50, ${C.GOLD}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.GOLD }}>{userEmail.charAt(0).toUpperCase()}</div>
//             <span style={{ fontSize: 11, color: C.GRAY, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</span>
//             <span onClick={handleLogout} style={{ color: `${C.RED}CC`, fontSize: 11, cursor: 'pointer', fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: `${C.RED}10`, textTransform: 'uppercase' }}>Logout</span>
//           </div>
//         </div>
//       </nav>

//       {/* HERO */}
//       <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${C.GOLD}08 0%, transparent 60%)` }} />
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.DARK3}40 1px, transparent 1px), linear-gradient(90deg, ${C.DARK3}40 1px, transparent 1px)`, backgroundSize: '80px 80px', opacity: 0.3 }} />
//         <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
//           <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${C.GOLD}15`, border: `1px solid ${C.GOLD}30`, borderRadius: 100, padding: '8px 20px', marginBottom: 32, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
//             <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.GREEN, display: 'inline-block', animation: 'pulse 2s infinite' }} />Now Accepting Applications
//           </div>
//           <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
//             Trade With <span style={{ background: `linear-gradient(135deg, ${C.GOLD}, ${C.GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$200,000</span><br />Of Our Capital
//           </h1>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(16px, 2vw, 20px)', color: C.GRAY, maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>Prove your edge in our 2-phase evaluation. Get funded, keep up to 90% of profits. Dubai, UAE.</p>
//           <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
//             <button style={gb} onClick={() => {
//               console.log('Show Challenge button clicked \n\n');
//               setShowChallenge(true)}
//             }  
//             >Start Challenge — $1,050</button>
//             <button style={ob}>View Rules</button>
//           </div>
//           <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap' }}>
//             {[{ n: 200000, p: '$', s: '', l: 'Funded Capital' }, { n: 4200, p: '', s: '+', l: 'Funded Traders' }, { n: 12, p: '$', s: 'M+', l: 'Payouts Processed' }].map((s, i) => (
//               <div key={i} style={{ textAlign: 'center' }}>
//                 <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: C.GOLD }}><AnimatedCounter target={s.n} prefix={s.p} suffix={s.s} /></div>
//                 <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{s.l}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section id="how-it-works" style={{ ...sec, paddingTop: 60 }}>
//         <div style={{ textAlign: 'center', marginBottom: 64 }}>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>How It Works</p>
//           <h2 style={st}>Four Steps to Funding</h2>
//         </div>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
//           {steps.map((s, i) => (
//             <div key={i} style={{ background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12, padding: '36px 28px', position: 'relative', transition: 'all 0.3s ease' }}
//               onMouseEnter={e => { e.currentTarget.style.borderColor = C.GOLD + '60'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = C.DARK3; e.currentTarget.style.transform = 'translateY(0)'; }}>
//               <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 800, color: `${C.GOLD}15`, position: 'absolute', top: 16, right: 24 }}>{s.num}</div>
//               <div style={{ width: 40, height: 3, background: C.GOLD, borderRadius: 2, marginBottom: 20 }} />
//               <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
//               <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, lineHeight: 1.7 }}>{s.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* PRICING */}
//       <section style={sec}>
//         <div style={{ textAlign: 'center', marginBottom: 64 }}>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Challenge Account</p>
//           <h2 style={st}>$200,000 Funded Account</h2>
//         </div>
//         <div style={{ maxWidth: 520, margin: '0 auto', background: `linear-gradient(160deg, ${C.DARK2}, ${C.DARK3})`, border: `1.5px solid ${C.GOLD}40`, borderRadius: 20, padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
//           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.GOLD}, transparent)` }} />
//           <div style={{ textAlign: 'center', marginBottom: 36 }}>
//             <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8, fontWeight: 600 }}>Challenge Fee</div>
//             <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 800, color: C.WHITE }}>$1,050</div>
//             <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GREEN, fontWeight: 500 }}>✓ Fully Refundable After Passing</div>
//           </div>
//           <div style={{ background: `${C.GOLD}10`, border: `1px solid ${C.GOLD}25`, borderRadius: 12, padding: 20, marginBottom: 32, textAlign: 'center' }}>
//             <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontWeight: 600 }}>Security Deposit</div>
//             <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.WHITE }}>9,500 USDT</div>
//             <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginTop: 4 }}>Refundable on closure or violation</div>
//           </div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//             {[['Account Size', '$200,000'], ['Profit Split', 'Up to 90%'], ['Leverage', '1:100'], ['Platform', 'MT5 (Provided by us)'], ['Daily Loss', '5%'], ['Max Drawdown', '10%']].map(([l, v], i) => (
//               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: '8px 0', borderBottom: i < 5 ? `1px solid ${C.DARK3}` : 'none' }}>
//                 <span style={{ color: C.GRAY }}>{l}</span><span style={{ color: C.WHITE, fontWeight: 600 }}>{v}</span>
//               </div>
//             ))}
//           </div>
//           <button style={{ ...gb, width: '100%', marginTop: 32, padding: 18, fontSize: 16 }} onClick={() => setShowChallenge(true)}>Start Challenge Now</button>
//         </div>
//       </section>

//       {/* RULES */}
//       <section id="rules" style={sec}>
//         <div style={{ textAlign: 'center', marginBottom: 64 }}>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Trading Rules</p>
//           <h2 style={st}>Challenge Parameters</h2>
//         </div>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
//           {rules.map((r, i) => (
//             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 10, padding: '20px 24px' }}>
//               <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY }}>{r.label}</span>
//               <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.WHITE, fontWeight: 600, textAlign: 'right' }}>{r.value}</span>
//             </div>
//           ))}
//         </div>
//         <div style={{ maxWidth: 900, margin: '48px auto 0', background: `${C.RED}08`, border: `1px solid ${C.RED}25`, borderRadius: 12, padding: '28px 32px' }}>
//           <h4 style={{ fontFamily: "'DM Sans', sans-serif", color: C.RED, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>⚠ Prohibited Activities — Immediate Violation</h4>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY }}>
//             {['Multiple MT5 logins (1 session only)', 'Mobile / tablet MT5 login', 'Sharing MT5 credentials', 'Latency arbitrage', 'Tick scalping / HFT exploits', 'Copy trading from other prop accounts', 'Cross-account hedging', 'Martingale / grid without SL', 'News straddle exploitation'].map((t, i) => (
//               <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ color: C.RED }}>✕</span>{t}</div>
//             ))}
//           </div>
//         </div>
//         <div style={{ maxWidth: 900, margin: '24px auto 0', background: `${C.GOLD}08`, border: `1px solid ${C.GOLD}25`, borderRadius: 12, padding: '24px 32px' }}>
//           <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
//             <span style={{ fontSize: 24, flexShrink: 0 }}>🖥️</span>
//             <div>
//               <h4 style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>MT5 Login Policy — Desktop Only, Single Session</h4>
//               <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, lineHeight: 1.7 }}>
//                 Your MT5 login credentials are provided by AiraPropFirm. You must only log in from <strong style={{ color: C.WHITE }}>one device at a time</strong> using the <strong style={{ color: C.WHITE }}>MT5 Desktop terminal</strong>.
//                 Multiple simultaneous logins, mobile logins, or sharing your credentials is <strong style={{ color: C.RED }}>strictly prohibited</strong> and will be treated as an <strong style={{ color: C.RED }}>immediate account violation</strong>,
//                 resulting in account termination.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* PAYOUTS */}
//       <section id="payouts" style={sec}>
//         <div style={{ textAlign: 'center', marginBottom: 64 }}>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Profit Sharing</p>
//           <h2 style={st}>Payout & Scaling Plan</h2>
//         </div>
//         <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
//           {payouts.map((p, i) => (
//             <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center', background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12, padding: '28px 32px' }}>
//               <div>
//                 <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.WHITE }}>{p.milestone}</div>
//                 <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginTop: 4 }}>{p.note}</div>
//               </div>
//               <div style={{ width: 1, height: 40, background: C.DARK3 }} />
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: C.GOLD }}>{p.split}</div>
//                 <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GRAY, textTransform: 'uppercase', letterSpacing: '1px' }}>Profit Split</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* FAQ */}
//       <section id="faq" style={sec}>
//         <div style={{ textAlign: 'center', marginBottom: 64 }}>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>FAQ</p>
//           <h2 style={st}>Frequently Asked Questions</h2>
//         </div>
//         <div style={{ maxWidth: 750, margin: '0 auto' }}>
//           {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />)}
//         </div>
//       </section>

//       {/* CTA */}
//       <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative' }}>
//         <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${C.GOLD}0A 0%, transparent 60%)` }} />
//         <div style={{ position: 'relative', zIndex: 1 }}>
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 20 }}>Ready to Prove Your <span style={{ color: C.GOLD }}>Edge</span>?</h2>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: C.GRAY, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>Start your challenge today and trade with $200,000.</p>
//           <button style={{ ...gb, padding: '20px 56px', fontSize: 16 }}>Start Your Challenge</button>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer style={{ borderTop: `1px solid ${C.DARK3}`, padding: '64px 24px 32px' }}>
//         <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>
//           <div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
//               <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 16, color: C.DARK }}>A</div>
//               <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Aira<span style={{ color: C.GOLD }}>PropFirm</span></span>
//             </div>
//             <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, lineHeight: 1.7, maxWidth: 280 }}>Proprietary trading firm providing capital to skilled traders worldwide.</p>
//           </div>
//           <div>
//             <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16, fontWeight: 600 }}>Contact</h4>
//             <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, lineHeight: 2 }}>
//               <div>support@airapropfirm.com</div>
//               <div>+971 4 568 7200</div>
//               <div style={{ marginTop: 8, lineHeight: 1.6 }}>Office 2104, Level 21<br />Boulevard Plaza Tower 1<br />Downtown Dubai, UAE</div>
//             </div>
//           </div>
//           <div>
//             <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16, fontWeight: 600 }}>Legal</h4>
//             {['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Refund Policy'].map(t => (
//               <a key={t} href="#" style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, textDecoration: 'none', marginBottom: 10 }}>{t}</a>
//             ))}
//           </div>
//         </div>
//         <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '24px 0', borderTop: `1px solid ${C.DARK3}` }}>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: `${C.GRAY}99`, lineHeight: 1.8, textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
//             <strong style={{ color: C.GRAY }}>Risk Disclosure:</strong> Trading carries high risk. AiraPropFirm provides simulated funded accounts. Past performance ≠ future results. AiraPropFirm Trading DMCC, DMCC, UAE. License: DMCC-12847.
//           </p>
//           <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: `${C.GRAY}80`, textAlign: 'center', marginTop: 24 }}>© 2026 AiraPropFirm Trading DMCC. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';
import { logout, getPending } from '../lib/api';
import AdminPanel from './AdminPanel';
import { C } from './SharedUI';
import ChallengeForm from './ChallengeForm';

const ADMIN_EMAIL = 'admin@airapropfirm.com';

const rules = [
  { label: 'Account Size', value: '$200,000' }, { label: 'Challenge Fee', value: '$1,050 (Refundable)' },
  { label: 'Security Deposit', value: '9,500 USDT (Refundable)' }, { label: 'Profit Target Phase 1', value: '8% ($16,000)' },
  { label: 'Profit Target Phase 2', value: '5% ($10,000)' }, { label: 'Max Daily Loss', value: '5% ($10,000)' },
  { label: 'Max Overall Loss', value: '10% ($20,000)' }, { label: 'Min Trading Days', value: '5 Days per Phase' },
  { label: 'Time Limit', value: 'P1: 30 Days · P2: 60 Days' }, { label: 'Profit Split', value: '80% / 20%' },
  { label: 'Scaling Plan', value: 'Up to 90%' }, { label: 'Leverage', value: '1:100' },
  { label: 'MT5 Logins', value: 'Single Session Only' }, { label: 'Mobile Trading', value: 'Not Permitted' },
];
const steps = [
  { num: '01', title: 'Register & Pay', desc: 'Pay the $1,050 challenge fee + 9,500 USDT security deposit. Both fully refundable.' },
  { num: '02', title: 'Pass Phase 1', desc: 'Hit 8% profit target within 30 days. Min 5 trading days.' },
  { num: '03', title: 'Pass Phase 2', desc: 'Achieve 5% profit target within 60 days. Same risk rules.' },
  { num: '04', title: 'Get Funded', desc: 'Receive your $200,000 funded account. Fee refunded with first payout.' },
];
const faqs = [
  { q: 'What instruments can I trade?', a: 'Forex pairs, Gold (XAUUSD), Indices, and Commodities.' },
  { q: 'Is the challenge fee refundable?', a: 'Yes. $1,050 is fully refunded with your first profit split after passing.' },
  { q: 'What is the security deposit for?', a: '9,500 USDT is held as collateral. Fully refunded on account closure or violation.' },
  { q: 'Can I hold trades over the weekend?', a: 'Yes, weekend holding is allowed. Be mindful of gap risk.' },
  { q: 'What platform do I trade on?', a: 'We provide accounts on MetaTrader 5 (MT5). Login credentials are provided by AiraPropFirm upon account activation. You must only use the MT5 credentials we provide.' },
  { q: 'Can I trade from my mobile phone?', a: 'No. Mobile trading is strictly prohibited. You must trade exclusively from a desktop or laptop using the MT5 Desktop terminal. Any mobile login detected will be treated as a rule violation.' },
  { q: 'Can I log into MT5 from multiple devices?', a: 'No. Multiple simultaneous MT5 logins are strictly prohibited. You are allowed only ONE active MT5 session at a time. Logging in from a second device while already logged in is considered a violation and may result in immediate account termination.' },
  { q: 'Are EAs and bots allowed?', a: "Yes, as long as they don't exploit platform inefficiencies (latency arbitrage, tick scalping, etc)." },
  { q: 'What happens if I violate a rule?', a: 'If any rule is breached (daily loss, max loss, multiple MT5 logins, mobile trading, or restricted strategies), the account is terminated. Your 9,500 USDT security deposit is returned within 5 business days.' },
];
const payouts = [
  { milestone: 'First Payout', split: '80%', note: 'Challenge fee refunded' },
  { milestone: '$25K Profit', split: '85%', note: 'Scaling unlocked' },
  { milestone: '$50K Profit', split: '90%', note: 'Max split achieved' },
];

function AnimatedCounter({ target, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null); const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true; let s = 0;
        const step = (ts) => { if (!s) s = ts; const p = Math.min((ts - s) / 1800, 1); setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div onClick={onClick} style={{ borderBottom: `1px solid ${C.DARK3}`, padding: '20px 0', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: C.WHITE, fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{q}</span>
        <span style={{ color: C.GOLD, fontSize: 22, transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0, marginLeft: 16 }}>+</span>
      </div>
      <div style={{ maxHeight: isOpen ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
        <p style={{ color: C.GRAY, fontSize: 14, lineHeight: 1.7, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
      </div>
    </div>
  );
}

function HamburgerIcon({ open }) {
  const bar = { width: 20, height: 2, background: C.GOLD, borderRadius: 2, transition: 'all 0.3s ease' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer', padding: 4 }}>
      <div style={{ ...bar, transform: open ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
      <div style={{ ...bar, opacity: open ? 0 : 1 }} />
      <div style={{ ...bar, transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
    </div>
  );
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

export default function Dashboard({ user, onLogout }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const userEmail = user?.email || '';
  const isAdmin = userEmail === ADMIN_EMAIL;
  const width = useWindowWidth();
  const isMobile = width < 768;

  useEffect(() => {
    if (isAdmin) getPending().then(p => setPendingCount(p.length)).catch(() => {});
  }, [isAdmin, showAdmin]);

  useEffect(() => {
    if (!isMobile) setMobileMenu(false);
  }, [isMobile]);

  const handleLogout = async () => { await logout(); onLogout(); };

  const sec = { padding: isMobile ? '60px 16px' : '100px 24px', maxWidth: 1200, margin: '0 auto' };
  const st = { fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 'clamp(24px, 6vw, 36px)' : 'clamp(28px, 5vw, 44px)', color: C.WHITE, marginBottom: 12, fontWeight: 700 };
  const gb = { background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, color: C.DARK, border: 'none', padding: isMobile ? '14px 28px' : '16px 40px', fontSize: isMobile ? 14 : 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", borderRadius: 6, cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: `0 4px 20px ${C.GOLD}33` };
  const ob = { background: 'transparent', color: C.GOLD, border: `1.5px solid ${C.GOLD}`, padding: isMobile ? '14px 28px' : '16px 40px', fontSize: isMobile ? 14 : 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", borderRadius: 6, cursor: 'pointer', textTransform: 'uppercase' };

  return (
    <div style={{ background: C.DARK, minHeight: '100vh', color: C.WHITE, overflowX: 'hidden' }}>
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      {showChallenge && <ChallengeForm onClose={() => setShowChallenge(false)} />}

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: isMobile ? '10px 16px' : '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.DARK}EE`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.DARK3}`,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: isMobile ? 15 : 17, color: C.DARK }}>A</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 16 : 19, fontWeight: 700 }}>Aira<span style={{ color: C.GOLD }}>PropFirm</span></span>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>
            {['How It Works', 'Rules', 'Payouts', 'FAQ'].map(t => (
              <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`} style={{ color: C.GRAY, textDecoration: 'none' }}>{t}</a>
            ))}
            {isAdmin && (
              <button onClick={() => setShowAdmin(true)} style={{ position: 'relative', padding: '8px 16px', background: `${C.GOLD}15`, border: `1px solid ${C.GOLD}30`, borderRadius: 8, color: C.GOLD, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                Admin Panel
                {pendingCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: C.RED, borderRadius: '50%', color: C.WHITE, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingCount}</span>}
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px 4px 4px', background: `${C.DARK3}90`, borderRadius: 100, border: `1px solid ${C.DARK3}` }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${C.GOLD}50, ${C.GOLD}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.GOLD }}>{userEmail.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize: 11, color: C.GRAY, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</span>
              <span onClick={handleLogout} style={{ color: `${C.RED}CC`, fontSize: 11, cursor: 'pointer', fontWeight: 600, padding: '3px 8px', borderRadius: 5, background: `${C.RED}10`, textTransform: 'uppercase' }}>Logout</span>
            </div>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAdmin && (
              <button onClick={() => { setShowAdmin(true); setMobileMenu(false); }} style={{ position: 'relative', padding: '6px 10px', background: `${C.GOLD}15`, border: `1px solid ${C.GOLD}30`, borderRadius: 6, color: C.GOLD, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                Admin
                {pendingCount > 0 && <span style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, background: C.RED, borderRadius: '50%', color: C.WHITE, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingCount}</span>}
              </button>
            )}
            <div onClick={() => setMobileMenu(!mobileMenu)}>
              <HamburgerIcon open={mobileMenu} />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: isMobile ? 52 : 58, left: 0, right: 0, zIndex: 999,
          background: `${C.DARK2}F8`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.DARK3}`,
          maxHeight: mobileMenu ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease',
        }}>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['How It Works', 'Rules', 'Payouts', 'FAQ'].map(t => (
              <a key={t} href={`#${t.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMobileMenu(false)}
                style={{ color: C.GRAY, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, padding: '12px 0', borderBottom: `1px solid ${C.DARK3}30` }}>{t}</a>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${C.GOLD}50, ${C.GOLD}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.GOLD }}>{userEmail.charAt(0).toUpperCase()}</div>
                <span style={{ fontSize: 12, color: C.GRAY, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>{userEmail}</span>
              </div>
              <span onClick={() => { handleLogout(); setMobileMenu(false); }}
                style={{ color: `${C.RED}CC`, fontSize: 12, cursor: 'pointer', fontWeight: 600, padding: '6px 12px', borderRadius: 6, background: `${C.RED}10`, textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Logout</span>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: isMobile ? '100px 16px 60px' : '120px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${C.GOLD}08 0%, transparent 60%)` }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.DARK3}40 1px, transparent 1px), linear-gradient(90deg, ${C.DARK3}40 1px, transparent 1px)`, backgroundSize: '80px 80px', opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${C.GOLD}15`, border: `1px solid ${C.GOLD}30`, borderRadius: 100, padding: isMobile ? '6px 14px' : '8px 20px', marginBottom: isMobile ? 20 : 32, fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 11 : 13, color: C.GOLD, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.GREEN, display: 'inline-block', animation: 'pulse 2s infinite' }} />Now Accepting Applications
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : 'clamp(36px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: isMobile ? 16 : 24 }}>
            Trade With <span style={{ background: `linear-gradient(135deg, ${C.GOLD}, ${C.GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$200,000</span><br />Of Our Capital
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 14 : 'clamp(16px, 2vw, 20px)', color: C.GRAY, maxWidth: 600, margin: isMobile ? '0 auto 32px' : '0 auto 48px', lineHeight: 1.7 }}>Prove your edge in our 2-phase evaluation. Get funded, keep up to 90% of profits. Dubai, UAE.</p>
          <div style={{ display: 'flex', gap: isMobile ? 10 : 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={gb} onClick={() => setShowChallenge(true)}>Start Challenge — $1,050</button>
            <button style={ob} onClick={() => document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' })}>View Rules</button>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 20 : 48, justifyContent: 'center', marginTop: isMobile ? 48 : 72, flexWrap: 'wrap' }}>
            {[{ n: 200000, p: '$', s: '', l: 'Funded Capital' }, { n: 4200, p: '', s: '+', l: 'Funded Traders' }, { n: 12, p: '$', s: 'M+', l: 'Payouts Processed' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', minWidth: isMobile ? 90 : 'auto' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 'clamp(20px, 5vw, 28px)' : 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: C.GOLD }}><AnimatedCounter target={s.n} prefix={s.p} suffix={s.s} /></div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 10 : 13, color: C.GRAY, marginTop: 4, textTransform: 'uppercase', letterSpacing: isMobile ? '1px' : '1.5px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ ...sec, paddingTop: isMobile ? 40 : 60 }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 64 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: isMobile ? 11 : 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>How It Works</p>
          <h2 style={st}>Four Steps to Funding</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: isMobile ? 16 : 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12, padding: isMobile ? '28px 20px' : '36px 28px', position: 'relative', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.borderColor = C.GOLD + '60'; e.currentTarget.style.transform = 'translateY(-4px)'; } }}
              onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.borderColor = C.DARK3; e.currentTarget.style.transform = 'translateY(0)'; } }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 36 : 48, fontWeight: 800, color: `${C.GOLD}15`, position: 'absolute', top: 12, right: 20 }}>{s.num}</div>
              <div style={{ width: 40, height: 3, background: C.GOLD, borderRadius: 2, marginBottom: 16 }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 18 : 22, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 13 : 14, color: C.GRAY, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={sec}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 64 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: isMobile ? 11 : 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Challenge Account</p>
          <h2 style={st}>$200,000 Funded Account</h2>
        </div>
        <div style={{ maxWidth: 520, margin: '0 auto', background: `linear-gradient(160deg, ${C.DARK2}, ${C.DARK3})`, border: `1.5px solid ${C.GOLD}40`, borderRadius: 20, padding: isMobile ? '32px 20px' : '48px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.GOLD}, transparent)` }} />
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 36 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 11 : 13, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8, fontWeight: 600 }}>Challenge Fee</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 40 : 56, fontWeight: 800, color: C.WHITE }}>$1,050</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 12 : 14, color: C.GREEN, fontWeight: 500 }}>✓ Fully Refundable After Passing</div>
          </div>
          <div style={{ background: `${C.GOLD}10`, border: `1px solid ${C.GOLD}25`, borderRadius: 12, padding: isMobile ? 16 : 20, marginBottom: isMobile ? 24 : 32, textAlign: 'center' }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 10 : 12, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontWeight: 600 }}>Security Deposit</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 24 : 32, fontWeight: 700, color: C.WHITE }}>9,500 USDT</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 11 : 13, color: C.GRAY, marginTop: 4 }}>Refundable on closure or violation</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 14 }}>
            {[['Account Size', '$200,000'], ['Profit Split', 'Up to 90%'], ['Leverage', '1:100'], ['Platform', 'MT5 (Provided by us)'], ['Daily Loss', '5%'], ['Max Drawdown', '10%']].map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 13 : 14, padding: '8px 0', borderBottom: i < 5 ? `1px solid ${C.DARK3}` : 'none' }}>
                <span style={{ color: C.GRAY }}>{l}</span><span style={{ color: C.WHITE, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <button style={{ ...gb, width: '100%', marginTop: isMobile ? 24 : 32, padding: isMobile ? 14 : 18, fontSize: isMobile ? 14 : 16 }} onClick={() => setShowChallenge(true)}>Start Challenge Now</button>
        </div>
      </section>

      {/* RULES */}
      <section id="rules" style={sec}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 64 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: isMobile ? 11 : 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Trading Rules</p>
          <h2 style={st}>Challenge Parameters</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? 10 : 16, maxWidth: 900, margin: '0 auto' }}>
          {rules.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 10, padding: isMobile ? '14px 16px' : '20px 24px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 12 : 14, color: C.GRAY }}>{r.label}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 12 : 14, color: C.WHITE, fontWeight: 600, textAlign: 'right', marginLeft: 12 }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 900, margin: '48px auto 0', background: `${C.RED}08`, border: `1px solid ${C.RED}25`, borderRadius: 12, padding: isMobile ? '20px 16px' : '28px 32px' }}>
          <h4 style={{ fontFamily: "'DM Sans', sans-serif", color: C.RED, fontSize: isMobile ? 12 : 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>⚠ Prohibited Activities — Immediate Violation</h4>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 12 : 13, color: C.GRAY }}>
            {['Multiple MT5 logins (1 session only)', 'Mobile / tablet MT5 login', 'Sharing MT5 credentials', 'Latency arbitrage', 'Tick scalping / HFT exploits', 'Copy trading from other prop accounts', 'Cross-account hedging', 'Martingale / grid without SL', 'News straddle exploitation'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ color: C.RED }}>✕</span>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: '24px auto 0', background: `${C.GOLD}08`, border: `1px solid ${C.GOLD}25`, borderRadius: 12, padding: isMobile ? '16px' : '24px 32px' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: isMobile ? 20 : 24, flexShrink: 0 }}>🖥️</span>
            <div>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: isMobile ? 12 : 14, fontWeight: 700, marginBottom: 8 }}>MT5 Login Policy — Desktop Only, Single Session</h4>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 12 : 13, color: C.GRAY, lineHeight: 1.7 }}>
                Your MT5 login credentials are provided by AiraPropFirm. You must only log in from <strong style={{ color: C.WHITE }}>one device at a time</strong> using the <strong style={{ color: C.WHITE }}>MT5 Desktop terminal</strong>.
                Multiple simultaneous logins, mobile logins, or sharing your credentials is <strong style={{ color: C.RED }}>strictly prohibited</strong> and will be treated as an <strong style={{ color: C.RED }}>immediate account violation</strong>,
                resulting in account termination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PAYOUTS */}
      <section id="payouts" style={sec}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 64 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: isMobile ? 11 : 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Profit Sharing</p>
          <h2 style={st}>Payout & Scaling Plan</h2>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {payouts.map((p, i) => (
            <div key={i} style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr auto 1fr', gap: isMobile ? 12 : 24, alignItems: 'center', background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12, padding: isMobile ? '20px 16px' : '28px 32px' }}>
              <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 18 : 20, fontWeight: 700, color: C.WHITE }}>{p.milestone}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginTop: 4 }}>{p.note}</div>
              </div>
              {!isMobile && <div style={{ width: 1, height: 40, background: C.DARK3 }} />}
              {isMobile && <div style={{ height: 1, background: C.DARK3, width: '100%' }} />}
              <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 28 : 36, fontWeight: 800, color: C.GOLD }}>{p.split}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GRAY, textTransform: 'uppercase', letterSpacing: '1px' }}>Profit Split</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={sec}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 64 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.GOLD, fontSize: isMobile ? 11 : 13, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>FAQ</p>
          <h2 style={st}>Frequently Asked Questions</h2>
        </div>
        <div style={{ maxWidth: 750, margin: '0 auto' }}>
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '60px 16px' : '100px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${C.GOLD}0A 0%, transparent 60%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 'clamp(22px, 6vw, 36px)' : 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 20 }}>Ready to Prove Your <span style={{ color: C.GOLD }}>Edge</span>?</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 14 : 18, color: C.GRAY, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>Start your challenge today and trade with $200,000.</p>
          <button style={{ ...gb, padding: isMobile ? '16px 36px' : '20px 56px', fontSize: 16 }} onClick={() => setShowChallenge(true)}>Start Your Challenge</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.DARK3}`, padding: isMobile ? '40px 16px 24px' : '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? 32 : 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.GOLD}, #B8943F)`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 16, color: C.DARK }}>A</div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Aira<span style={{ color: C.GOLD }}>PropFirm</span></span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, lineHeight: 1.7, maxWidth: 280 }}>Proprietary trading firm providing capital to skilled traders worldwide.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16, fontWeight: 600 }}>Contact</h4>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, lineHeight: 2 }}>
              <div>support@airapropfirm.com</div>
              <div>+971 4 568 7200</div>
              <div style={{ marginTop: 8, lineHeight: 1.6 }}>Office 2104, Level 21<br />Boulevard Plaza Tower 1<br />Downtown Dubai, UAE</div>
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16, fontWeight: 600 }}>Legal</h4>
            {['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Refund Policy'].map(t => (
              <a key={t} href="#" style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, textDecoration: 'none', marginBottom: 10 }}>{t}</a>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '24px 0', borderTop: `1px solid ${C.DARK3}` }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: `${C.GRAY}99`, lineHeight: 1.8, textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <strong style={{ color: C.GRAY }}>Risk Disclosure:</strong> Trading carries high risk. AiraPropFirm provides simulated funded accounts. Past performance ≠ future results. AiraPropFirm Trading DMCC, DMCC, UAE. License: DMCC-12847.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: `${C.GRAY}80`, textAlign: 'center', marginTop: 24 }}>© 2026 AiraPropFirm Trading DMCC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
