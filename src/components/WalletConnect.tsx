import React from 'react';
import { Wallet } from 'lucide-react';
import { tonConnectUI } from '@/providers/TonConnectProvider';
import type { WalletConnectProps } from '@/types/wallet';

export const WalletConnect = ({ telegramId, onConnect }: WalletConnectProps) => {
  return (
    <div className="w-full">
      <button
        className="w-full p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2 relative"
        onClick={async () => {
          try {
            // @ts-ignore
            const telegram = window.Telegram.WebApp;
            const result = await telegram.showPopup({
              title: "Підключення гаманця",
              message: "Відкрити гаманець у Telegram або оберіть свій гаманець для підключення",
              buttons: [
                { type: "default", text: "Відкрити гаманець у Telegram", id: "wallet" },
                { type: "cancel", text: "Скасувати", id: "cancel" }
              ]
            });

            if (result.buttonId === "wallet") {
              telegram.openLink("ton://");

              if (telegramId) {
                try {
                  tonConnectUI.connector.connect({
                    jsBridgeKey: "ton_bridge",
                    universalLink: process.env.NEXT_PUBLIC_APP_URL || 'https://hold-ai.vercel.app'
                  });

                  const walletInfo = tonConnectUI.wallet;
                  if (walletInfo?.account?.address) {
                    await onConnect(walletInfo.account.address);
                  }
                } catch (walletError) {
                  console.error("Wallet connection error:", walletError);
                  await telegram.showPopup({
                    message: "Помилка підключення гаманця. Спробуйте ще раз.",
                    buttons: [{ type: "ok", text: "OK" }]
                  });
                }
              }
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
        <div id="ton-connect-button" className="opacity-0 absolute inset-0" />
      </button>
    </div>
  );
};