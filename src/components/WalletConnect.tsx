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

      const termsResult = await telegram.showPopup({
        title: "Умови використання",
        message: "Буде відкрито мінізастосунок, яким керує сторонній розробник, не пов`язаний з Telegram. Щоб продовжити, ви повинні погодитися з Умовами використання.",
        buttons: [
          { type: "default", text: "Продовжити", id: "continue" },
          { type: "cancel", text: "Скасувати", id: "cancel" }
        ]
      });

      if (termsResult.buttonId !== "continue") return;

      const walletResult = await telegram.showPopup({
        title: "Підключення гаманця",
        message: "Відкрити гаманець у Telegram або оберіть свій гаманець для підключення",
        buttons: [
          { type: "default", text: "Відкрити гаманець у Telegram", id: "wallet" },
          { type: "cancel", text: "Скасувати", id: "cancel" }
        ]
      });

      if (walletResult.buttonId !== "wallet") return;

      telegram.openLink("ton://");

      const permissionResult = await telegram.showPopup({
        title: "Підключення до TON Space",
        message: "Застосунок запитує дозвіл на доступ до інформації про вашу адресу TON Space, баланс та активність.",
        buttons: [
          { type: "default", text: "Підв`язати гаманець", id: "connect" },
          { type: "cancel", text: "Скасувати", id: "cancel" }
        ]
      });

      if (permissionResult.buttonId !== "connect") return;

      const response = await fetch("/api/wallet/ton", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          telegramId,
          action: "connect"
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.address) {
        throw new Error("No address received from API");
      }

      await onConnect(data.address);

      await telegram.showPopup({
        message: `Успішно підключено до TON Space ${data.address}`,
        buttons: [{ type: "ok", text: "Повернутись до застосунку" }]
      });
    } catch (error) {
      // @ts-ignore
      const telegram = window.Telegram.WebApp;
      await telegram.showPopup({
        message: "Не вдалося підключити гаманець. Спробуйте ще раз пізніше.",
        buttons: [{ type: "ok", text: "OK" }]
      });
    } finally {
      setIsConnecting(false);
    }
}, [telegramId, onConnect]);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    await handleTonConnect();
  }, [isConnecting, handleTonConnect]);

  return (
    <button
      onClick={() => void connectWallet()}
      disabled={isConnecting}
      className="w-full p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2"
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? "Підключення..." : "Підв`язати TON гаманець"}</span>
    </button>
  );
};