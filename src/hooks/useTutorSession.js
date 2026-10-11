import { useCallback, useMemo, useRef, useState } from 'react';
import { postTutorMessage } from '../lib/api';

function makeId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function useTutorSession(personalization) {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const retryRef = useRef(null);

  const sendPayload = useCallback(async (nextMessages, action = null, retryMeta = null) => {
    setIsSending(true);
    setError('');
    try {
      const result = await postTutorMessage({
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
        personalization,
        action
      });
      const assistant = { id: makeId(), role: 'assistant', content: result.content, status: 'sent' };
      setMessages((current) => {
        const repaired = current.map((m) => retryMeta?.userId === m.id ? { ...m, status: 'sent' } : m);
        return [...repaired, assistant];
      });
      retryRef.current = null;
      return assistant;
    } catch (err) {
      setError(err.message || 'The tutor could not respond right now.');
      if (retryMeta?.userId) {
        setMessages((current) => current.map((m) => m.id === retryMeta.userId ? { ...m, status: 'failed' } : m));
      }
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [personalization]);

  const sendMessage = useCallback(async (text) => {
    const clean = String(text || '').trim();
    if (!clean || isSending) return;
    const user = { id: makeId(), role: 'user', content: clean, status: 'sent' };
    const next = [...messages, user];
    setMessages(next);
    retryRef.current = { userId: user.id, messages: next, action: null };
    try {
      await sendPayload(next, null, { userId: user.id });
    } catch (_) {}
  }, [isSending, messages, sendPayload]);

  const retryLast = useCallback(async () => {
    const retry = retryRef.current;
    if (!retry || isSending) return;
    try {
      await sendPayload(retry.messages, retry.action, { userId: retry.userId });
    } catch (_) {}
  }, [isSending, sendPayload]);

  const transformLatest = useCallback(async (action) => {
    if (isSending || !messages.some((m) => m.role === 'assistant')) return;
    const snapshot = [...messages];
    retryRef.current = { userId: null, messages: snapshot, action };
    try {
      await sendPayload(snapshot, action, null);
    } catch (_) {}
  }, [isSending, messages, sendPayload]);

  const replaceMessages = useCallback((next) => {
    setMessages(Array.isArray(next) ? next : []);
    setError('');
    retryRef.current = null;
  }, []);

  const startNewPrivateSession = useCallback(() => replaceMessages([]), [replaceMessages]);
  const latestAssistantId = useMemo(() => [...messages].reverse().find((m) => m.role === 'assistant')?.id || null, [messages]);

  return {
    messages,
    isSending,
    error,
    latestAssistantId,
    sendMessage,
    retryLast,
    transformLatest,
    replaceMessages,
    startNewPrivateSession
  };
}
