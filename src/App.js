import { useEffect, useMemo, useState } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import PersonalizationForm from './components/PersonalizationForm';
import ChatScreen from './components/ChatScreen';
import SaveProgressDialog from './components/SaveProgressDialog';
import SavedConversationList from './components/SavedConversationList';
import ReviewPrompt from './components/ReviewPrompt';
import useTutorSession from './hooks/useTutorSession';
import { emptyPersonalization } from './lib/personalization';
import { deriveConversationTitle } from './lib/conversationTitle';
import {
  deleteConversation,
  extendReview,
  isReviewDue,
  keepUntilDeleted,
  loadSavedConversations,
  nextReviewAt,
  renameConversation,
  saveConversation
} from './lib/savedConversations';

function makeId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
  const [view, setView] = useState('welcome');
  const [personalization, setPersonalization] = useState(emptyPersonalization());
  const session = useTutorSession(personalization);
  const [saved, setSaved] = useState([]);
  const [storageError, setStorageError] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [activeSavedId, setActiveSavedId] = useState(null);

  const refreshSaved = () => {
    const result = loadSavedConversations();
    if (result.ok) {
      setSaved(result.conversations);
      setStorageError('');
    } else {
      setStorageError(result.error);
    }
    return result;
  };

  useEffect(() => { refreshSaved(); }, []);

  const dueConversations = useMemo(() => saved.filter((item) => isReviewDue(item)), [saved]);
  const due = dueConversations[0] || null;
  const activeSaved = saved.find((item) => item.id === activeSavedId) || null;

  const persistUpdated = (conversation) => {
    const result = saveConversation(conversation);
    if (result.ok) setSaved(result.conversations);
    else setStorageError(result.error);
  };

  const handleSave = (policy) => {
    const now = new Date();
    const previous = activeSaved;
    const conversation = {
      id: previous?.id || makeId(),
      title: previous?.title || deriveConversationTitle(session.messages),
      messages: session.messages,
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
      setShowSave(false);
    } else {
      setStorageError(result.error);
      setShowSave(false);
    }
  };

  const openSaved = (conversation) => {
    setPersonalization(emptyPersonalization());
    session.replaceMessages(conversation.messages);
    setActiveSavedId(conversation.id);
    setView('chat');
  };

  const doRename = (id, title) => {
    const result = renameConversation(id, title);
    if (result.ok) setSaved(result.conversations);
    else setStorageError(result.error);
  };

  const doDelete = (id) => {
    const result = deleteConversation(id);
    if (result.ok) {
      setSaved(result.conversations);
      if (activeSavedId === id) setActiveSavedId(null);
    } else setStorageError(result.error);
  };

  const enterChat = (prefs = emptyPersonalization()) => {
    setPersonalization(prefs);
    setActiveSavedId(null);
    session.startNewPrivateSession();
    setView('chat');
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      {storageError && <div className="global-alert">{storageError} Your Private Session still works.</div>}

      {view === 'welcome' && (
        <WelcomeScreen
          onPersonalize={() => setView('personalize')}
          onStartChatting={() => enterChat()}
          onSaved={() => setView('saved')}
          onNewPrivate={() => setActiveSavedId(null)}
        />
      )}
      {view === 'personalize' && (
        <PersonalizationForm
          onComplete={(prefs) => enterChat(prefs)}
          onCancel={() => setView('welcome')}
        />
      )}
      {view === 'chat' && (
        <ChatScreen
          session={session}
          activeSavedTitle={activeSaved?.title}
          onBack={() => setView('welcome')}
          onSave={() => setShowSave(true)}
          onSaved={() => setView('saved')}
          onNewPrivate={() => setActiveSavedId(null)}
        />
      )}
      {view === 'saved' && (
        <SavedConversationList
          conversations={saved}
          onOpen={openSaved}
          onRename={doRename}
          onDelete={doDelete}
          onBack={() => setView('welcome')}
        />
      )}

      {showSave && <SaveProgressDialog onSave={handleSave} onClose={() => setShowSave(false)} />}
      {due && (
        <ReviewPrompt
          conversation={due}
          onExtend={() => persistUpdated(extendReview(due))}
          onKeepUntilDeleted={() => persistUpdated(keepUntilDeleted(due))}
          onDelete={() => doDelete(due.id)}
          onDismiss={() => {
            setSaved((current) => current.map((item) => item.id === due.id ? { ...item, reviewAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() } : item));
          }}
        />
      )}
    </main>
  );
}

export default App;
