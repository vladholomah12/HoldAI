import { NextResponse } from 'next/server';
import bot from '@/telegram/bot';

// Обробка вебхуків від Telegram
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling bot webhook:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Налаштування вебхука при першому запиті
export async function GET() {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/bot`;
    await bot.telegram.setWebhook(webhookUrl);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error setting webhook:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}