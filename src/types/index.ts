export interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface WebAppUser {
  telegramId: string;
  username?: string;
  firstName: string;
  photoUrl?: string;
  balance: number;
  walletAddress?: string;
}

export interface DailyBonus {
  day: number;
  amount: number;
  claimed: boolean;
}