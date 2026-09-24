'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { botchainTestnet } from '../lib/botchain';
import { userErrorMessage } from '@/lib/userError';

function short(address?: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletButton({ compact = false }: { compact?: boolean }) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching, error: switchError } = useSwitchChain();

  if (!isConnected) {
    const connector = connectors[0];
    return (
      <div className={compact ? 'walletConnect walletConnectCompact' : 'walletConnect'}>
        <button
          className={compact ? 'btn btnPrimary walletNavBtn' : 'btn btnPrimary'}
          onClick={() => connector && connect({ connector })}
          disabled={isPending || !connector}
        >
          {isPending ? 'Connecting…' : 'Connect Wallet'}
        </button>
        {!connector && <p className="error compactMessage">Open AgentEscrow in a wallet browser or install a compatible wallet.</p>}
        {connectError && <p className="error compactMessage">{userErrorMessage(connectError, 'Wallet connection failed. Please try again.')}</p>}
      </div>
    );
  }

  if (chainId !== botchainTestnet.id) {
    return (
      <div className={compact ? 'walletConnect walletConnectCompact' : 'walletConnect'}>
        <button
          className={compact ? 'btn btnPrimary walletNavBtn' : 'btn btnPrimary'}
          onClick={() => switchChain({ chainId: botchainTestnet.id })}
          disabled={switching}
        >
          {switching ? 'Switching…' : compact ? 'Switch Network' : 'Switch to BOT Chain Testnet'}
        </button>
        {switchError && <p className="error compactMessage">{userErrorMessage(switchError, 'Could not switch networks. Please select BOT Chain Testnet in your wallet.')}</p>}
      </div>
    );
  }

  return (
    <div className={compact ? 'walletArea walletAreaCompact' : 'walletArea'}>
      {!compact && <span className="address">{short(address)}</span>}
      <button
        className={compact ? 'btn btnSecondary walletNavBtn' : 'btn btnSecondary'}
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
