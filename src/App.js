import { useState } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import PersonalizationForm from './components/PersonalizationForm';
import ChatScreen from './components/ChatScreen';
import SaveProgressDialog from './components/SaveProgressDialog';
import SavedConversationList from './components/SavedConversationList';
import ReviewPrompt from './components/ReviewPrompt';
import useTutorSession from './hooks/useTutorSession';
import useSavedConversations from './hooks/useSavedConversations';
import { emptyPersonalization } from './lib/personalization';
import { readClientFeatureFlags } from './config/featureFlags';
import KefiApp from './kefi/KefiApp';

export function V1App() {
  const [view, setView] = useState('welcome');
  const [personalization, setPersonalization] = useState(emptyPersonalization());
  const session = useTutorSession(personalization);
  const savedState = useSavedConversations();
  const { saved, due, activeSaved, storageError, setActiveSavedId } = savedState;
  const [showSave, setShowSave] = useState(false);

  const handleSave = (policy) => {
    savedState.save(policy, session.messages);
    setShowSave(false);
  };

  const openSaved = (conversation) => {
    setPersonalization(emptyPersonalization());
    session.replaceMessages(conversation.messages);
    setActiveSavedId(conversation.id);
    setView('chat');
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
          onRename={savedState.rename}
          onDelete={savedState.remove}
          onBack={() => setView('welcome')}
        />
      )}

      {showSave && <SaveProgressDialog onSave={handleSave} onClose={() => setShowSave(false)} />}
      {due && (
        <ReviewPrompt
          conversation={due}
          onExtend={savedState.extendDue}
          onKeepUntilDeleted={savedState.keepDue}
          onDelete={() => savedState.remove(due.id)}
          onDismiss={savedState.dismissDue}
        />
      )}
    </main>
  );
}

function App({ flags = readClientFeatureFlags() }) {
  return flags.kefiShell ? <KefiApp /> : <V1App />;
}

export default App;
