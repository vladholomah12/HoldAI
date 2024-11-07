import { Bot } from "grammy";
import { NextResponse } from "next/server";

const BOT_TOKEN = "8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw";
const bot = new Bot(BOT_TOKEN);

// POST endpoint для webhook
export async function POST(request: Request) {
  console.log("Received webhook request");

  try {
    const body = await request.json();
    console.log("Webhook body:", body);

    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}

// Налаштовуємо команди бота
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
    // Спробуємо надіслати простіше повідомлення
    try {
      await ctx.reply("Bot is working!");
    } catch (retryError) {
      console.error("Error sending fallback message:", retryError);
    }
  }
});

// GET endpoint для перевірки
export async function GET() {
  return NextResponse.json({
    status: "Bot API is working",
    timestamp: new Date().toISOString()
  });
}