'use client';

import { useReadContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import type { EscrowJob } from '@/lib/jobs';

export function EscrowTimeline({id}:{id:bigint}){
  const {data,isLoading}=useReadContract({
    address:AGENT_ESCROW_ADDRESS,
    abi:agentEscrowAbi,
    functionName:'getJob',
    args:[id],
    query:{enabled:hasContractAddress}
  });

  if(isLoading)return <div className="card empty">Loading escrow state…</div>;
  if(!data)return <div className="card empty">Job not found.</div>;
  const job=data as EscrowJob;
  const status=Number(job.status);
  const terminal=status===4?'Cancelled':status===5?'Expired / Refunded':null;
  const completedIndex=status===3?3:Math.min(status,2);
  const steps=['Funded','Accepted','Submitted','Released'];

  return <section className="card timeline">
    {steps.map((step,index)=><div className="timelineItem" key={step}>
      <span className="dot" style={{opacity:index<=completedIndex?1:.25}} />
      <div><strong>{step}</strong><div className="muted">{index<=completedIndex?'Completed':'Pending'}</div></div>
    </div>)}
    {terminal&&<div className="timelineItem"><span className="dot" /><div><strong>{terminal}</strong><div className="muted">Escrow is closed.</div></div></div>}
  </section>;
}
