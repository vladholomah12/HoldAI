import React, { useState, useCallback } from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  telegramId: number;
  onConnect: (address: string) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleError = useCallback(async (message: string) => {
    // @ts-ignore
    const telegram = window.Telegram.WebApp;
    await telegram.showPopup({
      message,
      buttons: [{ type: 'ok' }]
    });
  }, []);

  const checkWallet = useCallback(async (id: number) => {
    try {
      const response = await fetch('/api/wallet/ton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: id })
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data.address;
    } catch {
      return null;
    }
  }, []);

  const handleWalletConnection = useCallback(async () => {
    // @ts-ignore
    const telegram = window.Telegram.WebApp;

    // Показуємо опції підключення
    const result = await telegram.showPopup({
      title: 'Connect TON Wallet',
      message: 'Choose wallet connection method',
      buttons: [
        { id: 'telegram', type: 'default', text: 'Telegram Wallet' },
        { id: 'tonkeeper', type: 'default', text: 'Tonkeeper' },
        { id: 'cancel', type: 'cancel' }
      ]
    });

    if (result.buttonId === 'cancel') {
      return false;
    }

    // Відкриваємо відповідний гаманець
    if (result.buttonId === 'telegram') {
      telegram.openLink('ton://');
    } else if (result.buttonId === 'tonkeeper') {
      telegram.openLink('https://app.tonkeeper.com/ton-connect');
    }

    // Чекаємо підтвердження
    const confirmResult = await telegram.showPopup({
      title: 'Wallet Connection',
      message: 'Did you connect your wallet?',
      buttons: [
        { id: 'yes', type: 'default', text: 'Yes' },
        { id: 'no', type: 'default', text: 'No, try again' }
      ]
    });

    return confirmResult.buttonId === 'yes';
  }, []);

  const saveWalletConnection = useCallback(async (id: number) => {
    const response = await fetch('/api/wallet/ton', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId: id,
        action: 'connect'
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.address || null;
  }, []);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      // Перевіряємо існуючий гаманець
      const existingAddress = await checkWallet(telegramId);
      if (existingAddress) {
        onConnect(existingAddress);
        // @ts-ignore
        await window.Telegram.WebApp.showPopup({
          message: 'Wallet already connected!',
          buttons: [{ type: 'ok' }]
        });
        return;
      }

      // Процес підключення
      const confirmed = await handleWalletConnection();
      if (!confirmed) {
        await handleError('Wallet connection cancelled. Please try again.');
        return;
      }

      // Зберігаємо підключення
      const newAddress = await saveWalletConnection(telegramId);
      if (!newAddress) {
        await handleError('Failed to save wallet connection. Please try again.');
        return;
      }

      onConnect(newAddress);
      // @ts-ignore
      await window.Telegram.WebApp.showPopup({
        message: 'Wallet connected successfully!',
        buttons: [{ type: 'ok' }]
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      await handleError('Something went wrong. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, [telegramId, onConnect, isConnecting, checkWallet, handleWalletConnection, saveWalletConnection, handleError]);

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