export interface WalletConnectProps {
  telegramId: number;
  onConnect: (address: string) => Promise<void>;
}
