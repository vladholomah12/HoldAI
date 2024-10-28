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

      const result = await telegram.showPopup({
        title: 'Connect TON Wallet',
        message: 'Select a wallet to connect',
        buttons: [
          { id: 'tonkeeper', type: 'default', text: 'Tonkeeper' },
          { id: 'mytonwallet', type: 'default', text: 'MyTonWallet' },
          { id: 'tonhub', type: 'default', text: 'Tonhub' },
          { id: 'cancel', type: 'cancel' }
        ]
      });

      if (result && result.buttonId && result.buttonId !== 'cancel') {
        // Мапа URL'ів гаманців
        const walletUrls = {
          tonkeeper: 'https://app.tonkeeper.com/ton-connect',
          mytonwallet: 'https://mytonwallet.io/ton-connect',
          tonhub: 'https://tonhub.com/ton-connect'
        };

        const selectedWallet = result.buttonId as keyof typeof walletUrls;
        if (walletUrls[selectedWallet]) {
          // Відкриваємо вибраний гаманець без await, оскільки метод не асинхронний
          telegram.openLink(walletUrls[selectedWallet]);

          // Імітуємо підключення гаманця (в реальному додатку тут буде справжня адреса)
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
        }
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