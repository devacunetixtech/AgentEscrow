'use client';

import Link from 'next/link';
import { formatEther, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import { EscrowJob, STATUS_LABELS } from '@/lib/jobs';
import { JobActions } from './JobActions';

function short(address:string){
  return `${address.slice(0,6)}…${address.slice(-4)}`;
}

export function LiveJob({id}:{id:bigint}) {
  const {data,isLoading,error,refetch} = useReadContract({
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
  const status = Number(job.status);

  return <div className="detailGrid">
    <section className="card jobDetailCard">
      <div className="jobDetailTop">
        <div>
          <span className="statusPill">{STATUS_LABELS[status]}</span>
          <h2>Job #{job.id.toString()}</h2>
        </div>
        <strong className="jobReward">{formatEther(job.reward)} BOT</strong>
      </div>

      <div className="jobInfoGrid">
        <div><span>Client</span><strong title={job.client}>{short(job.client)}</strong></div>
        <div><span>Agent</span><strong title={job.agent}>{job.agent===zeroAddress?'Not assigned':short(job.agent)}</strong></div>
        <div><span>Deadline</span><strong>{new Date(Number(job.deadline)*1000).toLocaleString()}</strong></div>
        <div><span>Status</span><strong>{STATUS_LABELS[status]}</strong></div>
      </div>

      <div className="jobSection">
        <span className="pageKicker">Job details</span>
        <p>{job.metadataURI}</p>
      </div>

      {job.submissionURI && <div className="jobSection deliveryBox">
        <span className="pageKicker">Submitted delivery</span>
        <p>{job.submissionURI}</p>
        {(job.submissionURI.startsWith('http://') || job.submissionURI.startsWith('https://')) &&
          <a className="inlineLink" href={job.submissionURI} target="_blank" rel="noreferrer">Open delivery ↗</a>}
      </div>}

      <Link className="btn btnSecondary" href={`/app/jobs/${job.id.toString()}/status`}>View Escrow Status</Link>
    </section>

    <aside className="card actionCard">
      <JobActions job={job} onConfirmed={()=>{ void refetch(); }} />
    </aside>
  </div>;
}
