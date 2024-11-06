"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface WebAppUser {
  telegramId: string
  username?: string
  firstName: string
  photoUrl?: string
  balance: number
}

interface TelegramWebApp {
  ready: () => void
  initDataUnsafe?: {
    user?: {
      id: number
      first_name: string
      username?: string
      photo_url?: string
    }
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

interface TelegramContext {
  user: WebAppUser | null
  ready: boolean
}

const TelegramContext = createContext<TelegramContext>({
  user: null,
  ready: false,
})

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WebAppUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initTelegram = () => {
      const telegram = window.Telegram?.WebApp
      if (telegram) {
        telegram.ready()
        const telegramUser = telegram.initDataUnsafe?.user
        if (telegramUser) {
          setUser({
            telegramId: String(telegramUser.id),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            photoUrl: telegramUser.photo_url,
            balance: 0,
          })
        }
        setReady(true)
      }
    }

    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        initTelegram()
      } else {
        const interval = setInterval(() => {
          if (window.Telegram?.WebApp) {
            initTelegram()
            clearInterval(interval)
          }
        }, 100)

        return () => clearInterval(interval)
      }
    }
  }, [])

  return (
    <TelegramContext.Provider value={{ user, ready }}>
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => useContext(TelegramContext)