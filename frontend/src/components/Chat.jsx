import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

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
    
    // Pass the user's current draft as a query alongside the file upload
    const text = (draft || '').trim();
    if (text) {
      form.append('message', text);
      setMessages((m) => [...m, { role: 'user', text: `[Uploaded File: ${f.name}]\nQuery: ${text}` }]);
    } else {
      setMessages((m) => [...m, { role: 'user', text: `[Uploaded File: ${f.name}]` }]);
    }

    try {
      const res = await axios.post('/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const reply = res.data.reply;
      if (reply) {
        setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: `File uploaded successfully.` }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Upload or processing failed.' }]);
    } finally {
      setUploading(false);
      setDraft('');
      if (fileRef.current) fileRef.current.value = null;
    }
  }

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the current chat?')) {
      setMessages([]);
    }
  };

  const downloadPDF = () => {
    const element = document.querySelector('.message-stream');
    const opt = {
      margin:       0.5,
      filename:     'Medical_Assistant_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
      <section className="chat-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="chat-header" style={{ padding: '24px', background: 'linear-gradient(135deg, #0369a1 0%, #0f766e 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#ffffff', fontWeight: '700', letterSpacing: '0.5px' }}>AI Medical Assistant</h2>
          <p style={{ margin: '6px 0 0', fontSize: '0.95rem', color: '#ccfbf1' }}>Empowering your health with smart insights</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={downloadPDF} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor='rgba(255,255,255,0.3)'} onMouseLeave={e => e.target.style.backgroundColor='rgba(255,255,255,0.2)'}>📄 Export PDF</button>
          <button onClick={clearChat} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.8)', color: '#ffffff', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor='rgba(239, 68, 68, 1)'} onMouseLeave={e => e.target.style.backgroundColor='rgba(239, 68, 68, 0.8)'}>🗑️ Clear Chat</button>
        </div>
      </div>

      <div className="message-stream" aria-live="polite" style={{ padding: '24px', flex: 1, overflowY: 'auto', minHeight: '450px', backgroundColor: '#f8fafc' }}>
        {(messages || []).length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', color: '#0f172a', margin: '40px auto', maxWidth: '80%' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🩺</div>
            <strong style={{ fontSize: '1.15rem', color: '#0369a1', display: 'block', marginBottom: '10px' }}>Welcome to your Medical Assistant</strong>
            <p style={{ maxWidth: '400px', margin: '0 auto', color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Describe your symptoms, ask general health questions, or securely upload a medical report for an educational summary.
            </p>
          </div>
        )}

        {(messages || []).map((m, i) => (
          <div key={i} className={`message-row ${m.role === 'user' ? 'user' : 'assistant'}`} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
            <div className="message-bubble" style={{ background: m.role === 'user' ? 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)' : '#ffffff', color: m.role === 'user' ? '#ffffff' : '#1e293b', padding: '16px 20px', borderRadius: m.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0', maxWidth: '85%', boxShadow: m.role === 'user' ? '0 4px 15px rgba(14, 165, 233, 0.2)' : '0 4px 15px rgba(0,0,0,0.05)', border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none' }}>
              <div className="message-meta" style={{ fontSize: '0.8rem', marginBottom: '4px', opacity: 0.8, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <strong>{m.role === 'user' ? 'You' : 'Assistant'}</strong>
                {m.blocked && <span className="badge badge-danger" style={{ backgroundColor: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Blocked</span>}
                {m.redflag && <span className="badge badge-warning" style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Red flag</span>}
              </div>
              <div className="markdown-body" style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p style={{ margin: '0 0 10px 0' }} {...props} />,
                    ul: ({node, ...props}) => <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }} {...props} />,
                    ol: ({node, ...props}) => <ol style={{ margin: '0 0 10px 0', paddingLeft: '20px' }} {...props} />,
                    h1: ({node, ...props}) => <h1 style={{ margin: '10px 0', fontSize: '1.2rem' }} {...props} />,
                    h2: ({node, ...props}) => <h2 style={{ margin: '10px 0', fontSize: '1.1rem' }} {...props} />,
                    h3: ({node, ...props}) => <h3 style={{ margin: '10px 0', fontSize: '1.05rem' }} {...props} />
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="composer-panel" style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div className="composer-row" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
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
            rows={2}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', fontFamily: 'inherit', fontSize: '0.95rem' }}
          />
          <button className="primary-button" onClick={send} disabled={loading} type="button" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)', color: '#fff', padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', transition: 'all 0.2s', alignSelf: 'stretch', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 10px rgba(14,165,233,0.2)' }}>
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
        
        <div className="upload-panel" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#f0fdfa', border: '1px dashed #5eead4', borderRadius: '12px' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Upload Medical Report</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Securely processed for educational insights. Remove PII before upload.</p>
          </div>
          <div className="upload-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="upload-label" style={{ cursor: uploading ? 'not-allowed' : 'pointer', backgroundColor: '#ffffff', padding: '10px 18px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f766e', border: '1px solid #99f6e4', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}>
              {uploading ? 'Uploading...' : 'Choose File'}
              <input type="file" onChange={uploadFile} ref={fileRef} disabled={uploading} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}