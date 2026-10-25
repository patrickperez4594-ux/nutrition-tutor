import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import KefiApp from '../kefi/KefiApp';
import { normalizeProfile } from '../domain/profile';
import { PROFILE_STORAGE_KEY } from '../repositories/profileRepository';
import { STORAGE_KEY as SAVED_KEY } from '../lib/savedConversations';

function storeProfile(value) {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizeProfile({
    ...value,
    privacy: { rememberOnDevice: true },
    onboarding: { completed: true }
  })));
}

function mockChat() {
  const fetchMock = jest.fn(async () => ({ ok: true, json: async () => ({ content: 'Here is a gentle idea.' }) }));
  global.fetch = fetchMock;
  return fetchMock;
}

function lastChatBody(fetchMock) {
  const [, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
  return JSON.parse(init.body);
}

const nav = () => screen.getByRole('navigation', { name: 'Main' });
const tab = (name) => within(nav()).getByRole('button', { name });

beforeEach(() => {
  window.localStorage.clear();
  delete global.fetch;
});

afterEach(() => jest.restoreAllMocks());

describe('feature flag', () => {
  test('V1 remains the default experience', () => {
    render(<App flags={{ kefiShell: false }} />);
    expect(screen.getByRole('heading', { name: /Learn nutrition without judgment/i })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument();
  });

  test('the Kefi shell renders only when the flag is on', () => {
    render(<App flags={{ kefiShell: true }} />);
    expect(screen.getByRole('heading', { name: /Hi, I’m Kefi/i })).toBeInTheDocument();
  });
});

describe('onboarding', () => {
  test('Continue Without Personalization is a complete path and stores nothing', async () => {
    render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue Without Personalization' }));
    expect(screen.getByRole('heading', { name: 'What would you like help with today?' })).toBeInTheDocument();
    expect(nav()).toBeInTheDocument();
    expect(window.localStorage.getItem(PROFILE_STORAGE_KEY)).toBeNull();
  });

  test('progressive steps are optional, ask no calorie inputs, and default to not remembering', async () => {
    render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Get Started' }));
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Get more protein'));
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    await userEvent.click(screen.getByLabelText('Teach me why'));
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.queryByLabelText(/age|height|weight/i)).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Food or ingredient'), 'peanuts');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('peanuts')).toBeInTheDocument();
    expect(screen.getByText('peanuts').closest('li')).toHaveTextContent('Allergy (must avoid)');
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByLabelText('Just for this session')).toBeChecked();
    await userEvent.click(screen.getByRole('button', { name: 'Start using Kefi' }));

    expect(screen.getByText('Your focus: Get more protein')).toBeInTheDocument();
    expect(window.localStorage.getItem(PROFILE_STORAGE_KEY)).toBeNull();
  });

  test('Skip discards that step’s answers', async () => {
    render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Get Started' }));
    await userEvent.click(screen.getByLabelText('Eat on a budget'));
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    await userEvent.click(screen.getByRole('button', { name: 'Start using Kefi' }));
    expect(screen.queryByText(/Your focus/)).not.toBeInTheDocument();
  });

  test('choosing Remember on this device saves the profile locally', async () => {
    render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Get Started' }));
    for (let i = 0; i < 3; i += 1) await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    await userEvent.click(screen.getByLabelText('Remember on this device'));
    await userEvent.click(screen.getByRole('button', { name: 'Start using Kefi' }));
    const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    expect(stored.privacy.rememberOnDevice).toBe(true);
    expect(stored.onboarding.completed).toBe(true);
  });

  test('a remembered profile skips onboarding', () => {
    storeProfile({ goals: { intents: ['budget'] } });
    render(<KefiApp />);
    expect(screen.getByText('Your focus: Eat on a budget')).toBeInTheDocument();
  });
});

