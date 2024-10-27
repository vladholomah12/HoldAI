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

      // Показуємо діалог вибору гаманця
      const result = await telegram.showPopup({
        title: 'Connect Wallet',
        message: 'Choose your wallet to connect',
        buttons: [
          { id: 'ton', type: 'default', text: 'TON Wallet' },
          { id: 'cancel', type: 'cancel' }
        ]
      });

      if (result.buttonId === 'ton') {
        // Імітуємо підключення TON гаманця
        // В реальному додатку тут буде справжня логіка підключення
        const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;

        // Зберігаємо інформацію про гаманець
        const response = await fetch('/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId,
            walletAddress: mockAddress,
            walletType: 'TON'
          })
        });

        if (response.ok) {
          const data = await response.json();
          onConnect(data.walletAddress);

          telegram.showPopup({
            message: 'Wallet connected successfully!',
            buttons: [{ type: 'ok' }]
          });
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // @ts-ignore
      window.Telegram.WebApp.showPopup({
        message: 'Failed to connect wallet. Please try again.',
        buttons: [{ type: 'ok' }]
      });
    } finally {
      setIsConnecting(false);
    }
  }, [telegramId, onConnect]);

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="w-full mt-4 p-2 border rounded-lg text-center flex items-center justify-center gap-2 hover:bg-gray-50"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
};