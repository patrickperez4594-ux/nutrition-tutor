import ChatComposer from './ChatComposer';
import ChatMessage from './ChatMessage';
import PrivacyNotice from './PrivacyNotice';

const starters = [
  'Teach me nutrition basics',
  'Help me understand protein',
  'How can I build a balanced meal?',
  'I’m overwhelmed — make this simple'
];

const V1_BRAND = {
  eyebrow: 'AI Nutrition Tutor',
  assistantName: 'Nutrition Tutor',
  thinking: 'Nutrition Tutor is thinking…',
  backLabel: 'Back to welcome',
  orb: 'NT'
};

export default function ChatScreen({ session, onBack, onSave, onSaved, onNewPrivate, activeSavedTitle, brand = V1_BRAND, draft = null }) {
  const {
    messages, isSending, error, latestAssistantId,
    sendMessage, retryLast, transformLatest, startNewPrivateSession
  } = session;

  return (
    <section className="chat-panel">
      <header className="chat-header">
        <div>
          <p className="eyebrow">{brand.eyebrow}</p>
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
          <button className="icon-button" aria-label={brand.backLabel} onClick={onBack}>×</button>
        </div>
      </header>

      <div className="messages" aria-live="polite">
        {!messages.length && (
          <div className="empty-chat">
            <div className="tutor-orb" aria-hidden="true">{brand.orb}</div>
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
            assistantName={brand.assistantName}
          />
        ))}
        {isSending && <div className="typing-indicator">{brand.thinking}</div>}
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={retryLast} disabled={isSending}>Retry</button>
        </div>
      )}

      <div className="chat-bottom">
        <ChatComposer key={draft?.key} onSend={sendMessage} disabled={isSending} initialText={draft?.text} />
        <div className="chat-meta-row">
          <button className="save-button" disabled={!messages.length} onClick={onSave}>💾 Save Progress</button>
          <span>Nothing is saved unless you choose to save it.</span>
        </div>
        <PrivacyNotice />
      </div>
    </section>
  );
}
