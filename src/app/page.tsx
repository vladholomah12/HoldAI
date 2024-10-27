"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TelegramMiniApp = dynamic(
  () => import('../components/TelegramMiniApp'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<LoadingSpinner />}>
        <main className="container mx-auto max-w-md p-4">
          <TelegramMiniApp />
        </main>
      </Suspense>

      <script
        src="https://telegram.org/js/telegram-web-app.js"
        async
      />
    </div>
  );
}