'use client';

import Link from 'next/link';
import { WalletButton } from './WalletButton';

export function AppHeader() {
  return (
    <header className="appHeader">
      <Link className="brand brandLockup" href="/">
        <span className="brandMark">AE</span>
        <span>AgentEscrow</span>
      </Link>

      <nav className="appNav" aria-label="App navigation">
        <Link href="/app">Dashboard</Link>
        <Link href="/app/jobs">Open Jobs</Link>
        <Link href="/app/create-job">Create Job</Link>
        <Link href="/app/my-jobs">My Jobs</Link>
        <Link href="/app/history">History</Link>
      </nav>

      <WalletButton compact />
    </header>
  );
}
