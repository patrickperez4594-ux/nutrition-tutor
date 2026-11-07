import useDialogFocus from '../hooks/useDialogFocus';

export default function ReviewPrompt({ conversation, onExtend, onKeepUntilDeleted, onDelete, onDismiss }) {
  const dialogRef = useDialogFocus(onDismiss, Boolean(conversation));
  if (!conversation) return null;
  const period = conversation.reviewPolicy === '7d' ? '7 days' : '30 days';
  return (
    <div className="modal-backdrop">
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <button className="modal-close" onClick={onDismiss} aria-label="Close">×</button>
        <p className="eyebrow">Saved progress review</p>
        <h2 id="review-title">Keep “{conversation.title}”?</h2>
        <p>Your chosen review date has arrived. <strong>Nothing has been deleted.</strong></p>
        <div className="stacked-actions">
          <button className="primary-button" onClick={onExtend}>Keep for another {period}</button>
          <button className="secondary-button" onClick={onKeepUntilDeleted}>Keep until I delete it</button>
          <button className="danger-button" onClick={onDelete}>Delete now</button>
        </div>
      </div>
    </div>
  );
}
