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
    <section className="history-card">
      <div className="history-header">
        <span className="section-kicker">Timeline</span>
        <h3>Conversation history</h3>
      </div>

      <div className="history-search">
        <input
          placeholder="Search history..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '100%' }}
          aria-label="Search conversation history"
        />
      </div>

      {loading && <div className="history-empty">Loading...</div>}
      {!loading && items.length === 0 && <div className="history-empty">No history yet.</div>}
      <div className="history-list">
        {shown.map((it) => (
          <button
            key={it.id}
            type="button"
            className={`history-item ${it.redflag ? 'flagged' : ''}`}
            onClick={() => onReplay && onReplay(it.user_message, it.assistant_reply)}
          >
            <div className="history-time">{new Date(it.created_at).toLocaleString()}</div>
            <div className="history-message">
              <strong>You:</strong> {it.user_message}
            </div>
            <div className="history-message assistant-preview">
              <strong>Assistant:</strong> {it.assistant_reply}
            </div>
            {it.redflag && <div className="history-flag">Red-flag: {it.redflag_details}</div>}
          </button>
        ))}
      </div>
    </section>
  );
}
