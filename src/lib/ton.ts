import { TonConnectUI } from '@tonconnect/ui-react';

export const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://hold-ai.vercel.app/tonconnect-manifest.json',
  buttonRootId: 'ton-connect-button',
});