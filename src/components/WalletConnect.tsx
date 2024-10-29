import React, { useState, useCallback } from 'react';
import { Wallet } from 'lucide-react';
import type { WalletConnectProps } from '@/types/wallet';

export const WalletConnect: React.FC<WalletConnectProps> = ({ telegramId, onConnect }) => {
 const [isConnecting, setIsConnecting] = useState(false);

 const handleTonConnect = useCallback(async () => {
   if (!telegramId) return;

   try {
     // @ts-ignore
     const telegram = window.Telegram.WebApp;

     // Перший попап - умови використання
     const termsResult = await telegram.showPopup({
       title: 'Terms of Use',
       message: 'This will open a mini-application managed by a third-party developer not affiliated with Telegram. To continue, you must agree to the Terms of Use.',
       buttons: [
         { type: 'cancel', text: 'Скасувати', id: 'cancel' },
         { type: 'default', text: 'Continue', id: 'continue' }
       ]
     });

     console.log('Terms popup result:', termsResult);

     if (termsResult.buttonId === 'continue') {
       // Другий попап - вибір гаманця
       const walletResult = await telegram.showPopup({
         title: 'Connect Wallet',
         message: 'Open Wallet in Telegram or select your wallet to connect',
         buttons: [
           { type: 'default', text: 'Open Wallet in Telegram', id: 'wallet' },
           { type: 'cancel', text: 'Cancel', id: 'cancel' }
         ]
       });

       console.log('Wallet selection result:', walletResult);

       if (walletResult.buttonId === 'wallet') {
         // Відкриваємо TON протокол
         telegram.openLink('ton://');

         // Третій попап - підтвердження доступу
         const permissionResult = await telegram.showPopup({
           title: 'Connect to TON Space',
           message: 'Application requests permission to access your TON Space address, balance and activity information.',
           buttons: [
             { type: 'default', text: 'Connect Wallet', id: 'connect' },
             { type: 'cancel', text: 'Cancel', id: 'cancel' }
           ]
         });

         console.log('Permission request result:', permissionResult);

         if (permissionResult.buttonId === 'connect') {
           try {
             console.log('Sending API request with telegramId:', telegramId);
             // Запит до API
             const response = await fetch('/api/wallet/ton', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                 telegramId,
                 action: 'connect'
               })
             });

             if (!response.ok) {
               throw new Error(`API request failed with status ${response.status}`);
             }

             const data = await response.json();
             console.log('API response:', data);

             if (data.address) {
               await onConnect(data.address);

               // Показуємо успішне підключення
               await telegram.showPopup({
                 message: `Successfully connected to TON Space ${data.address}`,
                 buttons: [{ type: 'ok', text: 'Return to App' }]
               });
             } else {
               throw new Error('No address received from API');
             }
           } catch (error) {
             console.error('API Error:', error);
             await telegram.showPopup({
               message: 'Failed to connect wallet. Please try again later.',
               buttons: [{ type: 'ok', text: 'OK' }]
             });
             throw error;
           }
         }
       }
     }
   } catch (error) {
     console.error('Failed to connect wallet:', error);
     setIsConnecting(false);
     // @ts-ignore
     window.Telegram.WebApp.showAlert('Failed to connect wallet. Please try again.');
   }
 }, [telegramId, onConnect]);

 const connectWallet = useCallback(async () => {
   if (isConnecting) return;

   try {
     setIsConnecting(true);
     await handleTonConnect();
   } catch (error) {
     console.error('Wallet connection error:', error);
     // @ts-ignore
     window.Telegram.WebApp.showAlert('Failed to connect wallet. Please try again.');
   } finally {
     setIsConnecting(false);
   }
 }, [isConnecting, handleTonConnect]);

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