import { TonConnect, Wallet, WalletInfo } from '@tonconnect/sdk';

class TonConnectWrapper {
  private connector: TonConnect;

  constructor() {
    this.connector = new TonConnect({
      manifestUrl: 'https://hold-ai.vercel.app/tonconnect-manifest.json'
    });
  }

  async connect(): Promise<void> {
    try {
      const wallets = await this.connector.getWallets();

      if (wallets.length > 0) {
        await this.connector.connect([{
          name: 'Tonkeeper',
          bridgeUrl: 'https://bridge.tonapi.io/bridge'
        }]);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.connector.disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  onStatusChange(callback: (wallet: Wallet | null) => void) {
    return this.connector.onStatusChange(callback);
  }

  get status(): boolean {
    return this.connector.connected;
  }

  get account() {
    return this.connector.account;
  }

  async getWallets(): Promise<WalletInfo[]> {
    return this.connector.getWallets();
  }

  // Додаємо метод для перевірки чи є з'єднання
  isConnected(): boolean {
    return this.connector.connected;
  }

  // Додаємо метод для отримання адреси гаманця
  getWalletAddress(): string | null {
    const account = this.connector.account;
    return account ? account.address : null;
  }
}

const connector = new TonConnectWrapper();
export { connector };