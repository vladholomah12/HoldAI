import React from 'react';
import { TonConnectUI } from '@tonconnect/ui';

const manifestUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/ton-connect-manifest.json`
  : 'https://hold-ai.vercel.app/ton-connect-manifest.json';

interface TonConnectProviderProps {
  children: React.ReactNode;
}

// Ініціалізуємо TonConnect один раз глобально
const tonConnectUI = new TonConnectUI({
  manifestUrl: manifestUrl,
  buttonRootId: 'ton-connect-button',
  uiPreferences: {
    theme: 'SYSTEM'
  }
});

export function TonConnectProvider({ children }: TonConnectProviderProps) {
  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      unsubscribe = tonConnectUI.onStatusChange((wallet) => {
        if (wallet) {
          console.log('Wallet connected:', wallet);
        }
      });
    })();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return <>{children}</>;
}

export { tonConnectUI };