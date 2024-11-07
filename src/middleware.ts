import { NextResponse } from "next/server";

const BOT_TOKEN = "8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendTelegramMessage(chatId: number, text: string, extra = {}) {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...extra
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const update = await request.json();
    console.log('Received update:', update);

    // Перевіряємо чи це команда /start
    if (update.message?.text === '/start') {
      await sendTelegramMessage(update.message.chat.id, "Welcome to Hold AI! 🚀", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🎮 Play Now",
                web_app: {
                  url: "https://hold-ihnsjwytm-vladholomahs-projects.vercel.app"
                }
              }
            ]
          ]
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Bot API is working",
    timestamp: new Date().toISOString()
  });
}