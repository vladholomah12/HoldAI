import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { telegramUser } = await req.json();

    if (!telegramUser || !telegramUser.id) {
      return NextResponse.json({ error: 'Invalid Telegram user data' }, { status: 400 });
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: {
        telegramId: BigInt(telegramUser.id)
      },
      update: {
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
        lastName: telegramUser.last_name || null,
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
        lastName: telegramUser.last_name || null,
        balance: 0,
      },
    });

    // Log login
    await prisma.login.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error processing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}