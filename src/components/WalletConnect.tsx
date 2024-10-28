import React, { useState, useCallback } from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  telegramId: number;
  onConnect: (address: string) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const showError = useCallback(async (message: string) => {
    // @ts-ignore
    const telegram = window.Telegram.WebApp;
    return telegram.showPopup({
      message,
      buttons: [{ type: 'ok' }]
    });
  }, []);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    // @ts-ignore
    const telegram = window.Telegram.WebApp;

    try {
      // Відкриваємо Telegram Wallet
      telegram.openLink('tg://resolve?domain=wallet');

      // Запитуємо підтвердження у користувача
      const result = await telegram.showPopup({
        title: 'Connect Wallet',
        message: 'Did you connect your wallet in Telegram?',
        buttons: [
          { id: 'yes', type: 'default', text: 'Yes' },
          { id: 'no', type: 'default', text: 'No' }
        ]
      });

      if (result?.buttonId === 'yes') {
        const response = await fetch('/api/wallet/ton', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId })
        }).catch(() => null);

        if (!response?.ok) {
          await showError('Failed to connect wallet. Please try again.');
          return;
        }

        const data = await response.json().catch(() => null);
        if (!data?.address) {
          await showError('Could not get wallet address. Please try again.');
          return;
        }

        onConnect(data.address);
        await telegram.showPopup({
          message: 'Wallet connected successfully!',
          buttons: [{ type: 'ok' }]
        });
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      await showError('Something went wrong. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, [telegramId, onConnect, isConnecting, showError]);

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="w-full mt-4 p-2 text-blue-500 border border-blue-500 rounded-lg text-center flex items-center justify-center gap-2 hover:bg-blue-50"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect TON Wallet'}</span>
    </button>
  );
};