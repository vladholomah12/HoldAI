'use client';

import dynamic from 'next/dynamic';
import { useTelegram } from '@/hooks/useTelegram';

const TelegramMiniApp = dynamic(
  () => import('@/components/TelegramMiniApp'),
  { ssr: false }
);

export default function Home() {
  useTelegram();

  return <TelegramMiniApp />;
}