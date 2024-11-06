import { Bot } from "grammy";
import { NextResponse } from "next/server";

const bot = new Bot("8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw");

// Налаштовуємо команду /start
bot.command("start", async (ctx) => {
  try {
    console.log("Start command received");
    await ctx.reply("Welcome to Hold AI! 🚀", {
      parse_mode: "HTML",
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

// Додаємо обробник для всіх повідомлень (для відлагодження)
bot.on("message", async (ctx) => {
  console.log("Received message:", ctx.message);
});

// POST endpoint для webhook
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received update:", body);
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET endpoint для перевірки
export async function GET() {
  return NextResponse.json({ status: "Bot API is working" });
}