'use client';

import { FormEvent, useState } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi } from '@/lib/contract';
import { EscrowJob, sameAddress } from '@/lib/jobs';
import { userErrorMessage } from '@/lib/userError';

export function JobActions({ job }:{job:EscrowJob}) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [submission,setSubmission] = useState('');

  const isClient = sameAddress(job.client,address);
  const isAgent = sameAddress(job.agent,address);
  const expired = Date.now()/1000 >= Number(job.deadline);
  const busy = isPending || confirming;

  const call = (functionName:'acceptJob'|'approveJob'|'cancelJob'|'claimExpiredRefund') =>
    writeContract({ address:AGENT_ESCROW_ADDRESS, abi:agentEscrowAbi, functionName, args:[job.id] });

  const submit = (e:FormEvent) => {
    e.preventDefault();
    if (!submission.trim()) return;
    writeContract({ address:AGENT_ESCROW_ADDRESS, abi:agentEscrowAbi, functionName:'submitWork', args:[job.id,submission.trim()] });
  };

  return <div>
    <h3>Actions</h3>
    <div className="actions compactActions">
      {Number(job.status) === 0 && !isClient && !expired && <button className="btn btnPrimary" onClick={()=>call('acceptJob')} disabled={busy}>{busy?'Check your wallet…':'Accept Job'}</button>}
      {Number(job.status) === 0 && isClient && <button className="btn btnDanger" onClick={()=>call('cancelJob')} disabled={busy}>{busy?'Check your wallet…':'Cancel & Refund'}</button>}
      {(Number(job.status) === 0 || Number(job.status) === 1) && isClient && expired && <button className="btn btnDanger" onClick={()=>call('claimExpiredRefund')} disabled={busy}>{busy?'Check your wallet…':'Claim Refund'}</button>}
      {Number(job.status) === 2 && isClient && <button className="btn btnPrimary" onClick={()=>call('approveJob')} disabled={busy}>{busy?'Check your wallet…':'Approve & Release'}</button>}
    </div>
    {Number(job.status) === 1 && isAgent && !expired && <form className="form" onSubmit={submit} style={{marginTop:16}}>
      <div className="field">
        <label htmlFor="submission">Delivery link or proof</label>
        <input id="submission" className="input" value={submission} onChange={e=>setSubmission(e.target.value)} placeholder="https://… or ipfs://…" required />
      </div>
      <button className="btn btnPrimary" disabled={busy}>{busy?'Check your wallet…':'Submit Work'}</button>
    </form>}
    {hash && <p className="muted compactMessage">Transaction submitted. Waiting for BOT Chain confirmation.</p>}
    {isSuccess && <p className="success">Confirmed on BOT Chain.</p>}
    {error && <p className="error">{userErrorMessage(error, 'This action could not be completed. Check the job status and try again.')}</p>}
  </div>;
}
