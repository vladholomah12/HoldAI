import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// Отримуємо URL з змінних середовища Next.js
const manifestUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/ton-connect-manifest.json`
  : 'https://hold-ai.vercel.app/ton-connect-manifest.json';

interface TonConnectProviderProps {
  children: React.ReactNode;
}

export function TonConnectProvider({ children }: TonConnectProviderProps) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}