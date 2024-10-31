'use client';

import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function TonProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl="https://ton.org/app/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}