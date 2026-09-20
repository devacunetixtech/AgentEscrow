'use client';

import { FormEvent, useState } from 'react';
import { parseEther } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import { userErrorMessage } from '@/lib/userError';

export default function CreateJobPage(){
  const [details,setDetails] = useState('');
  const [reward,setReward] = useState('');
  const [deadline,setDeadline] = useState('');
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [formError,setFormError] = useState('');
  const busy = isPending || confirming;

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
      args: [details.trim(), BigInt(Math.floor(when/1000))],
      value: parseEther(reward),
    });
  }

  return (
    <>
      <div className="pageTop">
        <div>
          <h1>Create Job</h1>
          <p className="muted">Fund the escrow with BOT and publish the job on-chain.</p>
        </div>
      </div>

      <form className="form card" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="details">Job details</label>
          <textarea id="details" className="textarea" value={details} onChange={e=>setDetails(e.target.value)} placeholder="Describe the work or add a metadata link" required />
        </div>
        <div className="field">
          <label htmlFor="reward">Reward (BOT)</label>
          <input id="reward" className="input" value={reward} onChange={e=>setReward(e.target.value)} type="number" min="0" step="0.0001" placeholder="10" required />
        </div>
        <div className="field">
          <label htmlFor="deadline">Deadline</label>
          <input id="deadline" className="input" value={deadline} onChange={e=>setDeadline(e.target.value)} type="datetime-local" required />
        </div>
        <button className="btn btnPrimary" type="submit" disabled={!hasContractAddress || busy}>
          {busy ? 'Check your wallet…' : 'Create Job'}
        </button>
        {formError && <p className="error">{formError}</p>}
        {hash && <p className="muted compactMessage">Transaction submitted. Waiting for BOT Chain confirmation.</p>}
        {isSuccess && <p className="success">Job created on BOT Chain.</p>}
        {error && <p className="error">{userErrorMessage(error, 'The job could not be created. Please check your wallet balance and try again.')}</p>}
      </form>
    </>
  );
}
