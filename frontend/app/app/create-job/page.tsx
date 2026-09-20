'use client';

import { FormEvent, useState } from 'react';

export default function CreateJobPage(){
  const [message,setMessage] = useState('');

  function onSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setMessage('Contract write will be enabled immediately after the deployed AgentEscrow address is configured.');
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
          <textarea id="details" className="textarea" placeholder="ipfs://... or describe the work for the MVP" required />
        </div>
        <div className="field">
          <label htmlFor="reward">Reward (BOT)</label>
          <input id="reward" className="input" type="number" min="0" step="0.0001" placeholder="10" required />
        </div>
        <div className="field">
          <label htmlFor="deadline">Deadline</label>
          <input id="deadline" className="input" type="datetime-local" required />
        </div>
        <button className="btn btnPrimary" type="submit">Create & Deposit BOT</button>
        {message && <p className="muted">{message}</p>}
      </form>
    </>
  );
}
