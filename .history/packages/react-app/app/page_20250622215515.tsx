"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#23262F] flex flex-col">
      {/* Header */}
      <header className="bg-[#176B63] py-4 px-8 flex items-center justify-between">
        {/* Removed logo header */}
        <nav className="flex gap-8 text-white font-medium text-lg">
          <Link href="#">HOME</Link>
          <Link href="#">USE CASES</Link>
          <Link href="#">JOIN COMMUNITY</Link>
        </nav>
        <Link href="#" className="border border-white rounded-lg px-5 py-2 text-white hover:bg-[#176B63]/80 transition">DOWNLOAD APP →</Link>
      </header>

      {/* Splash Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16 max-w-7xl mx-auto w-full">
        {/* Left: Info */}
        <div className="flex flex-col gap-8 items-start justify-center">
          <h1 className="text-5xl font-extrabold text-white mb-2">We U</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Pay with stablecoins.</h2>
          <p className="text-lg text-gray-300 mb-6">Use your stablecoins on <span className="text-[#176B63] font-semibold">everyday</span> transactions.</p>
          <div className="flex items-center gap-4 mb-6">
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
          <Link href="/signup" className="bg-[#F0B90B] text-[#176B63] font-bold px-8 py-3 rounded-lg text-lg shadow hover:bg-[#e6a800] transition">Sign Up</Link>
        </div>
      </main>
    </div>
  );
}
