import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Chat({ messages, setMessages, draft, setDraft }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const textRef = useRef(null);

  async function send() {
    const text = (draft || '').trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    const form = new FormData();
    form.append('message', text);
    try {
      const res = await axios.post('/api/chat', form);
      const reply = res.data.reply || 'No reply';
      if (res.data.blocked) {
        setMessages((m) => [...m, { role: 'assistant', text: reply, blocked: true }]);
      } else if (res.data.redflag) {
        setMessages((m) => [...m, { role: 'assistant', text: reply, redflag: true }]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      }
    } catch(e){
      console.log("Axios error:", e);

      setMessages(m=>[
        ...m,
        {
          role:'assistant',
          text: e.response?.data?.detail ||
                e.message ||
                'Unknown error'
        }
    ]);
    } finally {
      setDraft('');
      setLoading(false);
    }
  }

  async function uploadFile(e) {
    const f = e.target.files[0];
    if (!f) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', f);
    try {
      const res = await axios.post('/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const filename = res.data.filename || 'uploaded';
      setMessages((m) => [...m, { role: 'assistant', text: `File uploaded: ${filename}` }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Upload failed' }]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = null;
    }
  }

  return (
    <section className="chat-card">
      <div className="chat-header">
        <div>
          <span className="section-kicker">Conversation</span>
          <h2>Ask a symptom, upload a report, or replay a previous topic.</h2>
        </div>
        <div className="chat-status">
          <span className="status-dot" />
          Ready
        </div>
      </div>

      <div className="message-stream" aria-live="polite">
        {(messages || []).length === 0 && (
          <div className="empty-state">
            <strong>Start with a question.</strong>
            <p>
              Try one of the suggested prompts above, type your own symptoms, or attach a report to discuss.
            </p>
          </div>
        )}

        {(messages || []).map((m, i) => (
          <div key={i} className={`message-row ${m.role === 'user' ? 'user' : 'assistant'}`}>
            <div className="message-bubble">
              <div className="message-meta">
                <strong>{m.role === 'user' ? 'You' : 'Assistant'}</strong>
                {m.blocked && <span className="badge badge-danger">Blocked</span>}
                {m.redflag && <span className="badge badge-warning">Red flag</span>}
              </div>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="composer-panel">
        <label className="composer-label" htmlFor="message-input">Type your message</label>
        <div className="composer-row">
          <textarea
            id="message-input"
            ref={textRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Describe symptoms, ask about a report, or request next steps..."
            disabled={loading}
            rows={3}
          />
          <button className="primary-button" onClick={send} disabled={loading} type="button">
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </div>
        <div className="composer-hint">
          Press Enter in the field or click Send message. Keep emergencies out of the normal chat flow.
        </div>
      </div>

      <div className="upload-panel">
        <div>
          <strong>Upload a file</strong>
          <p>Share a medical image or report for the assistant to store and review later.</p>
        </div>
        <div className="upload-row">
          <input type="file" onChange={uploadFile} ref={fileRef} disabled={uploading} />
          {uploading && <span className="upload-state">Uploading…</span>}
        </div>
      </div>
    </section>
  );
}