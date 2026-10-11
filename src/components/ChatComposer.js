import { useState } from 'react';
export default function ChatComposer({ onSend, disabled }) {
  const [text, setText] = useState('');
  const submit = () => {
    const clean = text.trim();
    if (!clean || disabled) return;
    onSend(clean);
    setText('');
  };
  return (
    <div className="composer">
      <textarea
        aria-label="Ask a nutrition question"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
        }}
        placeholder="Ask me anything about nutrition…"
        rows={2}
      />
      <button className="send-button" onClick={submit} disabled={disabled || !text.trim()}>Send</button>
    </div>
  );
}
