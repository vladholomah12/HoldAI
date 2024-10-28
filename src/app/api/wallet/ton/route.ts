import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const generateMockAddress = () => `EQ${Math.random().toString(36).slice(2, 15).toUpperCase()}`;

export async function POST(req: Request) {
  try {
    const { telegramId, action } = await req.json();

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        telegramId: BigInt(telegramId)
      },
      select: {
        walletAddress: true
      }
    });

    if (!action) {
      return NextResponse.json({
        address: existingUser?.walletAddress || null
      });
    }

    if (action === 'connect') {
      const mockAddress = generateMockAddress();

      const updatedUser = await prisma.user.update({
        where: {
          telegramId: BigInt(telegramId)
        },
        data: {
          walletAddress: mockAddress
        },
        select: {
          walletAddress: true
        }
      });

      return NextResponse.json({
        address: updatedUser.walletAddress
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (err) {
    console.error('Error processing wallet request:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}