'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import type { WalletConnectProps } from '@/types/wallet';
import { CHAIN } from '@tonconnect/sdk';

interface WalletInfo {
  account: {
    address: string;
    chain: CHAIN;
  };
  device: {
    platform: string;
    appName: string;
  };
}

const WalletConnectComponent: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (!tonConnectUI) return;

    const handleStatusChange = (wallet: WalletInfo | null) => {
      if (wallet) {
        setIsConnected(true);
        if (wallet.account?.address) {
          onConnect(wallet.account.address).catch((error) => {
            console.error('Failed to connect wallet:', error);
          });
        }
      } else {
        setIsConnected(false);
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

  const handleConnect = () => {
    if (!isConnected && tonConnectUI) {
      // Використовуємо новий метод
      tonConnectUI.openModal().catch((error) => {
        console.error('Failed to open wallet modal:', error);
      });
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        className="w-full p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
        onClick={handleConnect}
      >
        <Wallet className="w-5 h-5" />
        <span>
          {isConnected ? 'Гаманець підключено' : 'Підв\'язати TON гаманець'}
        </span>
      </button>
    </div>
  );
};

export default WalletConnectComponent;