function WelcomeScreen({ onPersonalize, onStartChatting, onSaved }) {
  return (
    <section className="welcome-card" aria-labelledby="welcome-title">
      <div className="brand-mark" aria-hidden="true">NT</div>
      <p className="eyebrow">AI Nutrition Tutor</p>
      <h1 id="welcome-title">Learn nutrition without judgment.</h1>
      <p className="welcome-copy">
        Ask questions, learn at your pace, and stay in control of your choices.
      </p>
      <div className="entry-actions">
        <button className="primary-button" onClick={onPersonalize}>Personalize My Tutor</button>
        <button className="secondary-button" onClick={onStartChatting}>Start Chatting</button>
        <button className="text-button" onClick={onSaved}>View Saved Progress</button>
      </div>
      <p className="trust-line">Educational nutrition guidance • You remain in control.</p>
    </section>
  );
}
export default WelcomeScreen;
