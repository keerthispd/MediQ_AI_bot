import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function History({ limit = 50, onReplay }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await axios.get(`/api/history?limit=${limit}`);
      setItems(res.data.items || []);
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setLoading(false);
    }
  }

  const shown = items.filter((it) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    return (it.user_message || '').toLowerCase().includes(f) || (it.assistant_reply || '').toLowerCase().includes(f);
  });

  return (
    <section className="history-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', padding: '24px' }}>
      <div className="history-header" style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f766e' }}>Recent Conversations</h3>
      </div>

      <div className="history-search" style={{ marginBottom: '16px' }}>
        <input
          placeholder="Search history..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
          aria-label="Search conversation history"
          className="history-search-input"
        />
      </div>

      {loading && <div className="history-empty" style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Loading...</div>}
      {!loading && items.length === 0 && <div className="history-empty" style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No history yet.</div>}
      
      <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
        {shown.map((it) => (
          <button
            key={it.id}
            type="button"
            className={`history-item ${it.redflag ? 'flagged' : ''}`}
            onClick={() => onReplay && onReplay(it.user_message, it.assistant_reply)}
            style={{ textAlign: 'left', padding: '16px', borderRadius: '8px', border: it.redflag ? '1px solid #fca5a5' : '1px solid #e2e8f0', backgroundColor: it.redflag ? '#fef2f2' : '#f8fafc', cursor: 'pointer', transition: 'background-color 0.2s', width: '100%' }}
          >
            <div className="history-time" style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>{new Date(it.created_at).toLocaleString()}</div>
            <div className="history-message" style={{ fontSize: '0.95rem', color: '#1e293b', marginBottom: '6px' }}>
              <strong style={{ color: '#14b8a6' }}>You:</strong> {it.user_message}
            </div>
            <div className="history-message assistant-preview" style={{ fontSize: '0.9rem', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <strong>Assistant:</strong> {it.assistant_reply}
            </div>
            {it.redflag && <div className="history-flag" style={{ marginTop: '8px', fontSize: '0.8rem', color: '#ef4444', fontWeight: '500' }}>⚠️ Red-flag: {it.redflag_details}</div>}
          </button>
        ))}
      </div>
    </section>
  );
}
