'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { botchainTestnet } from '../lib/botchain';

function short(address?: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletButton({ compact = false }: { compact?: boolean }) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();

  if (!isConnected) {
    return (
      <button
        className={compact ? 'btn btn-small' : 'btn'}
        onClick={() => connectors[0] && connect({ connector: connectors[0] })}
        disabled={isPending || !connectors[0]}
      >
        {isPending ? 'Connecting…' : 'Connect Wallet'}
      </button>
    );
  }

  if (chainId !== botchainTestnet.id) {
    return (
      <button
        className={compact ? 'btn btn-small' : 'btn'}
        onClick={() => switchChain({ chainId: botchainTestnet.id })}
        disabled={switching}
      >
        {switching ? 'Switching…' : 'Switch to BOT Testnet'}
      </button>
    );
  }

  return (
    <div className="wallet-actions">
      <span className="wallet-pill">{short(address)}</span>
      <button className="btn btn-outline btn-small" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
