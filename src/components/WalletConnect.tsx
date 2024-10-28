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
        message: 'Please select a wallet type',
        buttons: [
          { id: 'telegram', type: 'default', text: 'Telegram Wallet' },
          { id: 'external', type: 'default', text: 'External Wallet' },
          { id: 'cancel', type: 'cancel' }
        ]
      });

      if (result.buttonId === 'telegram') {
        // Для Telegram Wallet використовуємо прямий протокол
        const walletUrl = 'tg://resolve?domain=wallet';
        telegram.openLink(walletUrl);

        // Очікуємо на підтвердження від користувача
        const confirmResult = await telegram.showPopup({
          title: 'Wallet Connection',
          message: 'Did you connect your wallet in Telegram?',
          buttons: [
            { id: 'yes', type: 'default', text: 'Yes' },
            { id: 'no', type: 'default', text: 'No' }
          ]
        });

        if (confirmResult.buttonId === 'yes') {
          // В реальному додатку тут має бути запит до Telegram Wallet API
          const mockAddress = `EQ${Math.random().toString(36).substring(2, 15)}`;

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
      } else if (result.buttonId === 'external') {
        // Для зовнішніх гаманців показуємо QR-код або deeplink
        telegram.openLink('https://ton.org/wallets');
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
      onClick={connectWallet}
      disabled={isConnecting}
      className="w-full mt-4 p-2 text-blue-500 border border-blue-500 rounded-lg text-center flex items-center justify-center gap-2 hover:bg-blue-50"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect TON Wallet'}</span>
    </button>
  );
};