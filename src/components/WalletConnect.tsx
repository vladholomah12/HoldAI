'use client';

import React from 'react';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import type { WalletConnectProps } from '@/types/wallet';

const WalletConnect: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
  const [tonConnectUI] = useTonConnectUI();

  React.useEffect(() => {
    if (!tonConnectUI) return;

    const handleStatusChange = async (wallet: any) => {
      if (wallet?.account?.address) {
        try {
          await onConnect(wallet.account.address);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
    };

    const unsubscribe = tonConnectUI.onStatusChange(handleStatusChange);
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, onConnect]);

  if (!telegramId) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <TonConnectButton />
    </div>
  );
};

export default WalletConnect;