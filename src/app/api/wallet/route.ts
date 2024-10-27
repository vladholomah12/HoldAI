import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface WalletConnectBody {
  telegramId: number;
  walletAddress: string;
}

interface WalletDisconnectBody {
  telegramId: number;
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as WalletConnectBody;
    const { telegramId, walletAddress } = data;

    if (!telegramId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Оновлюємо користувача з новою інформацією про гаманець
    const updatedUser = await prisma.user.update({
      where: {
        telegramId: BigInt(telegramId)
      },
      data: {
        walletAddress,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json() as WalletDisconnectBody;
    const { telegramId } = data;

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Missing Telegram ID' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        telegramId: BigInt(telegramId)
      },
      data: {
        walletAddress: null,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect wallet' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        telegramId: BigInt(telegramId)
      },
      select: {
        walletAddress: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet info' },
      { status: 500 }
    );
  }
}