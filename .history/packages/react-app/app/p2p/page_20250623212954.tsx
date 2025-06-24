"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";

const mockRecent = [
  { type: "Order", id: "ORD-001", status: "Open", link: "/p2p/orders" },
  { type: "Trade", id: "TRD-002", status: "Completed", link: "/p2p/trades" },
  { type: "Order", id: "ORD-003", status: "Cancelled", link: "/p2p/orders" },
];

const getSuggestedRate = (location, currency, hour) => {
  // Mock logic: adjust rate based on location, currency, and time
  if (!location) return { rate: "-", currency: "-", reason: "Location unknown" };
  if (currency === "USD") {
    if (location.country === "Nigeria") return { rate: "1 USD ≈ 1500 NGN", currency: "NGN", reason: "Based on local market (Nigeria)" };
    if (location.country === "Ghana") return { rate: "1 USD ≈ 12 GHS", currency: "GHS", reason: "Based on local market (Ghana)" };
  }
  if (currency === "cUSD") {
    if (location.country === "Nigeria") return { rate: "1 cUSD ≈ 1500 NGN", currency: "NGN", reason: "Based on local market (Nigeria)" };
    if (location.country === "Ghana") return { rate: "1 cUSD ≈ 12 GHS", currency: "GHS", reason: "Based on local market (Ghana)" };
  }
  return { rate: "1 USD ≈ 1 USD", currency: "USD", reason: "Default rate" };
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [suggestedRate, setSuggestedRate] = useState({ rate: "-", currency: "-", reason: "-" });

  useEffect(() => {
    setIsLoading(true);
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          // Use a free geolocation API to get country from lat/lon (mocked here)
          // In production, use a real API
          const { latitude, longitude } = pos.coords;
          // Mock: Nigeria if longitude < 10, Ghana if longitude > -2, else US
          let country = "US";
          if (longitude < 10 && latitude > 4 && latitude < 14) country = "Nigeria";
          else if (longitude > -2 && latitude > 4 && latitude < 12) country = "Ghana";
          setLocation({ country, latitude, longitude });
          setSuggestedRate(getSuggestedRate({ country }, "USD", new Date().getHours()));
          setIsLoading(false);
        },
        () => {
          setLocation(null);
          setSuggestedRate(getSuggestedRate(null, "USD", new Date().getHours()));
          setIsLoading(false);
        }
      );
    } else {
      setLocation(null);
      setSuggestedRate(getSuggestedRate(null, "USD", new Date().getHours()));
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#181A20] py-6 px-2 sm:px-4">
      {/* Travel Utility Banner */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="flex items-center gap-3 bg-[#F0B90B] text-[#181A20] rounded-xl p-4 shadow-md">
          <span className="text-2xl">✈️</span>
          <div>
            <span className="font-bold">Traveling?</span> Instantly swap your stablecoins for local cash when you arrive. No banks, no hassle.
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto flex items-center gap-3 mb-6">
        <Image src="/logo.svg" alt="App Logo" width={40} height={40} className="rounded-full bg-white p-1" />
        <div>
          <h1 className="text-2xl font-extrabold text-white leading-tight">Welcome to LocalSwap</h1>
          <p className="text-sm text-gray-300">Your Celo P2P mini app</p>
        </div>
        <div className="ml-auto text-xs text-gray-400 bg-[#23262F] px-3 py-1 rounded-lg">
          {isConnected ? (
            <span>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          ) : (
            <span>Not Connected</span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="max-w-2xl mx-auto flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0B90B]"></div>
        </div>
      ) : (
        <>
          {/* Suggested Rate Card */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex items-center gap-3 bg-[#176B63] text-white rounded-xl p-4 shadow-md">
              <span className="text-2xl">💱</span>
              <div>
                <div className="font-bold">Suggested Rate</div>
                <div className="text-lg">{suggestedRate.rate}</div>
                <div className="text-xs text-[#F0B90B]">{suggestedRate.reason}</div>
              </div>
              <button className="ml-auto bg-[#F0B90B] text-[#181A20] px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#ffe066] transition">Auto-Fill</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link href="/p2p/create" className="flex flex-col items-center justify-center bg-[#176B63] hover:bg-[#1A8C7A] text-white rounded-xl p-6 shadow-lg transition-all">
              <span className="text-3xl mb-2">➕</span>
              <span className="font-semibold">Create Trade</span>
              <span className="text-xs mt-1 opacity-80">Start a new P2P trade</span>
            </Link>
            <Link href="/p2p/orders" className="flex flex-col items-center justify-center bg-[#23262F] hover:bg-[#2C2F3A] text-white rounded-xl p-6 shadow-lg transition-all">
              <span className="text-3xl mb-2">📦</span>
              <span className="font-semibold">My Orders</span>
              <span className="text-xs mt-1 opacity-80">View your open orders</span>
            </Link>
            <Link href="/p2p/trades" className="flex flex-col items-center justify-center bg-[#23262F] hover:bg-[#2C2F3A] text-white rounded-xl p-6 shadow-lg transition-all">
              <span className="text-3xl mb-2">💱</span>
              <span className="font-semibold">My Trades</span>
              <span className="text-xs mt-1 opacity-80">Track your trades</span>
            </Link>
          </div>

          {/* Market Maker Callout */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex items-center gap-3 bg-[#23262F] text-white rounded-xl p-4 shadow-md">
              <span className="text-2xl">🏦</span>
              <div>
                <div className="font-bold">Are you a local market maker?</div>
                <div className="text-xs text-gray-300">Provide liquidity, earn fees, and help travelers access fair rates. <a href="#" className="text-[#F0B90B] underline">Join as a market maker</a></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-5 mb-8 shadow-md">
            <h2 className="text-lg font-bold text-white mb-3">Recent Activity</h2>
            <ul className="divide-y divide-gray-700">
              {mockRecent.map((item, i) => (
                <li key={i} className="flex items-center py-2 text-sm text-gray-200">
                  <span className="mr-2 text-lg">{item.type === "Order" ? "📦" : "💱"}</span>
                  <span className="font-medium mr-2">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold mr-2 ${item.status === "Completed" ? "bg-green-200 text-green-800" : item.status === "Open" ? "bg-blue-200 text-blue-800" : "bg-red-200 text-red-800"}`}>{item.status}</span>
                  <Link href={item.link} className="ml-auto text-[#F0B90B] hover:underline">View</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex items-center gap-3 bg-[#176B63] text-white rounded-xl p-4 shadow-md">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-bold">Trust & Safety</div>
                <div className="text-xs text-[#F0B90B]">Verified users • Escrow protection • Dispute resolution • Community reviews</div>
              </div>
              <span className="ml-auto bg-[#F0B90B] text-[#181A20] px-3 py-1 rounded-lg text-xs font-bold">Safe for Travelers</span>
            </div>
          </div>

          {/* How it works */}
          <div className="max-w-2xl mx-auto bg-[#176B63] rounded-xl p-5 shadow-md text-white">
            <h2 className="text-lg font-bold mb-3">How it works</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 bg-[#1A8C7A] rounded-lg p-3">
                <span className="text-2xl">🔗</span>
                <span className="text-sm">Connect your wallet</span>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-[#1A8C7A] rounded-lg p-3">
                <span className="text-2xl">💸</span>
                <span className="text-sm">Create or join a trade</span>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-[#1A8C7A] rounded-lg p-3">
                <span className="text-2xl">✅</span>
                <span className="text-sm">Complete your transaction</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 