import React from 'react';
import { Wallet } from 'lucide-react';
import { TonConnectButton, TonConnectButtonProps } from '@tonconnect/ui-react';
import type { WalletConnectProps } from '@/types/wallet';

const WalletConnect = (_props: WalletConnectProps) => {
  const buttonProps: TonConnectButtonProps = {
    className: "w-full"
  };

  return (
    <div className="w-full">
      <TonConnectButton {...buttonProps}>
        {({ connected }: { connected: boolean }) => (
          <div className="w-full p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>
              {connected ? 'Гаманець підключено' : 'Підв\'язати TON гаманець'}
            </span>
          </div>
        )}
      </TonConnectButton>
    </div>
  );
};

export default WalletConnect;