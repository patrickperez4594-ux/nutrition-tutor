import { WORKFLOW_STATUS, isTerminalWorkflowStatus } from '../domain/workflowStatus';

test('defines approved workflow lifecycle states', () => {
  expect(WORKFLOW_STATUS.CREATED).toBe('created');
  expect(WORKFLOW_STATUS.WAITING_FOR_CONFIRMATION).toBe('waiting_for_confirmation');
  expect(WORKFLOW_STATUS.COMPLETED).toBe('completed');
  expect(WORKFLOW_STATUS.FAILED).toBe('failed');
  expect(WORKFLOW_STATUS.CANCELLED).toBe('cancelled');
  expect(WORKFLOW_STATUS.EXPIRED).toBe('expired');
});

test.each(['completed', 'failed', 'cancelled', 'expired'])('%s is terminal', (status) => {
  expect(isTerminalWorkflowStatus(status)).toBe(true);
});

test.each(['created', 'observing', 'waiting_for_confirmation', 'analyzing'])('%s is not terminal', (status) => {
  expect(isTerminalWorkflowStatus(status)).toBe(false);
});
