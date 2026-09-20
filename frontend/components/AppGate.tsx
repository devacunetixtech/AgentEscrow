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
            <div className="eyebrow">Wallet required</div>
            <h1>Connect before opening AgentEscrow</h1>
            <p className="muted">The app is wallet-gated. Connecting does not redirect you automatically; from the landing page, use Open App when you are ready.</p>
            <div className="actions">
              <WalletButton />
              <Link className="btn btnSecondary" href="/">Back to home</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
