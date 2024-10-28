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

      // Пробуємо використати вбудований TonConnect
      if (telegram.TonConnect) {
        const result = await telegram.TonConnect.connect();
        if (result?.address) {
          const response = await fetch('/api/wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramId,
              walletAddress: result.address
            })
          });

          if (response.ok) {
            const data = await response.json();
            onConnect(data.walletAddress);
            await telegram.showPopup({
              message: 'Wallet connected successfully!',
              buttons: [{ type: 'ok' }]
            });
            return;
          }
        }
      }

      // Якщо TonConnect недоступний, показуємо список гаманців
      const popupResult = await telegram.showPopup({
        title: 'Connect TON Wallet',
        message: 'Select your wallet',
        buttons: [
          { id: 'ton_native', type: 'default', text: 'Open Telegram Wallet' },
          { id: 'tonkeeper', type: 'default', text: 'Tonkeeper' },
          { id: 'mytonwallet', type: 'default', text: 'MyTonWallet' },
          { id: 'cancel', type: 'cancel' }
        ]
      });

      if (popupResult.buttonId === 'ton_native') {
        // Відкриваємо вбудований гаманець Telegram
        if (telegram.openTelegramLink) {
          telegram.openTelegramLink('https://t.me/wallet');
        } else {
          telegram.openLink('https://t.me/wallet');
        }
      } else if (popupResult.buttonId && popupResult.buttonId !== 'cancel') {
        const walletUrls = {
          tonkeeper: 'https://app.tonkeeper.com/ton-connect',
          mytonwallet: 'https://mytonwallet.io/ton-connect'
        };

        const selectedWallet = popupResult.buttonId as keyof typeof walletUrls;
        if (walletUrls[selectedWallet]) {
          telegram.openLink(walletUrls[selectedWallet]);
        }
      }

      // Імітуємо підключення (в реальному додатку тут буде очікування callback)
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