describe('navigation and Home', () => {
  beforeEach(() => storeProfile({}));

  test('bottom navigation exposes the five destinations and marks the current one', async () => {
    render(<KefiApp />);
    ['Home', 'Ask', 'Scan', 'Learn', 'Me'].forEach((name) => expect(tab(name)).toBeInTheDocument());
    expect(tab('Home')).toHaveAttribute('aria-current', 'page');
    await userEvent.click(tab('Learn'));
    expect(tab('Learn')).toHaveAttribute('aria-current', 'page');
    expect(tab('Home')).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('heading', { level: 1, name: 'Learn' })).toHaveFocus();
  });

  test('Home offers the spec actions with Plans Changed always visible', () => {
    render(<KefiApp />);
    const home = within(screen.getByRole('main'));
    ['Ask Kefi', 'Scan Food', 'What Can I Make?', 'Grocery Help', 'Learn', 'My Goals'].forEach((name) => {
      expect(home.getByRole('button', { name: new RegExp(`^${name.replace('?', '\\?')}`) })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Plans Changed/ })).toBeInTheDocument();
  });

  test('starter actions prefill Ask without sending anything', async () => {
    const fetchMock = mockChat();
    render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: /Plans Changed/ }));
    expect(tab('Ask')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Ask a nutrition question')).toHaveValue('My plans changed: ');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('Ask keeps V1 Private Session behavior and Kefi branding', async () => {
    const fetchMock = mockChat();
    render(<KefiApp />);
    await userEvent.click(tab('Ask'));
    expect(screen.getByRole('heading', { name: 'Private Session' })).toBeInTheDocument();
    expect(screen.getByText('Nothing is saved unless you choose to save it.')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Ask a nutrition question'), 'What is fiber?{enter}');
    expect(await screen.findByText('Here is a gentle idea.')).toBeInTheDocument();
    expect(screen.getAllByText('Kefi').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Make this easier' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(SAVED_KEY)).toBeNull();
  });

  test('Scan is honest about availability and offers a text alternative', async () => {
    render(<KefiApp />);
    await userEvent.click(tab('Scan'));
    expect(screen.getByText(/not available yet/i)).toBeInTheDocument();
    expect(document.querySelector('input[type="file"]')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Describe food instead' }));
    expect(screen.getByLabelText('Ask a nutrition question')).toHaveValue('I want help with this food: ');
  });

  test('My Goals opens the Goals section in Me', async () => {
    render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: /^My Goals/ }));
    expect(tab('Me')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { level: 1, name: 'Goals' })).toBeInTheDocument();
  });
});

describe('Low-Energy Mode', () => {
  beforeEach(() => storeProfile({ goals: { intents: ['protein'] } }));

  test('is reachable from every tab', async () => {
    render(<KefiApp />);
    for (const name of ['Home', 'Ask', 'Scan', 'Learn', 'Me']) {
      await userEvent.click(tab(name));
      expect(screen.getByRole('button', { name: 'Low-Energy Mode' })).toBeInTheDocument();
    }
  });

  test('reduces Home to one next step plus Plans Changed, with the rest one tap away', async () => {
    render(<KefiApp />);
    const toggle = screen.getByRole('button', { name: 'Low-Energy Mode' });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('One good next step')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Ask Kefi/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plans Changed/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Grocery Help/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/Your focus/)).not.toBeInTheDocument();

    const more = screen.getByRole('button', { name: 'Show more options' });
    await userEvent.click(more);
    expect(screen.getByRole('button', { name: /^Grocery Help/ })).toBeInTheDocument();
  });

  test('never drops allergies from what the tutor receives', async () => {
    window.localStorage.clear();
    storeProfile({ restrictions: [{ id: 'a', label: 'peanuts', kind: 'allergy' }] });
    const fetchMock = mockChat();
    render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Low-Energy Mode' }));
    await userEvent.click(tab('Ask'));
    await userEvent.type(screen.getByLabelText('Ask a nutrition question'), 'Snack idea?{enter}');
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = lastChatBody(fetchMock);
    expect(body.personalization.foodContext).toMatch(/ALLERGIES .*peanuts/);
    expect(body.personalization.learningStyle).toMatch(/one clear next step/);
    expect(Object.keys(body.personalization).sort()).toEqual(['foodContext', 'goal', 'learningStyle', 'otherContext']);
  });
});

describe('Me: editable personalization and privacy', () => {
  test('editing a section updates the profile used everywhere', async () => {
    storeProfile({});
    render(<KefiApp />);
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Goals/ }));
    await userEvent.click(screen.getByLabelText('Support fitness'));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved.');
    await userEvent.click(tab('Home'));
    expect(screen.getByText('Your focus: Support fitness')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY)).goals.intents).toEqual(['fitness']);
  });

  test('budget rejects ambiguous amounts and stores integer minor units with no assumed currency', async () => {
    storeProfile({});
    render(<KefiApp />);
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Budget/ }));
    expect(screen.getByText(/Currency is not set/)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Amount'), '$60');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/Enter an amount/);
    await userEvent.clear(screen.getByLabelText('Amount'));
    await userEvent.type(screen.getByLabelText('Amount'), '60.5');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    expect(stored.budget.amountMinor).toBe(6050);
    expect(stored.locale.currency).toBe('');
  });

  test('locale settings are independent selections', async () => {
    storeProfile({});
    render(<KefiApp />);
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Locale/ }));
    await userEvent.selectOptions(screen.getByLabelText('Region'), 'BR');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    const { locale } = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    expect(locale).toMatchObject({ region: 'BR', measurement: '', currency: '', energyUnit: '', dateFormat: '' });
  });

  test('accessibility preferences apply to the shell', async () => {
    storeProfile({});
    const { container } = render(<KefiApp />);
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Accessibility/ }));
    await userEvent.click(screen.getByLabelText('Larger'));
    await userEvent.click(screen.getByLabelText('Dark'));
    await userEvent.click(screen.getByLabelText('Reduce motion'));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    const root = container.querySelector('.kefi-app');
    expect(root).toHaveAttribute('data-theme', 'dark');
    expect(root).toHaveAttribute('data-motion', 'reduce');
    expect(document.documentElement.dataset.kefiTextSize).toBe('larger');
  });

  test('turning off Remember deletes the stored copy but keeps the current session', async () => {
    storeProfile({ goals: { intents: ['protein'] } });
    render(<KefiApp />);
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Privacy & Saved Data/ }));
    const remember = screen.getByLabelText('Remember my preferences on this device');
    expect(remember).toBeChecked();
    await userEvent.click(remember);
    expect(window.localStorage.getItem(PROFILE_STORAGE_KEY)).toBeNull();
    await userEvent.click(tab('Home'));
    expect(screen.getByText('Your focus: Get more protein')).toBeInTheDocument();
  });

  test('Clear personalization removes preferences and constraints after confirmation', async () => {
    storeProfile({ goals: { intents: ['protein'] }, restrictions: [{ id: 'a', label: 'peanuts', kind: 'allergy' }] });
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    render(<KefiApp />);
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Privacy & Saved Data/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear personalization' }));
    expect(screen.getByRole('status')).toHaveTextContent('Personalization cleared.');
    const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    expect(stored.restrictions).toEqual([]);
    expect(stored.goals.intents).toEqual([]);
  });

  test('Calorie & Macro Preferences explains the estimate boundary without asking body data', async () => {
    storeProfile({});
    render(<KefiApp />);
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Calorie & Macro Preferences/ }));
    expect(screen.getByText(/only ask for those details if you request an estimate/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/age|height|weight/i)).not.toBeInTheDocument();
  });
});

