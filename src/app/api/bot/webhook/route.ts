import { NextResponse } from "next/server";

export async function GET() {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
    const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/bot`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`
    );

    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({
        status: 'Webhook set successfully',
        webhookUrl: WEBHOOK_URL,
        response: data
      });
    } else {
      return NextResponse.json({
        status: 'Failed to set webhook',
        error: data
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'Error setting webhook',
      error: error
    }, { status: 500 });
  }
}