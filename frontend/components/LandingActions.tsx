'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { WalletButton } from './WalletButton';

export function LandingActions() {
  const { isConnected } = useAccount();

  return (
    <div className="actions">
      <WalletButton />
      {isConnected ? (
        <Link className="btn btnSecondary" href="/app">Open App</Link>
      ) : (
        <button className="btn btnSecondary" disabled title="Connect your wallet first">Open App</button>
      )}
    </div>
  );
}
