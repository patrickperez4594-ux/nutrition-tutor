const { createTutorService } = require('../tutorService');

test('uses Responses API with store false', async () => {
  const create = jest.fn().mockResolvedValue({ output_text: 'Protein helps build and repair tissue.' });
  const service = createTutorService({ client: { responses: { create } }, model: 'gpt-5-mini' });
  const result = await service.respond({ messages: [{ role: 'user', content: 'What is protein?' }], personalization: {}, action: null });
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ model: 'gpt-5-mini', store: false, instructions: expect.any(String) }));
  expect(result.content).toMatch(/Protein/);
});
