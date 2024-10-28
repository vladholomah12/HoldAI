interface TelegramWebApp {
  ready: () => void;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  showPopup: (params: {
    title?: string;
    message: string;
    buttons: Array<{
      type?: 'default' | 'ok' | 'close' | 'cancel';
      text?: string;
      id?: string;
    }>;
  }) => Promise<{ buttonId: string }>;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
  };
  openLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export {};