import React, { useState } from 'react';
import Chat from './components/Chat';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import History from './components/History';

function App() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  const quickPrompts = [
    'I have a headache and mild fever.',
    'What should I do for a sore throat?',
    'Can you explain this lab report?',
  ];

  return (
    <div className="app-shell">
      <div className="app-background app-background-a" />
      <div className="app-background app-background-b" />

      <main className="app-root">
        <header className="hero-card">
          <div className="hero-copy">
            <span className="eyebrow">AI Medical Assistant</span>
            <h1>Calm, clear medical guidance with safety built in.</h1>
            <p>
              A friendly assistant for educational support, symptom triage, and report discussion.
              The interface is designed to keep the important actions obvious and the safety notices visible.
            </p>
            <div className="hero-actions">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="pill-button"
                  onClick={() => setDraft(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-label">Flow</span>
              <strong>User → Safety → Red Flags → AI → DB</strong>
            </div>
            <div className="stat-card muted">
              <span className="stat-label">Storage</span>
              <strong>SQLite conversations + uploaded reports</strong>
            </div>
          </div>
        </header>

        <section className="app-grid">
          <div className="main-panel">
            <SafetyDisclaimer />
            <Chat
              messages={messages}
              setMessages={setMessages}
              draft={draft}
              setDraft={setDraft}
            />
          </div>

          <aside className="side-panel">
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