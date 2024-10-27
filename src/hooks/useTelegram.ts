import { useEffect } from 'react';

export function useTelegram() {
  useEffect(() => {
    const script = document.querySelector('#telegram-webapp');
    if (script) {
      const checkWebApp = setInterval(() => {
        const tg = (globalThis as any).Telegram?.WebApp;
        if (tg?.ready) {
          tg.ready();
          clearInterval(checkWebApp);
        }
      }, 100);

      return () => clearInterval(checkWebApp);
    }
  }, []);
}