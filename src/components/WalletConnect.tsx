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
    await telegram.showPopup({
      message: message || 'Failed to connect wallet. Please try again.',
      buttons: [{ type: 'ok' }]
    });
    setIsConnecting(false);
  }, []);

  const saveWalletAddress = useCallback(async (address: string): Promise<boolean> => {
    // @ts-ignore
    const telegram = window.Telegram.WebApp;

    const response = await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId,
        walletAddress: address
      })
    });

    if (!response.ok) {
      await showError('Failed to save wallet address');
      return false;
    }

    const data = await response.json();
    onConnect(data.walletAddress);

    await telegram.showPopup({
      message: 'Wallet connected successfully!',
      buttons: [{ type: 'ok' }]
    });

    return true;
  }, [telegramId, onConnect, showError]);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);

    try {
      // @ts-ignore
      const telegram = window.Telegram.WebApp;

      const result = await telegram.showPopup({
        title: 'Connect TON Wallet',
        message: 'Select your wallet',
        buttons: [
          { id: 'tonkeeper', type: 'default', text: 'Tonkeeper' },
          { id: 'cancel', type: 'cancel' }
        ]
      });

      if (result.buttonId === 'tonkeeper') {
        telegram.openLink('ton://connect');

        // Імітуємо отримання адреси (в реальному додатку тут буде справжня адреса)
        const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
        const saved = await saveWalletAddress(mockAddress);

        if (!saved) {
          setIsConnecting(false);
        }
      } else {
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      await showError('Connection failed. Please try again.');
    }
  }, [isConnecting, saveWalletAddress, showError]);

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