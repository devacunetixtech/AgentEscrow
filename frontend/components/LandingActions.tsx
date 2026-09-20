'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { WalletButton } from './WalletButton';

export function LandingActions() {
  const { isConnected } = useAccount();

  return (
    <div className="landingNavActions">
      <WalletButton compact />
      {isConnected ? (
        <Link className="btn btnPrimary navOpenBtn" href="/app">Open App</Link>
      ) : (
        <button className="btn btnSecondary navOpenBtn" disabled title="Connect your wallet first">Open App</button>
      )}
    </div>
  );
}
