import { useCallback, useEffect, useMemo, useState } from 'react';
import { deriveConversationTitle } from '../lib/conversationTitle';
import {
  deleteConversation,
  extendReview,
  isReviewDue,
  keepUntilDeleted,
  loadSavedConversations,
  nextReviewAt,
  renameConversation,
  saveConversation
} from '../lib/savedConversations';

function makeId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Local saved-conversation state shared by the V1 app and the Kefi shell. Nothing is written
// unless the user explicitly saves; review-due items are prompted, never auto-deleted.
export default function useSavedConversations() {
  const [saved, setSaved] = useState([]);
  const [storageError, setStorageError] = useState('');
  const [activeSavedId, setActiveSavedId] = useState(null);

  useEffect(() => {
    const result = loadSavedConversations();
    if (result.ok) {
      setSaved(result.conversations);
      setStorageError('');
    } else {
      setStorageError(result.error);
    }
  }, []);

  const due = useMemo(() => saved.find((item) => isReviewDue(item)) || null, [saved]);
  const activeSaved = saved.find((item) => item.id === activeSavedId) || null;

  const persistUpdated = useCallback((conversation) => {
    const result = saveConversation(conversation);
    if (result.ok) setSaved(result.conversations);
    else setStorageError(result.error);
  }, []);

  const save = useCallback((policy, messages) => {
    const now = new Date();
    const previous = activeSaved;
    const conversation = {
      id: previous?.id || makeId(),
      title: previous?.title || deriveConversationTitle(messages),
      messages,
      createdAt: previous?.createdAt || now.toISOString(),
      updatedAt: now.toISOString(),
      reviewPolicy: policy,
      reviewAt: nextReviewAt(policy, now)
    };
    const result = saveConversation(conversation);
    if (result.ok) {
      setSaved(result.conversations);
      setActiveSavedId(conversation.id);
      setStorageError('');
    } else {
      setStorageError(result.error);
    }
    return result;
  }, [activeSaved]);

  const rename = useCallback((id, title) => {
    const result = renameConversation(id, title);
    if (result.ok) setSaved(result.conversations);
    else setStorageError(result.error);
  }, []);

  const remove = useCallback((id) => {
    const result = deleteConversation(id);
    if (result.ok) {
      setSaved(result.conversations);
      setActiveSavedId((current) => (current === id ? null : current));
    } else setStorageError(result.error);
  }, []);

  const extendDue = useCallback(() => due && persistUpdated(extendReview(due)), [due, persistUpdated]);
  const keepDue = useCallback(() => due && persistUpdated(keepUntilDeleted(due)), [due, persistUpdated]);
  const dismissDue = useCallback(() => {
    if (!due) return;
    setSaved((current) => current.map((item) => item.id === due.id ? { ...item, reviewAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() } : item));
  }, [due]);

  return {
    saved,
    due,
    activeSaved,
    activeSavedId,
    setActiveSavedId,
    storageError,
    save,
    rename,
    remove,
    extendDue,
    keepDue,
    dismissDue
  };
}
