import { useEffect, useMemo, useRef, useState } from 'react';
import './kefi.css';
import KefiHeader from './KefiHeader';
import KefiMark from './KefiMark';
import KefiBackdrop from './KefiBackdrop';
import BottomNav from './BottomNav';
import HomeScreen from './HomeScreen';
import ScanScreen from './ScanScreen';
import LearnScreen from './LearnScreen';
import MeScreen from './MeScreen';
import Onboarding from './Onboarding';
import { toTutorPersonalization } from './tutorPersonalization';
import ChatScreen from '../components/ChatScreen';
import SaveProgressDialog from '../components/SaveProgressDialog';
import SavedConversationList from '../components/SavedConversationList';
import ReviewPrompt from '../components/ReviewPrompt';
import useTutorSession from '../hooks/useTutorSession';
import useSavedConversations from '../hooks/useSavedConversations';
import { clearPersonalization, createEmptyProfile, normalizeProfile } from '../domain/profile';
import { loadProfile, saveProfile } from '../repositories/profileRepository';
import { t } from '../i18n';

const KEFI_CHAT_BRAND = {
  eyebrow: t('ask.eyebrow'),
  assistantName: t('app.assistantName'),
  thinking: t('app.thinking'),
  backLabel: t('ask.backLabel'),
  orb: <KefiMark size={44} />
};

function initialState() {
  const result = loadProfile();
  const profile = result.ok && result.profile ? result.profile : createEmptyProfile();
  return { profile, error: result.ok ? '' : t('storage.error') };
}

export default function KefiApp() {
  const [initial] = useState(initialState);
  const [profile, setProfile] = useState(initial.profile);
  const [storageError, setStorageError] = useState(initial.error);
  const [tab, setTab] = useState('home');
  const [askView, setAskView] = useState('chat');
  const [meSection, setMeSection] = useState(null);
  const [draft, setDraft] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  const tutorPersonalization = useMemo(() => toTutorPersonalization(profile), [profile]);
  const session = useTutorSession(tutorPersonalization);
  const savedState = useSavedConversations();
  const lowEnergy = profile.presentation.lowEnergy;

  // Text size is applied at the root so rem-based components scale with it.
  const textSize = profile.accessibility.textSize;
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.kefiTextSize = textSize;
    return () => { delete root.dataset.kefiTextSize; };
  }, [textSize]);

  // Move focus to the new screen's heading after navigation so screen-reader and keyboard users land in context.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.querySelector('h1')?.focus();
  }, [tab, askView]);

  const commitProfile = (next) => {
    const normalized = normalizeProfile(next);
    setProfile(normalized);
    const result = saveProfile(normalized);
    setStorageError(result.ok ? '' : t('storage.error'));
  };

  const goTab = (next) => {
    setTab(next);
    if (next === 'me') setMeSection(null);
    if (next === 'ask') setAskView('chat');
  };

  const goAsk = (text) => {
    setDraft({ text, key: Date.now() });
    setAskView('chat');
    setTab('ask');
  };

  const openMeSection = (section) => {
    setMeSection(section);
    setTab('me');
  };

  const openSavedList = () => {
    setAskView('saved');
    setTab('ask');
  };

  if (!profile.onboarding.completed) {
    return (
      <div className="kefi-app" data-text-size={profile.accessibility.textSize} data-theme={profile.accessibility.theme} data-motion={profile.accessibility.motion}>
        <KefiBackdrop />
        <main className="kefi-main onboarding-main">
          <Onboarding initialProfile={profile} onComplete={commitProfile} />
        </main>
      </div>
    );
  }

  return (
    <div
      className="kefi-app"
      data-low-energy={lowEnergy ? 'true' : 'false'}
      data-text-size={profile.accessibility.textSize}
      data-theme={profile.accessibility.theme}
      data-motion={profile.accessibility.motion}
    >
      <KefiBackdrop />
      <KefiHeader
        lowEnergy={lowEnergy}
        onToggleLowEnergy={() => commitProfile({ ...profile, presentation: { lowEnergy: !lowEnergy } })}
      />
      {(storageError || savedState.storageError) && (
        <div className="kefi-alert" role="alert">{storageError || `${savedState.storageError} Your Private Session still works.`}</div>
      )}

      <main className="kefi-main" ref={mainRef}>
        {tab === 'home' && (
          <HomeScreen profile={profile} lowEnergy={lowEnergy} onAsk={goAsk} onTab={goTab} onMeSection={openMeSection} />
        )}
        {tab === 'ask' && askView === 'chat' && (
          <ChatScreen
            session={session}
            brand={KEFI_CHAT_BRAND}
            draft={draft}
            activeSavedTitle={savedState.activeSaved?.title}
            onBack={() => goTab('home')}
            onSave={() => setShowSave(true)}
            onSaved={() => setAskView('saved')}
            onNewPrivate={() => savedState.setActiveSavedId(null)}
          />
        )}
        {tab === 'ask' && askView === 'saved' && (
          <SavedConversationList
            conversations={savedState.saved}
            onOpen={(conversation) => {
              session.replaceMessages(conversation.messages);
              savedState.setActiveSavedId(conversation.id);
              setAskView('chat');
            }}
            onRename={savedState.rename}
            onDelete={savedState.remove}
            onBack={() => setAskView('chat')}
          />
        )}
        {tab === 'scan' && <ScanScreen lowEnergy={lowEnergy} onAsk={goAsk} />}
        {tab === 'learn' && <LearnScreen lowEnergy={lowEnergy} onAsk={goAsk} />}
        {tab === 'me' && (
          <MeScreen
            profile={profile}
            section={meSection}
            onSection={setMeSection}
            onSave={commitProfile}
            onClear={() => commitProfile(clearPersonalization(profile))}
            savedCount={savedState.saved.length}
            onViewSaved={openSavedList}
          />
        )}
      </main>

      <BottomNav active={tab} onSelect={goTab} />

      {showSave && (
        <SaveProgressDialog
          onSave={(policy) => { savedState.save(policy, session.messages); setShowSave(false); }}
          onClose={() => setShowSave(false)}
        />
      )}
      {savedState.due && (
        <ReviewPrompt
          conversation={savedState.due}
          onExtend={savedState.extendDue}
          onKeepUntilDeleted={savedState.keepDue}
          onDelete={() => savedState.remove(savedState.due.id)}
          onDismiss={savedState.dismissDue}
        />
      )}
    </div>
  );
}
