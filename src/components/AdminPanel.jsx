// import React, { useState, useEffect, useCallback } from 'react';
// import { getPending, getApproved, approveUser, rejectUser, removeUser } from '../lib/api';
// import { C, Spinner } from './SharedUI';

// export default function AdminPanel({ onClose }) {
//   const [pending, setPending] = useState([]); const [approved, setApproved] = useState([]);
//   const [loading, setLoading] = useState(true); const [actionLoading, setActionLoading] = useState(null); const [tab, setTab] = useState('pending');

//   const loadData = useCallback(async () => {
//     setLoading(true);
//     try { const [p, a] = await Promise.all([getPending(), getApproved()]); setPending(p); setApproved(a); } catch (e) { console.error(e); }
//     setLoading(false);
//   }, []);
//   useEffect(() => { loadData(); }, [loadData]);

//   const handleApprove = async (email) => { setActionLoading(email); try { await approveUser(email); } catch (e) { console.error(e); } setActionLoading(null); loadData(); };
//   const handleReject = async (email) => { setActionLoading(email); try { await rejectUser(email); } catch (e) { console.error(e); } setActionLoading(null); loadData(); };
//   const handleRemove = async (email) => { if (!window.confirm(`Remove ${email}?`)) return; setActionLoading(email); try { await removeUser(email); } catch (e) { console.error(e); } setActionLoading(null); loadData(); };

//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: `${C.DARK}F5`, backdropFilter: 'blur(12px)', overflow: 'auto' }}>
//       <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
//           <div>
//             <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.WHITE }}>Admin Panel</h2>
//             <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, marginTop: 4 }}>Manage trader registrations</p>
//           </div>
//           <button onClick={onClose} style={{ background: C.DARK3, border: `1px solid ${C.DARK3}`, color: C.GRAY, padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>✕ Close</button>
//         </div>
//         <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: C.DARK2, borderRadius: 10, padding: 4, border: `1px solid ${C.DARK3}` }}>
//           {[{ id: 'pending', label: `Pending (${pending.length})`, color: C.GOLD }, { id: 'approved', label: `Approved (${approved.length})`, color: C.GREEN }].map(t => (
//             <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, background: tab === t.id ? `${t.color}20` : 'transparent', color: tab === t.id ? t.color : C.GRAY }}>{t.label}</button>
//           ))}
//         </div>
//         {loading ? <div style={{ textAlign: 'center', padding: 60, color: C.GRAY }}><Spinner /> Loading...</div>
//         : tab === 'pending' ? (
//           pending.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: C.GRAY, fontFamily: "'DM Sans', sans-serif" }}>No pending registrations</div>
//           : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//             {pending.map((u) => (
//               <div key={u.email} style={{ background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 14, padding: 24 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
//                   <div>
//                     <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.WHITE }}>{u.name}</div>
//                     <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GOLD, marginTop: 4 }}>{u.email}</div>
//                     {u.phone && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginTop: 2 }}>📱 {u.phone}</div>}
//                     {u.created_at && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: `${C.GRAY}80`, marginTop: 6 }}>Registered: {new Date(u.created_at).toLocaleString()}</div>}
//                   </div>
//                   <div style={{ display: 'flex', gap: 10 }}>
//                     <button onClick={() => handleApprove(u.email)} disabled={!!actionLoading} style={{ padding: '10px 24px', background: `${C.GREEN}20`, border: `1px solid ${C.GREEN}40`, borderRadius: 8, color: C.GREEN, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>{actionLoading === u.email ? <Spinner /> : '✓ Approve'}</button>
//                     <button onClick={() => handleReject(u.email)} disabled={!!actionLoading} style={{ padding: '10px 24px', background: `${C.RED}15`, border: `1px solid ${C.RED}35`, borderRadius: 8, color: C.RED, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>✕ Reject</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           approved.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: C.GRAY, fontFamily: "'DM Sans', sans-serif" }}>No approved traders yet</div>
//           : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//             {approved.map((u) => (
//               <div key={u.email} style={{ background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
//                 <div>
//                   <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.WHITE }}>{u.name || u.email}</div>
//                   <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD }}>{u.email}</div>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GREEN, background: `${C.GREEN}15`, padding: '4px 12px', borderRadius: 100, fontWeight: 600 }}>ACTIVE</span>
//                   <button onClick={() => handleRemove(u.email)} style={{ background: 'transparent', border: `1px solid ${C.RED}30`, color: `${C.RED}99`, borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>Remove</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { getPending, getApproved, getChallenges, approveUser, rejectUser, removeUser, approveChallenge, rejectChallenge } from '../lib/api';
import { C, Spinner } from './SharedUI';

