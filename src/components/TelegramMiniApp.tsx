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
   const response = await fetch('/api/wallet', {
     method,
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(data),
   });

   if (!response.ok) {
     throw new Error(`Wallet request failed with status ${response.status}`);
   }

   const updatedUser = await response.json();
   setUserData(updatedUser);
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

   // @ts-ignore
   const telegram = window.Telegram.WebApp;

   try {
     await handleWalletRequest("DELETE", {
       telegramId: Number(userData.telegramId),
       walletAddress: "",
     });

     await telegram.showPopup({
       message: "Гаманець успішно відключено",
       buttons: [{ type: "ok", text: "OK" }]
     });
   } catch {
     await telegram.showPopup({
       message: "Не вдалося відключити гаманець. Спробуйте ще раз.",
       buttons: [{ type: "ok", text: "OK" }]
     });
   }
 }, [userData, handleWalletRequest]);

const initTelegram = useCallback(async () => {
  let error = null;

  try {
    // @ts-ignore
    const telegram = window.Telegram.WebApp;
    telegram.ready();

    if (!telegram.initDataUnsafe.user) {
      setLoading(false);
      return;
    }

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramUser: telegram.initDataUnsafe.user,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      error = new Error(errorData.error || 'Failed to initialize user');
      return;
    }

    const data = await response.json();
    setUserData(data);
  } catch (e) {
    error = e;
    console.error('Error initializing Telegram Web App:', e);
  } finally {
    setLoading(false);
    if (error) {
      // @ts-ignore
      window.Telegram.WebApp.showAlert('Помилка ініціалізації. Спробуйте перезавантажити застосунок.');
    }
  }
}, []);
useEffect(() => {
  let mounted = true;

  const init = async () => {
    try {
      await initTelegram();
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  };

  // Викликаємо init та обробляємо Promise
  (async () => {
    try {
      if (mounted) {
        await init();
      }
    } catch (error) {
      console.error('Init error:', error);
    }
  })();

  return () => {
    mounted = false;
  };
}, [initTelegram]);

 if (loading) {
   return <div className="flex items-center justify-center min-h-screen">Завантаження...</div>;
 }

 return (
   <div className="max-w-md mx-auto p-4 space-y-6">
     <div className="flex items-center space-x-3">
       <div className="w-10 h-10 rounded-full bg-gray-200" />
       <div>
         <div className="font-medium">{userData?.firstName || 'Користувач'}</div>
         <div className="text-sm text-gray-500">Місячний план</div>
       </div>
       <div className="ml-auto text-blue-500">Telegram</div>
     </div>

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
             Гаманець: {userData.walletAddress.slice(0, 6)}...{userData.walletAddress.slice(-4)}
           </div>
           <button
             onClick={handleDisconnectWallet}
             className="w-full p-2 border border-red-500 text-red-500 rounded-lg text-center hover:bg-red-50"
           >
             Відключити гаманець
           </button>
         </div>
       ) : (
         <WalletConnect
           telegramId={Number(userData?.telegramId)}
           onConnect={handleWalletConnect}
         />
       )}
     </div>

     <div className="p-4 border rounded-lg">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-2">
           <Gift className="w-5 h-5" />
           <span>Завдання</span>
         </div>
         <span className="text-blue-500">Переглянути завдання →</span>
       </div>
     </div>

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
       <div className="text-center text-sm text-blue-500">БОНУС</div>
     </div>

     <div className="space-y-4">
       <div className="font-medium">Мої друзі</div>
       <div className="space-y-3">
         {/* Список друзів буде додано пізніше */}
       </div>
     </div>

     <button
       onClick={async () => {
         // @ts-ignore
         const telegram = window.Telegram.WebApp;
         await telegram.showPopup({
           title: "Запросити друзів",
           message: "Поділіться своїм реферальним посиланням, щоб запросити друзів",
           buttons: [
             { type: "default", text: "Поділитися посиланням" },
             { type: "cancel", text: "Скасувати" }
           ]
         });
       }}
       className="w-full p-3 bg-green-500 text-white rounded-lg flex items-center justify-center space-x-2"
     >
       <Users className="w-5 h-5" />
       <span>Запросити друга</span>
     </button>
   </div>
 );
};

export default TelegramMiniApp;