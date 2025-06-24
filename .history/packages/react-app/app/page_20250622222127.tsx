"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#23262F] flex flex-col justify-between">
      {/* Header */}
      <header className="bg-[#176B63] py-4 px-8 flex items-center justify-between shadow-md">
        <nav className="flex gap-8 text-white font-medium text-lg">
          <Link href="#">HOME</Link>
          <Link href="#">USE CASES</Link>
          <Link href="#">JOIN COMMUNITY</Link>
        </nav>
        <Link href="#" className="border border-white rounded-lg px-5 py-2 text-white hover:bg-[#176B63]/80 transition">DOWNLOAD APP →</Link>
      </header>

      {/* Splash Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-8 py-16 max-w-7xl mx-auto w-full gap-8">
        {/* Left: Info */}
        <div className="flex-1 flex flex-col gap-6 items-start justify-center max-w-xl">
          <h1 className="text-6xl font-extrabold text-[#176B63] mb-2">We Integrate.</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Pay with stablecoins.</h2>
          <p className="text-lg text-gray-300 mb-4">Use your stablecoins on <span className="text-[#176B63] font-semibold">everyday</span> transactions.</p>
          <div className="flex items-center gap-4 mb-4">
            {/* Stablecoin icons placeholder */}
            <div className="flex items-center gap-1 bg-[#23262F] border border-[#176B63] rounded-full px-3 py-1">
              <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#176B63] font-bold">₵</span>
              <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#176B63] font-bold">$</span>
              <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#176B63] font-bold">€</span>
              <span className="ml-2 text-white font-semibold">+ more</span>
            </div>
          </div>
          <a href="#" className="mb-8 block">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12" />
          </a>
          <div className="w-full flex justify-start">
            <ConnectButton showBalance={false} label="Connect Wallet" />
          </div>
        </div>
        {/* Right: Phone Mockup with floating labels */}
        <div className="flex-1 flex items-center justify-center relative min-h-[500px]">
          {/* Floating Feature Labels */}
          <div className="absolute left-0 top-16 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-[#23262F] border border-[#176B63] rounded-lg px-3 py-2 shadow text-white">
              <svg className="w-6 h-6 text-[#176B63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" fill="#176B63"/><rect x="7" y="3" width="10" height="4" rx="1" fill="#176B63"/><rect x="7" y="3" width="10" height="4" rx="1" stroke="#fff" strokeWidth="1.5"/></svg>
              <span className="font-semibold">Merchant Payments</span>
            </div>
          </div>
          <div className="absolute right-0 top-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-[#23262F] border border-[#176B63] rounded-lg px-3 py-2 shadow text-white">
              <svg className="w-6 h-6 text-[#176B63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12l9 6 9-6-9-6-9 6z" fill="#176B63"/><path d="M2 12l9 6 9-6" stroke="#fff" strokeWidth="1.5"/></svg>
              <span className="font-semibold">Send Money</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-[#23262F] border border-[#176B63] rounded-lg px-3 py-2 shadow text-white">
              <svg className="w-6 h-6 text-[#176B63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" fill="#176B63"/><rect x="7" y="3" width="10" height="4" rx="1" fill="#176B63"/><rect x="7" y="3" width="10" height="4" rx="1" stroke="#fff" strokeWidth="1.5"/></svg>
              <span className="font-semibold">Bill Payments</span>
            </div>
          </div>
          {/* Phone Mockup */}
          <img src="/mobile.png" alt="App phone mockup" className="max-w-xs w-full rounded-2xl shadow-2xl border-4 border-[#176B63] bg-white z-10" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#176B63] text-white py-6 px-8 mt-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left text-sm">&copy; {new Date().getFullYear()} We U. All rights reserved.</div>
          <div className="flex gap-4 justify-center md:justify-end">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0B90B] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0B90B] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
