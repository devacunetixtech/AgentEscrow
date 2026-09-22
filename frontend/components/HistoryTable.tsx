'use client';

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { decodeEventLog, formatEther } from 'viem';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import { EscrowJob, sameAddress } from '@/lib/jobs';

type HistoryRow = {
  name:string;
  args:any;
  hash:`0x${string}`;
  blockNumber:bigint;
  logIndex:number;
};

const LABELS:Record<string,string>={
  JobCreated:'Job created',
  JobAccepted:'Job accepted',
  WorkSubmitted:'Work submitted',
  JobCompleted:'Payment released',
  JobCancelled:'Job cancelled',
  JobExpired:'Refund claimed'
};

export function HistoryTable(){
  const { address } = useAccount();
  const client = usePublicClient();
  const [rows,setRows] = useState<HistoryRow[]>([]);
  const [loading,setLoading] = useState(true);
  const [loadError,setLoadError] = useState('');

  useEffect(()=>{
    let active=true;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function load(){
      if(!client||!hasContractAddress||!address) {
        if (active) {
          setRows([]);
          setLoadError(address ? 'Live BOT Chain history is unavailable right now.' : 'Connect your wallet to view your AgentEscrow history.');
          setLoading(false);
        }
        return;
      }

      try {
        const logs=await client.getLogs({
          address:AGENT_ESCROW_ADDRESS,
          fromBlock:0n,
          toBlock:'latest'
        });

        const decoded=logs.flatMap(log=>{
          try{
            const d=decodeEventLog({abi:agentEscrowAbi,data:log.data,topics:log.topics});
            const args=(d.args||{}) as any;
            if (args.jobId === undefined) return [];
            return [{
              name:String(d.eventName),
              args,
              hash:log.transactionHash,
              blockNumber:log.blockNumber,
              logIndex:log.logIndex
            }];
          }catch{return [];}
        }) as HistoryRow[];

        const jobIds=[...new Set(decoded.map(row=>row.args.jobId.toString()))].map(id=>BigInt(id));
        const jobEntries=await Promise.all(jobIds.map(async jobId=>{
          try{
            const job=await client.readContract({
              address:AGENT_ESCROW_ADDRESS,
              abi:agentEscrowAbi,
              functionName:'getJob',
              args:[jobId]
            }) as EscrowJob;
            return [jobId.toString(),job] as const;
          }catch{
            return [jobId.toString(),null] as const;
          }
        }));

        const jobs=new Map(jobEntries);
        const walletRows=decoded
          .filter(row=>{
            const job=jobs.get(row.args.jobId.toString());
            if(!job) return false;
            return sameAddress(job.client,address) || sameAddress(job.agent,address);
          })
          .sort((a,b)=>{
            if(a.blockNumber===b.blockNumber) return b.logIndex-a.logIndex;
            return a.blockNumber>b.blockNumber?-1:1;
          });

        if(active){
          setRows(walletRows);
          setLoadError('');
          setLoading(false);
        }
      } catch {
        if(active){
          setLoadError('Could not load your AgentEscrow history. Please try again.');
          setLoading(false);
        }
      }
    }

    setLoading(true);
    load();
    timer=setInterval(load,10000);
    return()=>{active=false;if(timer)clearInterval(timer)};
  },[client,address]);

  if (loading) return <div className="card empty">Loading your AgentEscrow activity…</div>;
  if (loadError) return <div className="card empty">{loadError}</div>;

  return <div className="card tableWrap">
    <div className="historyHeader">
      <div>
        <span className="pageKicker">Connected wallet</span>
        <p className="muted">Only interactions involving your wallet and the AgentEscrow contract are shown.</p>
      </div>
      <span className="address">{address?.slice(0,6)}…{address?.slice(-4)}</span>
    </div>
    <table className="table">
      <thead><tr><th>Activity</th><th>Job</th><th>Amount</th><th>Transaction</th></tr></thead>
      <tbody>
        {!rows.length
          ? <tr><td colSpan={4} className="muted">This wallet has no AgentEscrow activity yet.</td></tr>
          : rows.map((r,i)=><tr key={r.hash+i}>
              <td>{LABELS[r.name]||r.name}</td>
              <td>#{r.args.jobId?.toString?.()||'—'}</td>
              <td>{r.args.reward?formatEther(r.args.reward):r.args.refund?formatEther(r.args.refund):'—'}</td>
              <td><a className="inlineLink" href={`https://scan.botchain.ai/tx/${r.hash}`} target="_blank" rel="noreferrer">{String(r.hash).slice(0,10)}…</a></td>
            </tr>)}
      </tbody>
    </table>
  </div>;
}
