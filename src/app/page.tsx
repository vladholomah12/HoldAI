'use client';

import dynamic from 'next/dynamic';

// Використовуємо dynamic import для клієнтського компонента
const TelegramMiniApp = dynamic(
  () => import('@/components/TelegramMiniApp'),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Завантаження...</div>
  }
);

export default function Page() {
  return <TelegramMiniApp />;
}