export function userErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  const message = error instanceof Error ? error.message : String(error || '');

  if (/user rejected|user denied|rejected the request/i.test(message)) return 'You cancelled the request in your wallet.';
  if (/insufficient funds/i.test(message)) return 'Your wallet does not have enough BOT to complete this transaction and pay network fees.';
  if (/chain.*not configured|unsupported chain|switch chain/i.test(message)) return 'Please switch your wallet to BOT Chain Testnet and try again.';
  if (/connector not found|provider not found|no provider/i.test(message)) return 'No compatible wallet was found. Open this DApp in a wallet browser or install a supported wallet.';
  if (/timeout|timed out|network|failed to fetch|rpc/i.test(message)) return 'BOT Chain is not responding right now. Check your connection and try again.';
  if (/deadline/i.test(message)) return 'Choose a deadline that is still in the future.';
  if (/not client/i.test(message)) return 'Only the client who created this job can do that.';
  if (/not agent/i.test(message)) return 'Only the agent assigned to this job can do that.';
  if (/invalid status|wrong status/i.test(message)) return 'This action is not available for the job in its current state.';
  if (/execution reverted|revert/i.test(message)) return 'The contract did not accept this action. Check the job status and try again.';

  return fallback;
}
