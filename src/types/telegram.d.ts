interface WebApp {
  ready: () => void
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      username?: string
      photo_url?: string
    }
  }
}

interface TelegramWebApp {
  WebApp: WebApp
}

declare global {
  interface Window {
    Telegram?: TelegramWebApp
  }
}