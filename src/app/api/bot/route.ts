import { Bot } from "grammy";
import { NextResponse } from "next/server";

const bot = new Bot(process.env.BOT_TOKEN || "");

// Налаштування команди /start
bot.command("start", async (ctx) => {
  await ctx.reply("Welcome to Hold AI! 🚀", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Play Now",
            web_app: {
              url: process.env.NEXT_PUBLIC_WEBAPP_URL || "",
            },
          },
        ],
      ],
    },
  });
});

// Обробка веб-хуків від Telegram
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in bot webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Запускаємо бота в режимі long polling для розробки
if (process.env.NODE_ENV !== "production") {
  bot.start();
}