import React, { useState, useEffect, useCallback } from 'react';
import { getPending, getApproved, approveUser, rejectUser, removeUser } from '../lib/api';
import { C, Spinner } from './SharedUI';

export default function AdminPanel({ onClose }) {
  const [pending, setPending] = useState([]); const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true); const [actionLoading, setActionLoading] = useState(null); const [tab, setTab] = useState('pending');

  const loadData = useCallback(async () => {
    setLoading(true);
    try { const [p, a] = await Promise.all([getPending(), getApproved()]); setPending(p); setApproved(a); } catch (e) { console.error(e); }
    setLoading(false);
  }, []);
  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (email) => { setActionLoading(email); try { await approveUser(email); } catch (e) { console.error(e); } setActionLoading(null); loadData(); };
  const handleReject = async (email) => { setActionLoading(email); try { await rejectUser(email); } catch (e) { console.error(e); } setActionLoading(null); loadData(); };
  const handleRemove = async (email) => { if (!window.confirm(`Remove ${email}?`)) return; setActionLoading(email); try { await removeUser(email); } catch (e) { console.error(e); } setActionLoading(null); loadData(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: `${C.DARK}F5`, backdropFilter: 'blur(12px)', overflow: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.WHITE }}>Admin Panel</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GRAY, marginTop: 4 }}>Manage trader registrations</p>
          </div>
          <button onClick={onClose} style={{ background: C.DARK3, border: `1px solid ${C.DARK3}`, color: C.GRAY, padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>✕ Close</button>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: C.DARK2, borderRadius: 10, padding: 4, border: `1px solid ${C.DARK3}` }}>
          {[{ id: 'pending', label: `Pending (${pending.length})`, color: C.GOLD }, { id: 'approved', label: `Approved (${approved.length})`, color: C.GREEN }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, background: tab === t.id ? `${t.color}20` : 'transparent', color: tab === t.id ? t.color : C.GRAY }}>{t.label}</button>
          ))}
        </div>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: C.GRAY }}><Spinner /> Loading...</div>
        : tab === 'pending' ? (
          pending.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: C.GRAY, fontFamily: "'DM Sans', sans-serif" }}>No pending registrations</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.map((u) => (
              <div key={u.email} style={{ background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 14, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.WHITE }}>{u.name}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.GOLD, marginTop: 4 }}>{u.email}</div>
                    {u.phone && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GRAY, marginTop: 2 }}>📱 {u.phone}</div>}
                    {u.created_at && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: `${C.GRAY}80`, marginTop: 6 }}>Registered: {new Date(u.created_at).toLocaleString()}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => handleApprove(u.email)} disabled={!!actionLoading} style={{ padding: '10px 24px', background: `${C.GREEN}20`, border: `1px solid ${C.GREEN}40`, borderRadius: 8, color: C.GREEN, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>{actionLoading === u.email ? <Spinner /> : '✓ Approve'}</button>
                    <button onClick={() => handleReject(u.email)} disabled={!!actionLoading} style={{ padding: '10px 24px', background: `${C.RED}15`, border: `1px solid ${C.RED}35`, borderRadius: 8, color: C.RED, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>✕ Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          approved.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: C.GRAY, fontFamily: "'DM Sans', sans-serif" }}>No approved traders yet</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {approved.map((u) => (
              <div key={u.email} style={{ background: C.DARK2, border: `1px solid ${C.DARK3}`, borderRadius: 12, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.WHITE }}>{u.name || u.email}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.GOLD }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.GREEN, background: `${C.GREEN}15`, padding: '4px 12px', borderRadius: 100, fontWeight: 600 }}>ACTIVE</span>
                  <button onClick={() => handleRemove(u.email)} style={{ background: 'transparent', border: `1px solid ${C.RED}30`, color: `${C.RED}99`, borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
