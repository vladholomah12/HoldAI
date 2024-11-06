import { TonConnect, Wallet } from '@tonconnect/sdk';

let connector: TonConnect | null = null;

// Ініціалізуємо connector тільки на клієнті
if (typeof window !== 'undefined') {
  connector = new TonConnect({
    manifestUrl: 'https://hold-ai.vercel.app/tonconnect-manifest.json'
  });
}

export class TonConnectWrapper {
  private static instance: TonConnectWrapper;

  private constructor() {}

  static getInstance(): TonConnectWrapper {
    if (!TonConnectWrapper.instance) {
      TonConnectWrapper.instance = new TonConnectWrapper();
    }
    return TonConnectWrapper.instance;
  }

  async connect(): Promise<void> {
    if (!connector) return;

    try {
      const wallets = await connector.getWallets();
      if (wallets.length > 0) {
        await connector.connect([{
          name: 'Tonkeeper',
          bridgeUrl: 'https://bridge.tonapi.io/bridge'
        }]);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (!connector) return;

    try {
      await connector.disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  onStatusChange(callback: (wallet: Wallet | null) => void) {
    if (!connector) return () => {};
    return connector.onStatusChange(callback);
  }

  get status(): boolean {
    return connector ? connector.connected : false;
  }

  get account() {
    return connector ? connector.account : null;
  }
}

export const tonConnector = TonConnectWrapper.getInstance();