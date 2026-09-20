'use client';

import Link from 'next/link';
import { formatEther, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import { EscrowJob, STATUS_LABELS } from '@/lib/jobs';
import { JobActions } from './JobActions';

export function LiveJob({id}:{id:bigint}) {
  const {data,isLoading,error} = useReadContract({
    address:AGENT_ESCROW_ADDRESS,
    abi:agentEscrowAbi,
    functionName:'getJob',
    args:[id],
    query:{enabled:hasContractAddress,refetchInterval:5000}
  });

  if (!hasContractAddress) return <div className="card empty">AgentEscrow is temporarily unavailable.</div>;
  if (isLoading) return <div className="card empty">Loading this job from BOT Chain…</div>;
  if (error || !data) return <div className="card empty">This job could not be loaded. It may not exist yet.</div>;

  const job = data as EscrowJob;
  return <div className="detailGrid">
    <section className="card">
      <span className="statusPill">{STATUS_LABELS[Number(job.status)]}</span>
      <h2>Job #{job.id.toString()}</h2>
      <div className="jobMeta"><span>Reward</span><strong>{formatEther(job.reward)} BOT</strong></div>
      <div className="jobMeta"><span>Client</span><strong>{job.client}</strong></div>
      <div className="jobMeta"><span>Agent</span><strong>{job.agent===zeroAddress?'Not assigned':job.agent}</strong></div>
      <div className="jobMeta"><span>Deadline</span><strong>{new Date(Number(job.deadline)*1000).toLocaleString()}</strong></div>
      <h3>Details</h3><p className="muted">{job.metadataURI}</p>
      {job.submissionURI && <><h3>Delivery</h3><p className="muted">{job.submissionURI}</p></>}
      <Link className="btn btnSecondary" href={`/app/jobs/${job.id.toString()}/status`}>Escrow Status</Link>
    </section>
    <aside className="card"><JobActions job={job} /></aside>
  </div>;
}
