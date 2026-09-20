'use client';

import Link from 'next/link';
import { WalletButton } from './WalletButton';

export function AppHeader() {
  return (
    <header className="app-header">
      <Link className="brand" href="/">AgentEscrow</Link>
      <nav className="app-nav">
        <Link href="/app">Dashboard</Link>
        <Link href="/app/jobs">Open Jobs</Link>
        <Link href="/app/jobs/create">Create Job</Link>
        <Link href="/app/my-jobs">My Jobs</Link>
        <Link href="/app/history">History</Link>
      </nav>
      <WalletButton compact />
    </header>
  );
}
