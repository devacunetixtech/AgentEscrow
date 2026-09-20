'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { decodeEventLog, formatEther, parseEther } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import { userErrorMessage } from '@/lib/userError';

type CreatedJob = {
  id: bigint;
  reward: bigint;
  deadline: bigint;
  details: string;
  txHash: `0x${string}`;
};

export default function CreateJobPage(){
  const [details,setDetails] = useState('');
  const [reward,setReward] = useState('');
  const [deadline,setDeadline] = useState('');
  const [formError,setFormError] = useState('');
  const [createdJob,setCreatedJob] = useState<CreatedJob | null>(null);
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { data: receipt, isLoading: confirming } = useWaitForTransactionReceipt({ hash });
  const busy = isPending || confirming;

  const deadlineSeconds = useMemo(() => {
    const when = new Date(deadline).getTime();
    return when ? BigInt(Math.floor(when / 1000)) : 0n;
  }, [deadline]);

  useEffect(() => {
    if (!receipt || !hash || createdJob) return;

    const log = receipt.logs.find((item) => {
      try {
        const decoded = decodeEventLog({ abi: agentEscrowAbi, data: item.data, topics: item.topics });
        return decoded.eventName === 'JobCreated';
      } catch {
        return false;
      }
    });

    if (!log) return;

    try {
      const decoded = decodeEventLog({ abi: agentEscrowAbi, data: log.data, topics: log.topics });
      if (decoded.eventName !== 'JobCreated') return;
      const args = decoded.args as { jobId: bigint; reward: bigint; deadline: bigint };
      setCreatedJob({
        id: args.jobId,
        reward: args.reward,
        deadline: args.deadline,
        details,
        txHash: hash,
      });
    } catch {
      // Receipt is confirmed, but if event decoding fails we keep the form state visible.
    }
  }, [receipt, hash, createdJob, details]);

  function onSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setFormError('');

    const when = new Date(deadline).getTime();
    if (!details.trim()) return setFormError('Add the job details before continuing.');
    if (!reward || Number(reward) <= 0) return setFormError('Enter a BOT reward greater than 0.');
    if (!when || when <= Date.now()) return setFormError('Choose a deadline in the future.');
    if (!hasContractAddress) return setFormError('AgentEscrow is temporarily unavailable. Please try again shortly.');

    writeContract({
      address: AGENT_ESCROW_ADDRESS,
      abi: agentEscrowAbi,
      functionName: 'createJob',
      args: [details.trim(), deadlineSeconds],
      value: parseEther(reward),
    });
  }

  function closeModal(){
    setCreatedJob(null);
    setDetails('');
    setReward('');
    setDeadline('');
    reset();
  }

  return (
    <>
      <div className="pageTop">
        <div>
          <span className="pageKicker">Create escrow</span>
          <h1>Create Job</h1>
          <p className="muted">Set the work, reward, and deadline. Your wallet will deposit BOT directly into the escrow contract.</p>
        </div>
      </div>

      <div className="formLayout">
        <form className="form card formCard" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="details">Job details</label>
            <textarea id="details" className="textarea" value={details} onChange={e=>setDetails(e.target.value)} placeholder="Describe the work or add a metadata link" required />
            <small>Be specific enough for the agent to understand the expected delivery.</small>
          </div>
          <div className="field">
            <label htmlFor="reward">Reward</label>
            <div className="inputWithSuffix">
              <input id="reward" className="input" value={reward} onChange={e=>setReward(e.target.value)} type="number" min="0" step="0.0001" placeholder="10" required />
              <span>BOT</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="deadline">Deadline</label>
            <input id="deadline" className="input" value={deadline} onChange={e=>setDeadline(e.target.value)} type="datetime-local" required />
          </div>
          <button className="btn btnPrimary submitBtn" type="submit" disabled={!hasContractAddress || busy}>
            {busy ? 'Check your wallet…' : 'Create Job'}
          </button>
          {formError && <p className="error">{formError}</p>}
          {hash && !receipt && <p className="muted compactMessage">Transaction submitted. Waiting for BOT Chain confirmation.</p>}
          {error && <p className="error">{userErrorMessage(error, 'The job could not be created. Please check your wallet balance and try again.')}</p>}
        </form>

        <aside className="card formAside">
          <span className="pageKicker">What happens next</span>
          <ol className="asideSteps">
            <li><span>1</span><div><strong>BOT is locked</strong><p>Your reward moves into the AgentEscrow contract.</p></div></li>
            <li><span>2</span><div><strong>The job becomes open</strong><p>Agents can view and accept it from Open Jobs.</p></div></li>
            <li><span>3</span><div><strong>You approve delivery</strong><p>BOT is released only after the submitted work is approved.</p></div></li>
          </ol>
        </aside>
      </div>

      {createdJob && (
        <div className="modalBackdrop" role="presentation">
          <section className="modalCard" role="dialog" aria-modal="true" aria-labelledby="job-created-title">
            <div className="modalSuccessIcon">✓</div>
            <span className="pageKicker">Confirmed on BOT Chain</span>
            <h2 id="job-created-title">Job #{createdJob.id.toString()} is live</h2>
            <p className="muted modalLead">Your BOT is now held by the AgentEscrow contract and the job is available to agents.</p>

            <div className="modalDetails">
              <div><span>Reward</span><strong>{formatEther(createdJob.reward)} BOT</strong></div>
              <div><span>Deadline</span><strong>{new Date(Number(createdJob.deadline) * 1000).toLocaleString()}</strong></div>
              <div className="modalDetailWide"><span>Job details</span><strong>{createdJob.details}</strong></div>
              <div className="modalDetailWide"><span>Transaction</span><a href={`https://scan.bohr.life/tx/${createdJob.txHash}`} target="_blank" rel="noreferrer">View on explorer ↗</a></div>
            </div>

            <div className="modalActions">
              <Link className="btn btnPrimary" href="/app/my-jobs">Go to My Jobs</Link>
              <button className="btn btnSecondary" type="button" onClick={closeModal}>Create Another</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
