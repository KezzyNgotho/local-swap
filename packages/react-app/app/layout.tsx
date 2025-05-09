import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import './globals.css';
import { Toaster } from 'sonner';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'P2P Trading Platform',
  description: 'A decentralized P2P trading platform built on Celo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>P2P Trading Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen bg-[#181A20]">
            <NavBar />
            <main className="pt-4">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
