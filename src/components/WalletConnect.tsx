import React, { useState, useCallback } from 'react';
import { Wallet } from 'lucide-react';
import type { WalletConnectProps } from '@/types/wallet';

export const WalletConnect: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const showPopup = useCallback(async (params: {
    title?: string;
    message: string;
    buttons: Array<{
      type: 'default' | 'ok' | 'cancel';
      text: string;
      id?: string;
    }>;
  }) => {
    // @ts-ignore
    return window.Telegram.WebApp.showPopup(params);
  }, []);

  const handleTonConnect = useCallback(async () => {
    if (!telegramId) return;

    // Show terms dialog
    const termsResult = await showPopup({
      title: 'Terms of Use',
      message: 'This will open a mini-application managed by a third-party developer not affiliated with Telegram. To continue, you must agree to the Terms of Use.',
      buttons: [
        { type: 'default', text: 'Continue', id: 'continue' },
        { type: 'cancel', text: 'Cancel', id: 'cancel' }
      ]
    });

    if (termsResult.buttonId === 'continue') {
      // Show wallet connection dialog
      const walletResult = await showPopup({
        title: 'Connect Wallet',
        message: 'Open Wallet in Telegram or select your wallet to connect',
        buttons: [
          { type: 'default', text: 'Open Wallet in Telegram', id: 'wallet' },
          { type: 'cancel', text: 'Cancel', id: 'cancel' }
        ]
      });

      if (walletResult.buttonId === 'wallet') {
        // @ts-ignore
        window.Telegram.WebApp.openLink('ton://');

        // Show permission dialog
        const permissionResult = await showPopup({
          title: 'Connect to TON Space',
          message: 'Application requests permission to access your TON Space address, balance and activity information.',
          buttons: [
            { type: 'default', text: 'Connect Wallet', id: 'connect' },
            { type: 'cancel', text: 'Cancel', id: 'cancel' }
          ]
        });

        if (permissionResult.buttonId === 'connect') {
          const mockAddress = `UQCT${Math.random().toString(36).substring(2, 8)}...FaJY`;
          await onConnect(mockAddress);

          await showPopup({
            message: `Successfully connected to TON Space ${mockAddress}`,
            buttons: [
              { type: 'ok', text: 'Return to App', id: 'ok' }
            ]
          });
        }
      }
    }
  }, [telegramId, showPopup, onConnect]);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      await handleTonConnect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      await showPopup({
        message: 'Failed to connect wallet. Please try again.',
        buttons: [{ type: 'ok', text: 'OK', id: 'ok' }]
      });
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, handleTonConnect, showPopup]);

  return (
    <button
      onClick={() => void connectWallet()}
      disabled={isConnecting}
      className="w-full p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect TON Wallet'}</span>
    </button>
  );
};