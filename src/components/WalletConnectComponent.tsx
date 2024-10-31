import React from 'react';
import { Wallet } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import type { WalletConnectProps } from '@/types/wallet';

const WalletConnectComponent: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        setIsConnected(true);
        if (wallet.account?.address) {
          onConnect(wallet.account.address);
        }
      } else {
        setIsConnected(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, onConnect]);

  if (!telegramId) {
    return null;
  }

  return (
    <div className="w-full">
      <button
        type="button"
        className="w-full p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
        onClick={() => !isConnected && tonConnectUI.connectWallet()}
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