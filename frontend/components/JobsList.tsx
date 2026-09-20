'use client';

import Link from 'next/link';
import { formatEther } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import { EscrowJob, STATUS_LABELS, sameAddress } from '@/lib/jobs';

export function JobsList({ mode = 'open', address }:{mode?:'open'|'mine'|'all';address?:string}) {
  const { data: count } = useReadContract({
    address: AGENT_ESCROW_ADDRESS,
    abi: agentEscrowAbi,
    functionName: 'jobCount',
    query: { enabled: hasContractAddress }
  });

  const ids = Array.from({ length: Number(count || 0n) }, (_, i) => BigInt(i + 1));
  const { data, isLoading } = useReadContracts({
    contracts: ids.map(id => ({
      address: AGENT_ESCROW_ADDRESS,
      abi: agentEscrowAbi,
      functionName: 'getJob' as const,
      args: [id] as const,
    })),
    query: { enabled: hasContractAddress && ids.length > 0 }
  });

  if (!hasContractAddress) return <div className="card empty">Contract address not configured yet.</div>;
  if (isLoading) return <div className="card empty">Loading jobs…</div>;

  const jobs = (data || [])
    .filter((r:any) => r.status === 'success' && r.result)
    .map((r:any) => r.result as EscrowJob)
    .filter(job => {
      if (mode === 'open') return Number(job.status) === 0;
      if (mode === 'mine') return sameAddress(job.client,address) || sameAddress(job.agent,address);
      return true;
    });

  if (!jobs.length) return <div className="card empty">No matching jobs found.</div>;

  return <div className="jobsGrid">
    {jobs.map(job => <Link href={`/app/jobs/${job.id.toString()}`} className="card jobCard" key={job.id.toString()}>
      <span className="statusPill">{STATUS_LABELS[Number(job.status)] || 'Unknown'}</span>
      <h3>Job #{job.id.toString()}</h3>
      <div className="jobMeta"><span>Reward</span><strong>{formatEther(job.reward)} BOT</strong></div>
      <div className="jobMeta"><span>Deadline</span><strong>{new Date(Number(job.deadline) * 1000).toLocaleString()}</strong></div>
      <p className="muted">{job.metadataURI}</p>
    </Link>)}
  </div>;
}
