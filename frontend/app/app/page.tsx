'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { DashboardStats } from '@/components/DashboardStats';

export default function DashboardPage(){
  const { address } = useAccount();

  return (
    <>
      <div className="pageTop">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">{address ? `Connected: ${address.slice(0,6)}…${address.slice(-4)}` : ''}</p>
        </div>
        <Link className="btn btnPrimary" href="/app/create-job">Create Job</Link>
      </div>

      <DashboardStats />

      <section className="jobsGrid">
        <Link className="card jobCard" href="/app/jobs"><h3>Open Jobs</h3><p className="muted">Browse funded jobs on BOT Chain.</p></Link>
        <Link className="card jobCard" href="/app/my-jobs"><h3>My Jobs</h3><p className="muted">See jobs linked to your wallet.</p></Link>
        <Link className="card jobCard" href="/app/history"><h3>History</h3><p className="muted">View AgentEscrow contract events.</p></Link>
      </section>
    </>
  );
}
