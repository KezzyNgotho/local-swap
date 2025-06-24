"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();

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
      {/* Persistent NavBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#23262F] border-t border-[#181A20] flex justify-around items-center py-2 sm:static sm:max-w-2xl sm:mx-auto sm:rounded-xl sm:mt-4 sm:mb-6 sm:py-3">
        <NavLink href="/p2p" label="Dashboard" icon="🏠" active={pathname === "/p2p"} />
        <NavLink href="/p2p/create" label="Create" icon="➕" active={pathname === "/p2p/create"} />
        <NavLink href="/p2p/orders" label="Orders" icon="📦" active={pathname === "/p2p/orders"} />
        <NavLink href="/p2p/trades" label="Trades" icon="💱" active={pathname === "/p2p/trades"} />
      </nav>
      <div className="pb-16 sm:pb-0"> {/* Add bottom padding for mobile nav */}
        {/* Travel Utility Banner */}
        <div className="max-w-2xl mx-auto mb-4 flex items-center gap-3 bg-[#F0B90B] text-[#181A20] rounded-xl p-4 shadow-md">
          <span className="text-2xl">✈️</span>
          <span className="font-bold">Travel</span>
        </div>

        {/* Header */}
        <div className="max-w-2xl mx-auto flex items-center gap-3 mb-6">
          <Image src="/logo.svg" alt="App Logo" width={40} height={40} className="rounded-full bg-white p-1" />
          <h1 className="text-2xl font-extrabold text-white leading-tight">Dashboard</h1>
          <div className="ml-auto text-xs text-gray-400 bg-[#23262F] px-3 py-1 rounded-lg">
            {isConnected ? (
              <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
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
            <div className="max-w-2xl mx-auto mb-4 flex items-center gap-3 bg-[#176B63] text-white rounded-xl p-4 shadow-md">
              <span className="text-2xl">💱</span>
              <span className="font-bold">{suggestedRate.rate}</span>
            </div>

            {/* Quick Actions */}
            <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 mb-8">
              <Link href="/p2p/create" className="flex flex-col items-center justify-center bg-[#176B63] hover:bg-[#1A8C7A] text-white rounded-xl p-6 shadow-lg transition-all">
                <span className="text-3xl">➕</span>
                <span className="font-semibold">Create</span>
              </Link>
              <Link href="/p2p/orders" className="flex flex-col items-center justify-center bg-[#23262F] hover:bg-[#2C2F3A] text-white rounded-xl p-6 shadow-lg transition-all">
                <span className="text-3xl">📦</span>
                <span className="font-semibold">Orders</span>
              </Link>
              <Link href="/p2p/trades" className="flex flex-col items-center justify-center bg-[#23262F] hover:bg-[#2C2F3A] text-white rounded-xl p-6 shadow-lg transition-all">
                <span className="text-3xl">💱</span>
                <span className="font-semibold">Trades</span>
              </Link>
            </div>

            {/* Market Maker Callout */}
            <div className="max-w-2xl mx-auto mb-4 flex items-center gap-3 bg-[#23262F] text-white rounded-xl p-4 shadow-md">
              <span className="text-2xl">🏦</span>
              <span className="font-bold">Market Maker</span>
            </div>

            {/* Recent Activity */}
            <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-5 mb-8 shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕒</span>
                <span className="font-bold">Recent</span>
              </div>
              <ul className="divide-y divide-gray-700 mt-2">
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
            <div className="max-w-2xl mx-auto mb-4 flex items-center gap-3 bg-[#176B63] text-white rounded-xl p-4 shadow-md">
              <span className="text-2xl">🛡️</span>
              <span className="font-bold">Safe</span>
            </div>

            {/* How it works */}
            <div className="max-w-2xl mx-auto bg-[#176B63] rounded-xl p-5 shadow-md text-white flex items-center gap-4">
              <span className="text-2xl">🔗</span>
              <span className="text-2xl">💸</span>
              <span className="text-2xl">✅</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// NavLink component
function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`flex flex-col items-center px-2 sm:px-4 py-1 rounded-lg transition text-xs font-semibold ${active ? "text-[#F0B90B] bg-[#181A20]" : "text-white hover:text-[#F0B90B]"}`}>
      <span className="text-xl mb-0.5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
} 