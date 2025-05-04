"use client";

import './globals.css';
import { Toaster } from 'sonner';
import { AppProvider } from '../providers/AppProvider';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <a href="/" className="text-xl font-bold text-gray-900">
                      P2P Trade
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href="/p2p" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                      P2P Market
                    </a>
                    <div className="ml-4">
                      <ConnectButton />
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <main className="pt-16">
              {children}
            </main>
          </div>
        </AppProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
