import React from 'react';

export default function SafetyDisclaimer() {
  return (
    <section className="safety-card">
      <div className="safety-icon">i</div>
      <div className="safety-content">
        <span className="section-kicker">Safety notice</span>
        <strong>This assistant is for educational and preliminary support only.</strong>
        <p>
          It is not a substitute for professional medical advice, diagnosis, or treatment. If you have chest pain,
          difficulty breathing, loss of consciousness, or any urgent concern, contact local emergency services.
        </p>
      </div>
    </section>
  );
}
