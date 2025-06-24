"use client";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import './globals.css';
import { Toaster } from 'sonner';
import { useState, createContext, useContext } from 'react';

// Demo mode context
export const DemoModeContext = createContext<{demo: boolean, setDemo: (v: boolean) => void}>({demo: false, setDemo: () => {}});

// Language context
export const LanguageContext = createContext<{lang: string, setLang: (v: string) => void}>({lang: 'en', setLang: () => {}});

// Local currency context (mock)
export const LocalCurrencyContext = createContext<{currency: string, setCurrency: (v: string) => void}>({currency: 'USD', setCurrency: () => {}});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(true);
  const [demo, setDemo] = useState(false);
  const [lang, setLang] = useState('en');
  const [currency, setCurrency] = useState('USD');

  // Toggle dark/light mode by toggling a class on html
  const htmlClass = dark ? 'dark' : '';

  return (
    <html lang={lang} className={htmlClass}>
      <head>
        <title>P2P Trading Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <LanguageContext.Provider value={{lang, setLang}}>
        <LocalCurrencyContext.Provider value={{currency, setCurrency}}>
        <DemoModeContext.Provider value={{demo, setDemo}}>
          <Providers>
            <div className="min-h-screen bg-[#181A20]">
              {/* Top bar for toggles and language */}
              <div className="flex justify-end gap-4 p-2 items-center">
                <label htmlFor="lang-select" className="sr-only">Language</label>
                <select
                  id="lang-select"
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="px-2 py-1 rounded bg-[#23262F] text-white text-xs border border-[#176B63] focus:ring-2 focus:ring-[#F0B90B]"
                  aria-label="Select language"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
                <button onClick={() => setDark(d => !d)} className="px-3 py-1 rounded bg-[#23262F] text-white text-xs" aria-label="Toggle dark/light mode" tabIndex={0}>{dark ? '🌙 Dark' : '☀️ Light'}</button>
                <button onClick={() => setDemo(d => !d)} className={`px-3 py-1 rounded text-xs ${demo ? 'bg-[#F0B90B] text-[#181A20]' : 'bg-[#23262F] text-white'}`} aria-label="Toggle demo mode" tabIndex={0}>{demo ? 'Demo Mode: ON' : 'Demo Mode'}</button>
              </div>
              <main className="pt-4">
                {children}
              </main>
            </div>
            <Toaster position="top-right" />
          </Providers>
        </DemoModeContext.Provider>
        </LocalCurrencyContext.Provider>
        </LanguageContext.Provider>
      </body>
    </html>
  );
}
