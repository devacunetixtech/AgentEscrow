'use client';

import { FormEvent, useState } from 'react';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi } from '@/lib/contract';
import { EscrowJob, sameAddress } from '@/lib/jobs';

export function JobActions({ job, onSubmitted }:{job:EscrowJob;onSubmitted?:()=>void}) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [submission,setSubmission] = useState('');

  const isClient = sameAddress(job.client,address);
  const isAgent = sameAddress(job.agent,address);
  const expired = Date.now()/1000 >= Number(job.deadline);

  const call = (functionName:'acceptJob'|'approveJob'|'cancelJob'|'claimExpiredRefund') =>
    writeContract({ address:AGENT_ESCROW_ADDRESS, abi:agentEscrowAbi, functionName, args:[job.id] });

  const submit = (e:FormEvent) => {
    e.preventDefault();
    if (!submission.trim()) return;
    writeContract({ address:AGENT_ESCROW_ADDRESS, abi:agentEscrowAbi, functionName:'submitWork', args:[job.id,submission.trim()] });
  };

  return <div>
    <h3>Available actions</h3>
    <div className="actions">
      {Number(job.status) === 0 && !isClient && !expired && <button className="btn btnPrimary" onClick={()=>call('acceptJob')} disabled={isPending||confirming}>Accept Job</button>}
      {Number(job.status) === 0 && isClient && <button className="btn btnDanger" onClick={()=>call('cancelJob')} disabled={isPending||confirming}>Cancel & Refund</button>}
      {(Number(job.status) === 0 || Number(job.status) === 1) && isClient && expired && <button className="btn btnDanger" onClick={()=>call('claimExpiredRefund')} disabled={isPending||confirming}>Claim Expired Refund</button>}
      {Number(job.status) === 2 && isClient && <button className="btn btnPrimary" onClick={()=>call('approveJob')} disabled={isPending||confirming}>Approve & Release</button>}
    </div>
    {Number(job.status) === 1 && isAgent && !expired && <form className="form" onSubmit={submit} style={{marginTop:16}}>
      <div className="field"><label htmlFor="submission">Submission URI / proof</label><input id="submission" className="input" value={submission} onChange={e=>setSubmission(e.target.value)} placeholder="ipfs://... or delivery URL" /></div>
      <button className="btn btnPrimary" disabled={isPending||confirming}>{isPending||confirming?'Submitting…':'Submit Work'}</button>
    </form>}
    {hash && <p className="muted">Transaction: {hash}</p>}
    {isSuccess && <p className="success">Transaction confirmed. Refreshing the page will show the new state.</p>}
    {error && <p className="error">{error.message}</p>}
  </div>;
}
