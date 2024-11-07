import { NextResponse } from 'next/server';

const BOT_TOKEN = "8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw";

async function sendTelegramMessage(chatId: number | string, text: string, extra = {}) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...extra
      }),
    }
  );

  return response.json();
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    console.log('Telegram Update:', update);

    // Обробка команди /start
    if (update.message?.text === '/start') {
      await sendTelegramMessage(
        update.message.chat.id,
        'Welcome to Hold AI! 🚀',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🎮 Play Now',
                  web_app: {
                    url: 'https://hold-ihnsjwytm-vladholomahs-projects.vercel.app'
                  }
                }
              ]
            ]
          }
        }
      );
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Bot API is working',
    timestamp: new Date().toISOString()
  });
}