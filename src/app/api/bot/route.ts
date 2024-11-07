import { Bot } from "grammy";
import { NextResponse } from "next/server";

const bot = new Bot("8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw");

// Налаштовуємо команду /start
bot.command("start", async (ctx) => {
  console.log("Start command received");
  try {
    await ctx.reply("Welcome to Hold AI! 🚀", {
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
  } catch (error) {
    console.error("Error in start command:", error);
  }
});

// Обробка всіх повідомлень для дебагу
bot.on("message", async (ctx) => {
  console.log("Received message:", ctx.message);
});

// POST endpoint для webhook
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received update:", body);
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error handling update:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET endpoint для перевірки
export async function GET() {
  return NextResponse.json({
    status: "Bot API is working",
    timestamp: new Date().toISOString()
  });
}