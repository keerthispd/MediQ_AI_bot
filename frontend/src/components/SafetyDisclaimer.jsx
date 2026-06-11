import React from 'react';

export default function SafetyDisclaimer() {
  return (
    <section className="safety-card" style={{ backgroundColor: '#ffffff', borderLeft: '4px solid #0ea5e9', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '20px 24px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
      <div className="safety-icon" style={{ fontSize: '1.5rem', lineHeight: '1' }}>🛡️</div>
      <div className="safety-content" style={{ flex: 1 }}>
        <strong style={{ color: '#0369a1', display: 'block', marginBottom: '6px', fontSize: '1rem', letterSpacing: '0.2px' }}>Important Safety Notice</strong>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>
         <strong>This assistant is for educational and preliminary support only.</strong> It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical emergency (e.g., chest pain, difficulty breathing), please contact local emergency services immediately.
        </p>
      </div>
    </section>
  );
}
