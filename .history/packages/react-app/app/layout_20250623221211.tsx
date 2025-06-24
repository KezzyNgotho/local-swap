
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import './globals.css';
import { Toaster } from 'sonner';
import { useState, createContext, useContext } from 'react';

export const metadata = {
  title: 'P2P Trading Platform',
  description: 'A decentralized P2P trading platform built on Celo',
};

// Demo mode context
export const DemoModeContext = createContext<{demo: boolean, setDemo: (v: boolean) => void}>({demo: false, setDemo: () => {}});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(true);
  const [demo, setDemo] = useState(false);

  // Toggle dark/light mode by toggling a class on html
  const htmlClass = dark ? 'dark' : '';

  return (
    <html lang="en" className={htmlClass}>
      <head>
        <title>P2P Trading Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <DemoModeContext.Provider value={{demo, setDemo}}>
          <Providers>
            <div className="min-h-screen bg-[#181A20]">
              {/* Top bar for toggles */}
              <div className="flex justify-end gap-4 p-2">
                <button onClick={() => setDark(d => !d)} className="px-3 py-1 rounded bg-[#23262F] text-white text-xs">{dark ? '🌙 Dark' : '☀️ Light'}</button>
                <button onClick={() => setDemo(d => !d)} className={`px-3 py-1 rounded text-xs ${demo ? 'bg-[#F0B90B] text-[#181A20]' : 'bg-[#23262F] text-white'}`}>{demo ? 'Demo Mode: ON' : 'Demo Mode'}</button>
              </div>
              <main className="pt-4">
                {children}
              </main>
            </div>
            <Toaster position="top-right" />
          </Providers>
        </DemoModeContext.Provider>
      </body>
    </html>
  );
}
