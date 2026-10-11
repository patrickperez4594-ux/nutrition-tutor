import ChatComposer from './ChatComposer';
import ChatMessage from './ChatMessage';
import PrivacyNotice from './PrivacyNotice';

const starters = [
  'Teach me nutrition basics',
  'Help me understand protein',
  'How can I build a balanced meal?',
  'I’m overwhelmed — make this simple'
];

export default function ChatScreen({ session, onBack, onSave, onSaved, onNewPrivate, activeSavedTitle }) {
  const {
    messages, isSending, error, latestAssistantId,
    sendMessage, retryLast, transformLatest, startNewPrivateSession
  } = session;

  return (
    <section className="chat-panel">
      <header className="chat-header">
        <div>
          <p className="eyebrow">AI Nutrition Tutor</p>
          <h1>{activeSavedTitle || 'Private Session'}</h1>
        </div>
        <div className="header-actions">
          <button className="text-button" onClick={onSaved}>Saved Progress</button>
          <button className="secondary-button small" onClick={() => {
            if (!messages.length || window.confirm('Start a new private session? Unsaved messages will be cleared.')) {
              startNewPrivateSession();
              onNewPrivate();
            }
          }}>New Private Session</button>
          <button className="icon-button" aria-label="Back to welcome" onClick={onBack}>×</button>
        </div>
      </header>

      <div className="messages" aria-live="polite">
        {!messages.length && (
          <div className="empty-chat">
            <div className="tutor-orb">NT</div>
            <h2>What would you like to learn today?</h2>
            <p className="muted">Ask in your own words, or start with one of these.</p>
            <div className="starter-grid">
              {starters.map((starter) => <button key={starter} onClick={() => sendMessage(starter)}>{starter}</button>)}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            showResponseControls={message.id === latestAssistantId}
            onTransform={transformLatest}
            disabled={isSending}
          />
        ))}
        {isSending && <div className="typing-indicator">Nutrition Tutor is thinking…</div>}
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={retryLast} disabled={isSending}>Retry</button>
        </div>
      )}

      <div className="chat-bottom">
        <ChatComposer onSend={sendMessage} disabled={isSending} />
        <div className="chat-meta-row">
          <button className="save-button" disabled={!messages.length} onClick={onSave}>💾 Save Progress</button>
          <span>Nothing is saved unless you choose to save it.</span>
        </div>
        <PrivacyNotice />
      </div>
    </section>
  );
}
