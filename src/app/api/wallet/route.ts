import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { telegramId, walletAddress } = await request.json()

    const user = await prisma.user.update({
      where: { telegramId },
      data: { walletAddress }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating wallet:', error)
    return NextResponse.json(
      { error: 'Failed to update wallet address' },
      { status: 500 }
    )
  }
}