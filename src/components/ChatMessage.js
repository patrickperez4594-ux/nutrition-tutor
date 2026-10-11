export default function ChatMessage({ message, showResponseControls, onTransform, disabled }) {
  const assistant = message.role === 'assistant';
  return (
    <div className={`message-row ${assistant ? 'assistant' : 'user'}`}>
      <div className="message-bubble">
        <div className="message-label">{assistant ? 'Nutrition Tutor' : 'You'}</div>
        <div className="message-content">{message.content}</div>
        {message.status === 'failed' && <div className="failed-label">Message needs retry</div>}
        {showResponseControls && (
          <div className="teaching-controls">
            <button disabled={disabled} onClick={() => onTransform('simplify')}>Make this easier</button>
            <button disabled={disabled} onClick={() => onTransform('expand')}>Explain more</button>
            <button disabled={disabled} onClick={() => onTransform('example')}>Give me an example</button>
          </div>
        )}
      </div>
    </div>
  );
}
