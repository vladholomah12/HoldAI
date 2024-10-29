import React from 'react';
import { Wallet } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import type { WalletConnectProps } from '@/types/wallet';

export const WalletConnect = (_props: WalletConnectProps) => {
 return (
   <div className="w-full">
     <button
       className="w-full p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2 relative"
       onClick={async () => {
         try {
           // @ts-ignore
           const telegram = window.Telegram.WebApp;
           const result = await telegram.showPopup({
             title: "Connect Wallet",
             message: "Open Wallet in Telegram or select your wallet to connect",
             buttons: [
               { type: "default", text: "Open Wallet in Telegram", id: "wallet" },
               { type: "cancel", text: "Cancel", id: "cancel" }
             ]
           });

           if (result.buttonId === "wallet") {
             telegram.openLink("ton://");
           }
         } catch (error) {
           console.error("Failed to connect wallet:", error);
           // @ts-ignore
           window.Telegram.WebApp.showAlert("Помилка підключення гаманця. Спробуйте ще раз.");
         }
       }}
     >
       <Wallet className="w-5 h-5" />
       <span>Підв&apos;язати TON гаманець</span>
       <TonConnectButton className="opacity-0 absolute inset-0 w-full h-full" />
     </button>
   </div>
 );
};