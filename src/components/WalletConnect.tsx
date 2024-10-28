import React, { useState, useCallback } from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  telegramId: number;
  onConnect: (address: string) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);

      // @ts-ignore
      const telegram = window.Telegram.WebApp;

      // Використовуємо deep linking для відкриття TON гаманця
      const tonUrl = 'ton://transfer/';
      telegram.openLink(tonUrl);

      // В реальному додатку тут має бути логіка підписання повідомлення
      // і отримання адреси гаманця через API Telegram
      const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          walletAddress: mockAddress
        })
      });

      if (response.ok) {
        const data = await response.json();
        onConnect(data.walletAddress);

        await telegram.showPopup({
          message: 'Wallet connected successfully!',
          buttons: [{ type: 'ok' }]
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // @ts-ignore
      const telegram = window.Telegram.WebApp;
      await telegram.showPopup({
        message: 'Failed to connect wallet. Please try again.',
        buttons: [{ type: 'ok' }]
      });
    } finally {
      setIsConnecting(false);
    }
  }, [telegramId, onConnect]);

  return (
    <button
      onClick={() => void connectWallet()}
      disabled={isConnecting}
      className="w-full mt-4 p-2 text-blue-500 border border-blue-500 rounded-lg text-center flex items-center justify-center gap-2 hover:bg-blue-50"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect TON Wallet'}</span>
    </button>
  );
};