import { TonConnectUIProvider } from '@tonconnect/ui-react';
import type { AppProps } from 'next/app';
import '@/app/globals.css';

const manifestUrl = 'https://hold-ai.vercel.app/ton-connect-manifest.json';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <Component {...pageProps} />
    </TonConnectUIProvider>
  );
}

export default MyApp;