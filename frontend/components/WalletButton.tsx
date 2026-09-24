'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { botchainTestnet } from '../lib/botchain';
import { userErrorMessage } from '@/lib/userError';

function short(address?: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletButton({ compact = false }: { compact?: boolean }) {
  const {
    address,
    isConnected,
    chainId,
    connector: activeConnector,
  } = useAccount();

  const {
    connect,
    connectors,
    isPending,
    error: connectError,
    reset: resetConnect,
  } = useConnect();

  const {
    disconnect,
    isPending: disconnecting,
  } = useDisconnect();

  const {
    switchChain,
    isPending: switching,
    error: switchError,
  } = useSwitchChain();

  const connector =
    connectors.find((item) => item.id === 'injected') ??
    connectors.find((item) => item.type === 'injected') ??
    connectors[0];

  function handleConnect() {
    if (!connector) return;

    resetConnect();

    // Connect first. Network switching is handled separately after the
    // wallet is connected. This avoids stale injected-provider failures
    // after a shim disconnect.
    connect({ connector });
  }

  function handleDisconnect() {
    resetConnect();

    if (activeConnector) {
      disconnect(
        { connector: activeConnector },
        { onSuccess: () => resetConnect() }
      );
      return;
    }

    disconnect(undefined, { onSuccess: () => resetConnect() });
  }

  if (!isConnected) {
    return (
      <div className={compact ? 'walletConnect walletConnectCompact' : 'walletConnect'}>
        <button
          className={compact ? 'btn btnPrimary walletNavBtn' : 'btn btnPrimary'}
          onClick={handleConnect}
          disabled={isPending || !connector}
        >
          {isPending ? 'Connecting…' : 'Connect Wallet'}
        </button>

        {!connector && (
          <p className="error compactMessage">
            Open AgentEscrow in a wallet browser or install a compatible wallet.
          </p>
        )}

        {connectError && (
          <p className="error compactMessage">
            {userErrorMessage(connectError, 'Wallet connection failed. Please try again.')}
          </p>
        )}
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

        {switchError && (
          <p className="error compactMessage">
            {userErrorMessage(
              switchError,
              'Could not switch networks. Please select BOT Chain Testnet in your wallet.'
            )}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={compact ? 'walletArea walletAreaCompact' : 'walletArea'}>
      {!compact && <span className="address">{short(address)}</span>}

      <button
        className={compact ? 'btn btnSecondary walletNavBtn' : 'btn btnSecondary'}
        onClick={handleDisconnect}
        disabled={disconnecting}
      >
        {disconnecting ? 'Disconnecting…' : 'Disconnect'}
      </button>
    </div>
  );
}
