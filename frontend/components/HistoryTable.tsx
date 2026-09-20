'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { decodeEventLog, formatEther } from 'viem';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';

export function HistoryTable(){
  const client = usePublicClient();
  const [rows,setRows] = useState<any[]>([]);

  useEffect(()=>{
    let active=true;
    async function load(){
      if(!client||!hasContractAddress) return;
      const logs=await client.getLogs({address:AGENT_ESCROW_ADDRESS,fromBlock:0n,toBlock:'latest'});
      const decoded=logs.flatMap(log=>{
        try{
          const d=decodeEventLog({abi:agentEscrowAbi,data:log.data,topics:log.topics});
          const a:any=d.args||{};
          return [{name:d.eventName,args:a,hash:log.transactionHash}];
        }catch{return [];}
      });
      if(active)setRows(decoded.reverse());
    }
    load().catch(()=>{});
    return()=>{active=false};
  },[client]);

  return <div className="card tableWrap"><table className="table"><thead><tr><th>Event</th><th>Job</th><th>Amount</th><th>Transaction</th></tr></thead><tbody>
    {!rows.length?<tr><td colSpan={4} className="muted">No contract events found.</td></tr>:rows.map((r,i)=><tr key={r.hash+i}><td>{r.name}</td><td>{r.args.jobId?.toString?.()||'—'}</td><td>{r.args.reward?formatEther(r.args.reward):r.args.refund?formatEther(r.args.refund):'—'}</td><td><a href={`https://scan.bohr.life/tx/${r.hash}`} target="_blank" rel="noreferrer">{String(r.hash).slice(0,10)}…</a></td></tr>)}
  </tbody></table></div>;
}
