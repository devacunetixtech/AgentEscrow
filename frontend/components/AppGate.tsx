'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { WalletButton } from './WalletButton';

export function AppGate({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <main className="appShell">
        <section className="gate">
          <div className="card">
            <h1>Connect your wallet</h1>
            <p className="muted">AgentEscrow uses your wallet to sign real BOT Chain transactions.</p>
            <div className="actions">
              <WalletButton />
              <Link className="btn btnSecondary" href="/">Back Home</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
