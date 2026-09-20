'use client';

import { formatEther } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';
import { AGENT_ESCROW_ADDRESS, agentEscrowAbi, hasContractAddress } from '@/lib/contract';
import type { EscrowJob } from '@/lib/jobs';

export function DashboardStats(){
  const {data:count}=useReadContract({
    address:AGENT_ESCROW_ADDRESS,
    abi:agentEscrowAbi,
    functionName:'jobCount',
    query:{enabled:hasContractAddress}
  });

  const ids=Array.from({length:Number(count||0n)},(_,i)=>BigInt(i+1));
  const {data}=useReadContracts({
    contracts:ids.map(id=>({address:AGENT_ESCROW_ADDRESS,abi:agentEscrowAbi,functionName:'getJob' as const,args:[id] as const})),
    query:{enabled:hasContractAddress&&ids.length>0}
  });

  const jobs=(data||[]).filter((r:any)=>r.status==='success'&&r.result).map((r:any)=>r.result as EscrowJob);
  const escrow=jobs.filter(j=>[0,1,2].includes(Number(j.status))).reduce((sum,j)=>sum+j.reward,0n);
  const open=jobs.filter(j=>Number(j.status)===0).length;
  const active=jobs.filter(j=>[1,2].includes(Number(j.status))).length;
  const completed=jobs.filter(j=>Number(j.status)===3).length;

  return <section className="statsGrid">
    <div className="card"><div className="muted">BOT in Escrow</div><div className="statValue">{formatEther(escrow)}</div></div>
    <div className="card"><div className="muted">Open Jobs</div><div className="statValue">{open}</div></div>
    <div className="card"><div className="muted">Active Jobs</div><div className="statValue">{active}</div></div>
    <div className="card"><div className="muted">Completed</div><div className="statValue">{completed}</div></div>
  </section>;
}
