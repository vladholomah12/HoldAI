interface User {
  id: string;
  telegramId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  walletAddress: string | null;
  referralCode: string;
  referredBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserWithBigInt extends Omit<User, 'telegramId'> {
  telegramId: bigint;
}

interface UserCreateInput {
  telegramId: number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export type { User, UserWithBigInt, UserCreateInput };