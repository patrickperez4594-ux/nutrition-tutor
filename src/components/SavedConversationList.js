export default function SavedConversationList({ conversations, onOpen, onRename, onDelete, onBack }) {
  return (
    <section className="panel saved-panel">
      <button className="back-link" onClick={onBack}>← Back</button>
      <p className="eyebrow">Saved Progress</p>
      <h1>Your conversations</h1>
      <p className="muted">Saved only on this device/browser in Version 1.</p>
      {!conversations.length ? (
        <div className="empty-saved">No saved conversations yet.</div>
      ) : (
        <div className="saved-list">
          {conversations.map((conversation) => (
            <article className="saved-card" key={conversation.id}>
              <div>
                <h2>{conversation.title}</h2>
                <p>{new Date(conversation.updatedAt).toLocaleString()}</p>
              </div>
              <div className="saved-actions">
                <button className="primary-button small" onClick={() => onOpen(conversation)}>Continue</button>
                <button className="secondary-button small" onClick={() => {
                  const title = window.prompt('Rename conversation', conversation.title);
                  if (title !== null) onRename(conversation.id, title);
                }}>Rename</button>
                <button className="danger-button small" onClick={() => {
                  if (window.confirm(`Delete “${conversation.title}” from this device?`)) onDelete(conversation.id);
                }}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
