import React, { useEffect, useState, useCallback } from 'react';
import { Wallet, Gift, Users } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

interface UserData {
  id: string;
  telegramId: bigint;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  walletAddress: string | null;
  isWalletVerified: boolean;
  walletConnectedAt: string | null;
}

interface WalletResponse {
  telegramId: number;
  walletAddress: string;
}

const TelegramMiniApp = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDay = new Date().getDay();

  const handleWalletRequest = useCallback(async (method: string, data: WalletResponse): Promise<void> => {
    try {
      const response = await fetch('/api/wallet', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
      }
    } catch (error) {
      console.error(`Error ${method === 'DELETE' ? 'disconnecting' : 'connecting'} wallet:`, error);
    }
  }, []);

  const handleWalletConnect = useCallback(async (address: string): Promise<void> => {
    if (!userData?.telegramId) return;

    await handleWalletRequest('POST', {
      telegramId: Number(userData.telegramId),
      walletAddress: address,
    });
  }, [userData, handleWalletRequest]);

  const handleDisconnectWallet = useCallback(async (): Promise<void> => {
    if (!userData?.telegramId) return;

    await handleWalletRequest('DELETE', {
      telegramId: Number(userData.telegramId),
      walletAddress: '',
    });

    // @ts-ignore
    const telegram = window.Telegram.WebApp;
    await telegram.showPopup({
      message: 'Wallet disconnected successfully',
      buttons: [{ type: 'ok' }]
    });
  }, [userData, handleWalletRequest]);

  const initTelegram = useCallback(async () => {
    try {
      // @ts-ignore
      const telegram = window.Telegram.WebApp;
      // Прибираємо await оскільки ready() не повертає Promise
      telegram.ready();

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUser: telegram.initDataUnsafe.user,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error initializing Telegram Web App:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void initTelegram();
  }, [initTelegram]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div>
          <div className="font-medium">{userData?.firstName || 'User'}</div>
          <div className="text-sm text-gray-500">Monthly Plan</div>
        </div>
        <div className="ml-auto text-blue-500">Telegram</div>
      </div>

      {/* Balance Section */}
      <div className="p-4 border rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>NOT</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{userData?.balance || 0}</div>
            <div className="text-sm text-gray-500">
              ${((userData?.balance || 0) * 0.1).toFixed(2)}
            </div>
          </div>
        </div>

        {userData?.walletAddress ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-500 truncate">
              Wallet: {userData.walletAddress.slice(0, 6)}...{userData.walletAddress.slice(-4)}
            </div>
            <button
              onClick={() => void handleDisconnectWallet()}
              className="w-full p-2 border border-red-500 text-red-500 rounded-lg text-center hover:bg-red-50"
            >
              Disconnect wallet
            </button>
          </div>
        ) : (
          <WalletConnect
            telegramId={Number(userData?.telegramId)}
            onConnect={handleWalletConnect}
          />
        )}
      </div>

      {/* Tasks Section */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Task</span>
          </div>
          <span className="text-blue-500">View tasks →</span>
        </div>
      </div>

      {/* Bonus Calendar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full
                ${index === currentDay ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-blue-500">BONUS</div>
      </div>

      {/* Friends Section */}
      <div className="space-y-4">
        <div className="font-medium">My friends</div>
        <div className="space-y-3">
          {/* Friends list will be implemented later */}
        </div>
      </div>

      {/* Invite Button */}
      <button
        onClick={async () => {
          // @ts-ignore
          const telegram = window.Telegram.WebApp;
          await telegram.showPopup({
            title: 'Invite Friends',
            message: 'Share your referral link to invite friends',
            buttons: [
              {type: 'default', text: 'Share Link'},
              {type: 'cancel'},
            ]
          });
        }}
        className="w-full p-3 bg-green-500 text-white rounded-lg flex items-center justify-center space-x-2"
      >
        <Users className="w-5 h-5" />
        <span>Invite a friend</span>
      </button>
    </div>
  );
};

export default TelegramMiniApp;