const tabStyle = (active) => ({
  padding: '10px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', borderRadius: 8,
  border: `1px solid ${active ? C.GOLD : C.DARK3}`,
  background: active ? `${C.GOLD}15` : 'transparent',
  color: active ? C.GOLD : C.GRAY, transition: 'all 0.2s ease',
});

const btnStyle = (color) => ({
  padding: '8px 16px', fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
  textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none', borderRadius: 6,
  cursor: 'pointer', background: `${color}20`, color: color,
});

function Badge({ count, color }) {
  if (!count) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 20, height: 20, borderRadius: 10, padding: '0 6px',
      background: color, color: C.WHITE, fontSize: 11, fontWeight: 700, marginLeft: 8,
    }}>{count}</span>
  );
}

function UserCard({ user, onApprove, onReject, onRemove, type }) {
  const [loading, setLoading] = useState('');

  const handle = async (action, fn) => {
    setLoading(action);
    try { await fn(); } catch (e) { console.error(e); }
    setLoading('');
  };

  return (
    <div style={{
      background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12,
      padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: 16, flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.WHITE }}>{user.name}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginTop: 4 }}>{user.email}</div>
        {user.phone && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GRAY, marginTop: 2 }}>📞 {user.phone}</div>}
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: `${C.GRAY}80`, marginTop: 6 }}>
          {type === 'approved' ? `Approved: ${new Date(user.approved_at).toLocaleDateString()}` : `Registered: ${new Date(user.created_at).toLocaleDateString()}`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {type === 'pending' && (
          <>
            <button onClick={() => handle('approve', onApprove)} disabled={!!loading} style={btnStyle(C.GREEN)}>
              {loading === 'approve' ? <Spinner /> : '✓ Approve'}
            </button>
            <button onClick={() => handle('reject', onReject)} disabled={!!loading} style={btnStyle(C.RED)}>
              {loading === 'reject' ? <Spinner /> : '✕ Reject'}
            </button>
          </>
        )}
        {type === 'approved' && (
          <button onClick={() => handle('remove', onRemove)} disabled={!!loading} style={btnStyle(C.RED)}>
            {loading === 'remove' ? <Spinner /> : 'Remove'}
          </button>
        )}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, onApprove, onReject }) {
  const [loading, setLoading] = useState('');

  const handle = async (action, fn) => {
    setLoading(action);
    try { await fn(); } catch (e) { console.error(e); }
    setLoading('');
  };

  const statusColor = challenge.status === 'approved' ? C.GREEN : challenge.status === 'rejected' ? C.RED : C.GOLD;

  return (
    <div style={{
      background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12, padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: C.WHITE }}>
              {challenge.first_name} {challenge.last_name}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase',
              background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`,
            }}>{challenge.status}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
            <div><span style={{ color: C.GRAY }}>Email: </span><span style={{ color: C.WHITE }}>{challenge.email}</span></div>
            <div><span style={{ color: C.GRAY }}>Platform: </span><span style={{ color: C.GOLD }}>{challenge.platform}</span></div>
            <div><span style={{ color: C.GRAY }}>Experience: </span><span style={{ color: C.WHITE }}>{challenge.experience}</span></div>
            <div><span style={{ color: C.GRAY }}>Payment: </span><span style={{ color: C.GREEN }}>{challenge.payment_method}</span></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: C.GRAY }}>Address: </span><span style={{ color: C.WHITE }}>{challenge.address}</span></div>
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: `${C.GRAY}80`, marginTop: 8 }}>
            Applied: {new Date(challenge.created_at).toLocaleString()}
          </div>
        </div>
        {challenge.status === 'pending' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handle('approve', onApprove)} disabled={!!loading} style={btnStyle(C.GREEN)}>
              {loading === 'approve' ? <Spinner /> : '✓ Approve'}
            </button>
            <button onClick={() => handle('reject', onReject)} disabled={!!loading} style={btnStyle(C.RED)}>
              {loading === 'reject' ? <Spinner /> : '✕ Reject'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel({ onClose }) {
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [p, a, c] = await Promise.all([getPending(), getApproved(), getChallenges()]);
      setPending(p);
      setApproved(a);
      setChallenges(c);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const pendingChallenges = challenges.filter(c => c.status === 'pending');
  const reviewedChallenges = challenges.filter(c => c.status !== 'pending');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: '100%', maxWidth: 800, maxHeight: '90vh', overflowY: 'auto',
        background: `linear-gradient(160deg, ${C.DARK2}, ${C.DARK3})`, border: `1px solid ${C.GOLD}25`,
        borderRadius: 20, padding: '36px 32px', position: 'relative',
        animation: 'fadeSlideUp 0.4s ease forwards',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.GOLD}, transparent)` }} />

        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 8,
          background: `${C.DARK}80`, border: `1px solid ${C.DARK3}`, color: C.GRAY, fontSize: 18,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.WHITE, marginBottom: 24 }}>
          Admin <span style={{ color: C.GOLD }}>Panel</span>
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          <button onClick={() => setTab('pending')} style={tabStyle(tab === 'pending')}>
            Pending Users<Badge count={pending.length} color={C.RED} />
          </button>
          <button onClick={() => setTab('approved')} style={tabStyle(tab === 'approved')}>
            Approved Users<Badge count={approved.length} color={C.GREEN} />
          </button>
          <button onClick={() => setTab('challenges')} style={tabStyle(tab === 'challenges')}>
            Challenges<Badge count={pendingChallenges.length} color={C.GOLD} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}><Spinner /></div>
        ) : (
          <>
            {/* PENDING USERS */}
            {tab === 'pending' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pending.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 48, color: C.GRAY, fontFamily: "'DM Sans', sans-serif" }}>No pending registrations</div>
                ) : (
                  pending.map(u => (
                    <UserCard key={u.email} user={u} type="pending"
                      onApprove={async () => { await approveUser(u.email); load(); }}
                      onReject={async () => { await rejectUser(u.email); load(); }}
                    />
                  ))
                )}
              </div>
            )}

            {/* APPROVED USERS */}
            {tab === 'approved' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {approved.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 48, color: C.GRAY, fontFamily: "'DM Sans', sans-serif" }}>No approved users yet</div>
                ) : (
                  approved.map(u => (
                    <UserCard key={u.email} user={u} type="approved"
                      onRemove={async () => { await removeUser(u.email); load(); }}
                    />
                  ))
                )}
              </div>
            )}

            {/* CHALLENGES */}
            {tab === 'challenges' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {challenges.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 48, color: C.GRAY, fontFamily: "'DM Sans', sans-serif" }}>No challenge applications yet</div>
                ) : (
                  <>
                    {pendingChallenges.length > 0 && (
                      <>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 4 }}>
                          Pending ({pendingChallenges.length})
                        </div>
                        {pendingChallenges.map(c => (
                          <ChallengeCard key={c.id} challenge={c}
                            onApprove={async () => { await approveChallenge(c.id); load(); }}
                            onReject={async () => { await rejectChallenge(c.id); load(); }}
                          />
                        ))}
                      </>
                    )}
                    {reviewedChallenges.length > 0 && (
                      <>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GRAY, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginTop: 16, marginBottom: 4 }}>
                          Reviewed ({reviewedChallenges.length})
                        </div>
                        {reviewedChallenges.map(c => (
                          <ChallengeCard key={c.id} challenge={c} />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
