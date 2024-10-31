import { Wallet } from '@tonconnect/ui-react';

export interface WalletConnectProps {
  telegramId: number;
  onConnect: (address: string) => Promise<void>;
}

export interface WalletInfo {
  account: {
    address: string;
    chain: number;
  };
  device: {
    platform: string;
    appName: string;
  };
  connectTime: {
    bridgeVersion: string;
    jsVersion: string;
  };
}