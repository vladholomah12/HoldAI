import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { User, UserWithBigInt, UserCreateInput } from '@/types/user';

const serializeUser = (user: UserWithBigInt): User => ({
  ...user,
  telegramId: Number(user.telegramId),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export async function POST(req: Request) {
  try {
    const { telegramUser } = await req.json();

    if (!telegramUser || !telegramUser.id) {
      return NextResponse.json(
        { error: 'Invalid Telegram user data' },
        { status: 400 }
      );
    }

    const userData: UserCreateInput = {
      telegramId: telegramUser.id,
      username: telegramUser.username || null,
      firstName: telegramUser.first_name || null,
      lastName: telegramUser.last_name || null,
    };

    const user = await prisma.user.upsert({
      where: {
        telegramId: BigInt(userData.telegramId)
      },
      update: {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      create: {
        telegramId: BigInt(userData.telegramId),
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        balance: 0,
        referralCode: `REF${userData.telegramId}${Date.now()}`
      },
    }) as unknown as UserWithBigInt;

    await prisma.login.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(serializeUser(user));
  } catch (error) {
    console.error('Error processing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}