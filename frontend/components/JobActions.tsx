'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi } from '@/lib/contract';
import { EscrowJob, sameAddress } from '@/lib/jobs';
import { userErrorMessage } from '@/lib/userError';

export function JobActions({ job, onConfirmed }:{job:EscrowJob;onConfirmed?:()=>void}) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [submission,setSubmission] = useState('');

  const status = Number(job.status);
  const isClient = sameAddress(job.client,address);
  const isAgent = sameAddress(job.agent,address);
  const expired = Date.now()/1000 >= Number(job.deadline);
  const busy = isPending || confirming;

  useEffect(() => {
    if (!isSuccess) return;
    onConfirmed?.();
    setSubmission('');
  }, [isSuccess, onConfirmed]);

  const call = (functionName:'acceptJob'|'approveJob'|'cancelJob'|'claimExpiredRefund') => {
    reset();
    writeContract({ address:AGENT_ESCROW_ADDRESS, abi:agentEscrowAbi, functionName, args:[job.id] });
  };

  const submit = (e:FormEvent) => {
    e.preventDefault();
    if (!submission.trim()) return;
    reset();
    writeContract({
      address:AGENT_ESCROW_ADDRESS,
      abi:agentEscrowAbi,
      functionName:'submitWork',
      args:[job.id,submission.trim()]
    });
  };

  let content: React.ReactNode;

  if (status === 0) {
    if (expired && isClient) {
      content = <button className="btn btnDanger actionFull" onClick={()=>call('claimExpiredRefund')} disabled={busy}>{busy?'Check your wallet…':'Claim Expired Refund'}</button>;
    } else if (expired) {
      content = <ActionState title="Job expired" body="Only the client can claim the escrow refund." />;
    } else if (isClient) {
      content = (
        <>
          <ActionState title="Waiting for an agent" body="This job is open and funded. You can cancel it before an agent accepts." />
          <button className="btn btnDanger actionFull" onClick={()=>call('cancelJob')} disabled={busy}>{busy?'Check your wallet…':'Cancel Job & Refund'}</button>
        </>
      );
    } else {
      content = (
        <>
          <ActionState title="Ready to accept" body="Accepting assigns this job to your connected wallet. Only that wallet will be able to submit the work." />
          <button className="btn btnPrimary actionFull" onClick={()=>call('acceptJob')} disabled={busy}>{busy?'Check your wallet…':'Accept Job'}</button>
        </>
      );
    }
  } else if (status === 1) {
    if (expired && isClient) {
      content = (
        <>
          <ActionState title="Deadline passed" body="No work was submitted before the deadline. You can claim the escrowed BOT back." />
          <button className="btn btnDanger actionFull" onClick={()=>call('claimExpiredRefund')} disabled={busy}>{busy?'Check your wallet…':'Claim Refund'}</button>
        </>
      );
    } else if (expired && isAgent) {
      content = <ActionState title="Deadline passed" body="The submission window has closed. The client can now claim a refund." />;
    } else if (isAgent) {
      content = (
        <>
          <ActionState title="You accepted this job" body="Submit your delivery link or proof before the deadline." />
          <form className="form actionForm" onSubmit={submit}>
            <div className="field">
              <label htmlFor="submission">Delivery link or proof</label>
              <input id="submission" className="input" value={submission} onChange={e=>setSubmission(e.target.value)} placeholder="https://… or ipfs://…" required />
            </div>
            <button className="btn btnPrimary actionFull" disabled={busy}>{busy?'Check your wallet…':'Submit Work'}</button>
          </form>
        </>
      );
    } else if (isClient) {
      content = <ActionState title="Agent is working" body="The job has been accepted. You’ll be able to review and approve it after the agent submits." />;
    } else {
      content = <ActionState title="Already assigned" body="Another wallet accepted this job. Browse Open Jobs to find work that is still available." />;
    }
  } else if (status === 2) {
    if (isClient) {
      content = (
        <>
          <ActionState title="Delivery submitted" body="Review the submitted work. Approving releases the escrowed BOT to the assigned agent." />
          <button className="btn btnPrimary actionFull" onClick={()=>call('approveJob')} disabled={busy}>{busy?'Check your wallet…':'Approve & Release BOT'}</button>
        </>
      );
    } else if (isAgent) {
      content = <ActionState title="Submitted for approval" body="Your delivery is waiting for the client. BOT will be sent to your wallet when they approve it." />;
    } else {
      content = <ActionState title="Awaiting client approval" body="The assigned agent has submitted the work." />;
    }
  } else if (status === 3) {
    content = <ActionState title="Payment complete" body={isAgent ? 'The client approved the work and the escrow payment was released to your wallet.' : 'This job is complete and the escrow payment has been released.'} tone="success" />;
  } else if (status === 4) {
    content = <ActionState title="Job cancelled" body="The job was cancelled before an agent accepted it and the escrow was refunded." />;
  } else if (status === 5) {
    content = <ActionState title="Escrow refunded" body="The deadline passed without a submitted delivery and the client reclaimed the escrowed BOT." />;
  } else {
    content = <ActionState title="Status unavailable" body="This job state could not be determined. Refresh the page and try again." />;
  }

  return (
    <div className="jobActionsPanel">
      <div className="actionHeading">
        <span className="pageKicker">Job actions</span>
        <h3>What happens next</h3>
      </div>
      <div className="actionStack">{content}</div>
      {hash && !isSuccess && <p className="muted compactMessage">Transaction submitted. Waiting for BOT Chain confirmation.</p>}
      {isSuccess && <p className="success actionNotice">Confirmed on BOT Chain. Job status updated.</p>}
      {error && <p className="error actionNotice">{userErrorMessage(error, 'This action could not be completed. Check the job status and try again.')}</p>}
    </div>
  );
}

function ActionState({title,body,tone}:{title:string;body:string;tone?:'success'}) {
  return (
    <div className={tone === 'success' ? 'actionState actionStateSuccess' : 'actionState'}>
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}