describe('Me: restrictions survive a refresh', () => {
  const AVOID = 'Avoid (religious, ethical, or personal)';

  async function openRestrictions() {
    await userEvent.click(tab('Me'));
    await userEvent.click(screen.getByRole('button', { name: /^Restrictions \/ Allergies/ }));
  }

  async function addRestriction(label, kind) {
    await userEvent.type(screen.getByLabelText('Food or ingredient'), label);
    await userEvent.selectOptions(screen.getByLabelText('Type'), kind);
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
  }

  // Unmounting and rendering again re-reads localStorage exactly as a browser refresh does.
  function refresh(unmount) {
    unmount();
    return render(<KefiApp />);
  }

  test('with Remember on, saved restrictions are restored with their kinds intact', async () => {
    storeProfile({});
    const { unmount } = render(<KefiApp />);
    await openRestrictions();
    await addRestriction('Beef', 'avoid');
    await addRestriction('peanuts', 'allergy');
    await addRestriction('lactose', 'intolerance');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved.');

    const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    expect(stored.restrictions.map(({ label, kind }) => ({ label, kind }))).toEqual([
      { label: 'Beef', kind: 'avoid' },
      { label: 'peanuts', kind: 'allergy' },
      { label: 'lactose', kind: 'intolerance' }
    ]);

    refresh(unmount);
    await openRestrictions();
    expect(screen.queryByText('Nothing added.')).not.toBeInTheDocument();
    expect(screen.getByText('Beef').closest('li')).toHaveTextContent(AVOID);
    expect(screen.getByText('Beef').closest('li')).not.toHaveTextContent('Allergy');
    expect(screen.getByText('peanuts').closest('li')).toHaveTextContent('Allergy (must avoid)');
    expect(screen.getByText('lactose').closest('li')).toHaveTextContent('Intolerance');
  });

  test('with Remember off, saving says it is session-only and stores nothing', async () => {
    const { unmount } = render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue Without Personalization' }));
    await openRestrictions();
    expect(screen.getByText(/changes last only until you close or reload Kefi/)).toBeInTheDocument();
    await addRestriction('Beef', 'avoid');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved for this session.');
    expect(window.localStorage.getItem(PROFILE_STORAGE_KEY)).toBeNull();

    refresh(unmount);
    expect(screen.getByRole('button', { name: 'Continue Without Personalization' })).toBeInTheDocument();
  });

  test('Save and remember on this device opts in explicitly and restores after refresh', async () => {
    const { unmount } = render(<KefiApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue Without Personalization' }));
    await openRestrictions();
    await addRestriction('Beef', 'avoid');
    await userEvent.click(screen.getByRole('button', { name: 'Save and remember on this device' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved.');
    expect(screen.queryByRole('button', { name: 'Save and remember on this device' })).not.toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    expect(stored.privacy.rememberOnDevice).toBe(true);
    expect(stored.restrictions).toEqual([expect.objectContaining({ label: 'Beef', kind: 'avoid' })]);

    refresh(unmount);
    await openRestrictions();
    expect(screen.getByText('Beef').closest('li')).toHaveTextContent(AVOID);
    await userEvent.click(screen.getByRole('button', { name: /Back to Me/ }));
    await userEvent.click(screen.getByRole('button', { name: /^Privacy & Saved Data/ }));
    expect(screen.getByLabelText('Remember my preferences on this device')).toBeChecked();
  });
});
