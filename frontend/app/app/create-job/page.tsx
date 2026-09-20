'use client';

import { FormEvent, useState } from 'react';
import { parseEther } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';

export default function CreateJobPage(){
  const [details,setDetails] = useState('');
  const [reward,setReward] = useState('');
  const [deadline,setDeadline] = useState('');
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function onSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if (!hasContractAddress) return;
    const deadlineSeconds = BigInt(Math.floor(new Date(deadline).getTime()/1000));
    writeContract({
      address: AGENT_ESCROW_ADDRESS,
      abi: agentEscrowAbi,
      functionName: 'createJob',
      args: [details.trim(), deadlineSeconds],
      value: parseEther(reward),
    });
  }

  return (
    <>
      <div className="pageTop">
        <div>
          <div className="eyebrow">Create job</div>
          <h1>Fund a new escrow</h1>
          <p className="muted">Set the task, reward, and deadline. BOT is deposited into the contract when the transaction is submitted.</p>
        </div>
      </div>

      <form className="form card" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="details">Job details / metadata URI</label>
          <textarea id="details" className="textarea" value={details} onChange={e=>setDetails(e.target.value)} placeholder="ipfs://... or describe the work" required />
        </div>
        <div className="field">
          <label htmlFor="reward">Reward (BOT)</label>
          <input id="reward" className="input" value={reward} onChange={e=>setReward(e.target.value)} type="number" min="0" step="0.0001" placeholder="10" required />
        </div>
        <div className="field">
          <label htmlFor="deadline">Deadline</label>
          <input id="deadline" className="input" value={deadline} onChange={e=>setDeadline(e.target.value)} type="datetime-local" required />
        </div>
        <button className="btn btnPrimary" type="submit" disabled={!hasContractAddress || isPending || confirming}>
          {isPending || confirming ? 'Creating…' : 'Create & Deposit BOT'}
        </button>
        {!hasContractAddress && <p className="error">Contract not deployed/configured yet.</p>}
        {hash && <p className="muted">Transaction: {hash}</p>}
        {isSuccess && <p className="success">Job created successfully.</p>}
        {error && <p className="error">{error.message}</p>}
      </form>
    </>
  );
}
