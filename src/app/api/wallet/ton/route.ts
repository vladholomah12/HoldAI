import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface WalletResponse {
  ok: boolean;
  address?: string;
  error?: string;
}

async function getWalletInfo(telegramId: number): Promise<WalletResponse> {
  try {
    // В реальному додатку тут був би запит до Telegram Wallet API
    // Зараз для тесту генеруємо тестову адресу
    const mockAddress = `EQ${Math.random().toString(36).substring(2, 15)}`;

    return {
      ok: true,
      address: mockAddress
    };
  } catch (err) {
    console.error('Error getting wallet info:', err);
    return {
      ok: false,
      error: 'Failed to get wallet information'
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { telegramId } = body;

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      );
    }

    const walletInfo = await getWalletInfo(telegramId);

    if (!walletInfo.ok || !walletInfo.address) {
      return NextResponse.json(
        { error: walletInfo.error || 'Failed to get wallet info' },
        { status: 400 }
      );
    }

    // Оновлюємо інформацію в базі даних
    try {
      await prisma.user.update({
        where: {
          telegramId: BigInt(telegramId)
        },
        data: {
          walletAddress: walletInfo.address
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to update user information' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      address: walletInfo.address
    });
  } catch (err) {
    console.error('General error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}