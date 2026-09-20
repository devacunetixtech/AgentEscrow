'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { decodeEventLog, formatEther } from 'viem';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';

type HistoryRow = { name:string; args:any; hash:`0x${string}` };

export function HistoryTable(){
  const client = usePublicClient();
  const [rows,setRows] = useState<HistoryRow[]>([]);
  const [loading,setLoading] = useState(true);
  const [loadError,setLoadError] = useState('');

  useEffect(()=>{
    let active=true;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function load(){
      if(!client||!hasContractAddress) {
        if (active) {
          setLoadError('Live BOT Chain history is unavailable right now.');
          setLoading(false);
        }
        return;
      }
      try {
        const logs=await client.getLogs({address:AGENT_ESCROW_ADDRESS,fromBlock:0n,toBlock:'latest'});
        const decoded=logs.flatMap(log=>{
          try{
            const d=decodeEventLog({abi:agentEscrowAbi,data:log.data,topics:log.topics});
            return [{name:String(d.eventName),args:(d.args||{}) as any,hash:log.transactionHash}];
          }catch{return [];}
        }) as HistoryRow[];
        if(active){
          setRows(decoded.reverse());
          setLoadError('');
          setLoading(false);
        }
      } catch {
        if(active){
          setLoadError('Could not load BOT Chain history. Please try again.');
          setLoading(false);
        }
      }
    }

    load();
    timer=setInterval(load,10000);
    return()=>{active=false;if(timer)clearInterval(timer)};
  },[client]);

  if (loading) return <div className="card empty">Loading on-chain history…</div>;
  if (loadError) return <div className="card empty">{loadError}</div>;

  return <div className="card tableWrap"><table className="table"><thead><tr><th>Event</th><th>Job</th><th>Amount</th><th>Transaction</th></tr></thead><tbody>
    {!rows.length?<tr><td colSpan={4} className="muted">No AgentEscrow transactions yet.</td></tr>:rows.map((r,i)=><tr key={r.hash+i}><td>{r.name}</td><td>{r.args.jobId?.toString?.()||'—'}</td><td>{r.args.reward?formatEther(r.args.reward):r.args.refund?formatEther(r.args.refund):'—'}</td><td><a href={`https://scan.bohr.life/tx/${r.hash}`} target="_blank" rel="noreferrer">{String(r.hash).slice(0,10)}…</a></td></tr>)}
  </tbody></table></div>;
}
