import React, { useState } from 'react';
import Chat from './components/Chat';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import History from './components/History';

function App() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [user, setUser] = useState(localStorage.getItem('medical_auth_user') || '');

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    if (username) {
      localStorage.setItem('medical_auth_user', username);
      setUser(username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('medical_auth_user');
    setUser('');
    setMessages([]);
  };

  if (!user) {
    return (
      <div className="app-shell" style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ color: '#0369a1', marginBottom: '8px', marginTop: 0 }}>AI Medical Assistant</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Please sign in to access your secure medical portal.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input name="username" type="text" placeholder="Enter your full name" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
            <button type="submit" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>Sign In securely</button>
          </form>
        </div>
      </div>
    );
  }

  const quickPrompts = [
    'I have a headache and mild fever.',
    'What should I do for a sore throat?',
    'Can you explain this lab report?',
  ];

  return (
    <div className="app-shell" style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px' }}>
      <main className="app-root" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.65)', padding: '32px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(14, 165, 233, 0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
        <header className="hero-card" style={{ backgroundColor: 'rgba(19, 19, 149, 0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(255, 255, 255, 0.8)', padding: '40px', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="hero-copy" style={{ flex: '1 1 400px' }}>
            <span className="eyebrow" style={{ display: 'inline-block', backgroundColor: '#f0f9ff', color: '#0ea5e9', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.5px' }}>
              👤 Welcome, {user}
            </span>
            <button onClick={handleLogout} style={{ marginLeft: '12px', padding: '4px 10px', fontSize: '0.8rem', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer' }}>Logout</button>
            <h1 style={{ margin: '0 0 16px', fontSize: '2rem', color: '#0f172a', lineHeight: '1.2' }}>Calm, clear medical guidance with safety built in.</h1>
            <p style={{ margin: '0 0 24px', fontSize: '1.05rem', color: '#475569', lineHeight: '1.6' }}>
              A friendly assistant for educational support, symptom triage, and report discussion.
            </p>
            <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="pill-button"
                  onClick={() => setDraft(prompt)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #5eead4', color: '#0f766e', padding: '10px 16px', borderRadius: '24px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#ccfbf1'; e.target.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.transform = 'translateY(0)'; }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-stats" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '1 1 250px', minWidth: '250px' }}>
            <div className="stat-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 'bold' }}>Chat Session</span>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Ask your medical queries in real-time</strong>
            </div>
            <div className="stat-card muted" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
              <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 'bold' }}>File Upload</span>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Upload your medical reports for clearer insights</strong>
            </div>
          </div>
        </header>

        <section className="app-grid" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div className="main-panel" style={{ flex: '1 1 600px' }}>
            <SafetyDisclaimer />
            <Chat
              messages={messages}
              setMessages={setMessages}
              draft={draft}
              setDraft={setDraft}
            />
          </div>

          <aside className="side-panel" style={{ flex: '1 1 300px', minWidth: '300px' }}>
            <History
              messages={messages}
              onReplay={(userMessage) => setDraft(userMessage)}
            />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;