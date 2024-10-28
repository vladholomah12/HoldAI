interface Window {
  TonConnect?: any;
  tonConnect?: {
    connect: () => Promise<{
      address: string;
      network: string;
      publicKey: string;
    }>;
    disconnect: () => Promise<void>;
    connected: boolean;
    address?: string;
  };
}