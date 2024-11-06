import { NextResponse } from "next/server";

export async function GET() {
  try {
    const TELEGRAM_BOT_TOKEN = "8048775133:AAFFC8S8TjyojSzqPPKI7XFt_u9UhiWK8gw";
    const WEBHOOK_URL = "https://hold-ihnsjwytm-vladholomahs-projects.vercel.app/api/bot";

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
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
    console.error("Error setting webhook:", error);
    return NextResponse.json({
      status: 'Error setting webhook',
      error: String(error)
    }, { status: 500 });
  }
}