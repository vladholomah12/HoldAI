import { TelegramUser } from "@/types";

export function validateTelegramWebAppData(data: TelegramUser): boolean {
  // Тут буде логіка валідації даних від Telegram WebApp
  return true;
}

export function getDailyBonusAmount(day: number): number {
  return (day + 1) * 100;
}