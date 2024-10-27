import React, { useEffect, useState } from 'react';
import { User, Wallet, Gift, Users } from 'lucide-react';

interface UserData {
  id: string;
  telegramId: bigint;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  walletAddress: string | null;
}

const TelegramMiniApp = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDay = new Date().getDay();

  useEffect(() => {
    const initTelegram = async () => {
      try {
        // @ts-ignore
        const telegram = window.Telegram.WebApp;
        // Initialize Telegram Web App
        telegram.ready();

        // Fetch user data
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
    };

    initTelegram();
  }, []);

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
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>NOT</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{userData?.balance || 0}</div>
            <div className="text-sm text-gray-500">${((userData?.balance || 0) * 0.1).toFixed(2)}</div>
          </div>
        </div>
        <button
          onClick={() => {
            // @ts-ignore
            window.Telegram.WebApp.showPopup({
              title: 'Connect Wallet',
              message: 'Choose your wallet to connect',
              buttons: [
                {type: 'default', text: 'TON Wallet'},
                {type: 'cancel'},
              ]
            });
          }}
          className="w-full mt-4 p-2 border rounded-lg text-center"
        >
          Connect wallet
        </button>
      </div>

      {/* Tasks Section */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Task</span>
          </div>
          <span className="text-blue-500">перейти до завдань →</span>
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
          {/* We'll fetch and display friends here */}
        </div>
      </div>

      {/* Invite Button */}
      <button
        onClick={() => {
          // @ts-ignore
          window.Telegram.WebApp.showPopup({
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