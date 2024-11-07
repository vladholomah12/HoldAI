import { Bot } from "grammy";
import { NextResponse } from "next/server";

const bot = new Bot("8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw");

// Обробка помилок
bot.catch((err) => {
  console.error("Error in bot:", err);
});

// Debug middleware
bot.use(async (ctx, next) => {
  console.log("Received update:", {
    type: ctx.updateType,
    from: ctx.from,
    message: ctx.message,
  });
  await next();
});

// Команда /start
bot.command("start", async (ctx) => {
  console.log("Start command received from:", ctx.from);

  try {
    const message = await ctx.reply("Welcome to Hold AI! 🚀", {
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

    console.log("Reply sent successfully:", message);
  } catch (error) {
    console.error("Error sending start message:", error);
    // Спробуємо надіслати простіше повідомлення
    try {
      await ctx.reply("Welcome! Something went wrong, please try again.");
    } catch (retryError) {
      console.error("Error sending fallback message:", retryError);
    }
  }
});

// Тестова команда для перевірки
bot.command("test", async (ctx) => {
  try {
    await ctx.reply("Bot is working!");
  } catch (error) {
    console.error("Error in test command:", error);
  }
});

// POST обробник для webhook
export async function POST(request: Request) {
  console.log("Received webhook POST request");

  try {
    const body = await request.json();
    console.log("Webhook body:", body);

    await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}

// GET обробник для перевірки
export async function GET() {
  console.log("Received GET request to bot endpoint");
  return NextResponse.json({
    status: "Bot API is working",
    webhook: "https://hold-ihnsjwytm-vladholomahs-projects.vercel.app/api/bot",
    bot: bot.botInfo?.username
  });
}