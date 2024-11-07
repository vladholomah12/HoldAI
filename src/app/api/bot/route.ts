import { Bot } from "grammy";
import { NextResponse } from "next/server";

// Вказуємо що це Edge Runtime
export const runtime = 'edge';

const bot = new Bot("8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw");

// Команда /start
bot.command("start", async (ctx) => {
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

// POST для вебхука
export async function POST(req: Request) {
  if (req.headers.get("content-type") !== "application/json") {
    return new Response("Only JSON requests allowed", { status: 415 });
  }

  try {
    const body = await req.json();
    await bot.handleUpdate(body);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return new Response("Error", { status: 500 });
  }
}

// GET для перевірки
export async function GET() {
  return new Response(JSON.stringify({
    status: "OK",
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'content-type': 'application/json',
    },
  });
}