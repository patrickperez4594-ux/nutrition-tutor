const LEADING = [
  /^can you help me\s+/i,
  /^please help me\s+/i,
  /^help me\s+/i,
  /^i want to learn about\s+/i,
  /^i want to understand\s+/i
];

export function deriveConversationTitle(messages = []) {
  const first = messages.find((m) => m.role === 'user' && String(m.content || '').trim());
  if (!first) return 'Nutrition Conversation';
  let text = String(first.content).trim().replace(/[?.!,;:]+$/g, '');
  for (const pattern of LEADING) text = text.replace(pattern, '');
  const words = text.split(/\s+/).filter(Boolean).slice(0, 6);
  if (!words.length) return 'Nutrition Conversation';
  let title = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  if (title.length > 48) {
    title = title.slice(0, 48).replace(/\s+\S*$/, '').trim();
  }
  return title || 'Nutrition Conversation';
}
