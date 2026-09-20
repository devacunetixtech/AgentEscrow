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
          <div className="eyebrow">Dashboard</div>
          <h1>Escrow overview</h1>
          <p className="muted">Track jobs, escrow status, and recent activity for {address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'your wallet'}.</p>
        </div>
        <Link className="btn btnPrimary" href="/app/create-job">Create Job</Link>
      </div>

      <DashboardStats />

      <h2 className="sectionTitle">Quick actions</h2>
      <section className="jobsGrid">
        <Link className="card jobCard" href="/app/jobs"><span className="statusPill">Marketplace</span><h3>Browse open jobs</h3><p className="muted">Find funded jobs waiting for an agent.</p></Link>
        <Link className="card jobCard" href="/app/my-jobs"><span className="statusPill">Portfolio</span><h3>My jobs</h3><p className="muted">Review jobs you created or accepted.</p></Link>
        <Link className="card jobCard" href="/app/history"><span className="statusPill">On-chain</span><h3>Transaction history</h3><p className="muted">See escrow lifecycle events and payment activity.</p></Link>
      </section>
    </>
  );
}
