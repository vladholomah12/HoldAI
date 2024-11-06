import { Bot, webhookCallback } from "grammy";
import { NextResponse } from "next/server";

// Створюємо інстанс бота
const bot = new Bot(process.env.BOT_TOKEN || "");

// Налаштовуємо команду /start
bot.command("start", async (ctx) => {
  try {
    await ctx.reply("Welcome to Hold AI! 🚀", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🎮 Play Now",
              web_app: {
                url: process.env.NEXT_PUBLIC_WEBAPP_URL || "https://hold-ai.vercel.app"
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

// Додаємо обробник повідомлень для відлагодження
bot.on("message", async (ctx) => {
  console.log("Received message:", ctx.message);
});

// Запускаємо бота в режимі long polling для development
if (process.env.NODE_ENV !== "production") {
  bot.start();
}

// Обробка POST запитів для webhook
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Додаємо GET метод для перевірки роботи API
export async function GET() {
  return NextResponse.json({ status: "Bot API is working" });
}