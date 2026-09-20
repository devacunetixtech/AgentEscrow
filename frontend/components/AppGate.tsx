'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { WalletButton } from './WalletButton';

export function AppGate({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <section className="gate card">
        <div className="eyebrow">Wallet required</div>
        <h1>Connect before opening AgentEscrow</h1>
        <p className="muted">
          The application is wallet-gated. Connect an EVM wallet, then return to the landing page and use the Open App button.
        </p>
        <div className="hero-actions">
          <WalletButton />
          <Link className="btn btn-outline" href="/">Back to home</Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
