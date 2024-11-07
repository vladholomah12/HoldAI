import { Bot } from "grammy";
import { NextResponse } from "next/server";

const BOT_TOKEN = "8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw";
const bot = new Bot(BOT_TOKEN);

// Функція для валідації запиту від Telegram
function validateTelegramRequest(request: Request): boolean {
  // Перевіряємо заголовок X-Telegram-Bot-Api-Secret-Token якщо він є
  const secretToken = request.headers.get("x-telegram-bot-api-secret-token");
  if (secretToken) {
    return secretToken === BOT_TOKEN;
  }
  return true; // Тимчасово дозволяємо всі запити
}

// POST endpoint для webhook
export async function POST(request: Request) {
  console.log("Received webhook request");

  try {
    if (!validateTelegramRequest(request)) {
      console.log("Unauthorized request rejected");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
  }
});

// Обробка всіх повідомлень для дебагу
bot.on("message", (ctx) => {
  console.log("Received message:", ctx.message);
});

// GET endpoint для перевірки
export async function GET() {
  return NextResponse.json({
    status: "Bot API is working",
    timestamp: new Date().toISOString()
  });
}