function makeConversation() {
  return [
    { id: 'u1', role: 'user', content: 'What does protein do?', status: 'sent' },
    { id: 'a1', role: 'assistant', content: 'Protein supplies amino acids.', status: 'sent' }
  ];
}

function makePersonalization() {
  return {
    goal: 'protein',
    learningStyle: 'simple',
    foodContext: '',
    otherContext: ''
  };
}

module.exports = { makeConversation, makePersonalization };
