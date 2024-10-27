import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

if (!process.env.NEXT_PUBLIC_BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.NEXT_PUBLIC_BOT_TOKEN);

// Обробка команди /start
bot.command('start', async (ctx) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  await ctx.reply('Welcome to HoldAI! 🚀', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎮 Play Now',
            web_app: { url: appUrl || 'https://hold-ai.vercel.app' }
          }
        ]
      ]
    }
  });
});

// Обробка текстових повідомлень
bot.on(message('text'), async (ctx) => {
  await ctx.reply('Press the button below to start playing:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎮 Play Now',
            web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://hold-ai.vercel.app' }
          }
        ]
      ]
    }
  });
});

export default bot;