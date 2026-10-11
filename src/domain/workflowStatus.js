export const WORKFLOW_STATUS = Object.freeze({
  CREATED: 'created',
  OBSERVING: 'observing',
  WAITING_FOR_CONFIRMATION: 'waiting_for_confirmation',
  ANALYZING: 'analyzing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
});

const TERMINAL = new Set([
  WORKFLOW_STATUS.COMPLETED,
  WORKFLOW_STATUS.FAILED,
  WORKFLOW_STATUS.CANCELLED,
  WORKFLOW_STATUS.EXPIRED
]);

export function isTerminalWorkflowStatus(value) {
  return TERMINAL.has(value);
}
