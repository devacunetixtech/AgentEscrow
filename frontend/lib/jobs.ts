export const STATUS_LABELS = ['Open','Accepted','Submitted','Completed','Cancelled','Expired'] as const;

export type EscrowJob = {
  id: bigint;
  client: `0x${string}`;
  agent: `0x${string}`;
  reward: bigint;
  deadline: bigint;
  metadataURI: string;
  submissionURI: string;
  status: number;
};

export function sameAddress(a?: string, b?: string) {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}
