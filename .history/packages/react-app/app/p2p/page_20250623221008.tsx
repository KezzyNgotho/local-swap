"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { DemoModeContext } from "../layout";
import { Toaster, toast } from 'sonner';

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

const countryOptions = [
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "Nigeria", label: "Nigeria", flag: "🇳🇬" },
  { code: "Ghana", label: "Ghana", flag: "🇬🇭" },
];

// Mock featured offers
const featuredOffers = [
  { id: "OFFER-001", asset: "cUSD", amount: 100, rate: "1500 NGN", marketMaker: true },
  { id: "OFFER-002", asset: "USDC", amount: 50, rate: "12 GHS", marketMaker: false },
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [suggestedRate, setSuggestedRate] = useState({ rate: "-", currency: "-", reason: "-" });
  const router = useRouter();
  const pathname = usePathname();
  const [manualCountry, setManualCountry] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock verification and rating logic
  const isVerified = address && address.endsWith("8");
  const kycStatus = isVerified ? "Verified" : "Unverified";
  const mockRating = 4.7;
  const mockReviews = [
    { user: "0x123...abcd", rating: 5, text: "Great trader!" },
    { user: "0x456...ef12", rating: 4, text: "Smooth transaction." },
  ];

  // Push notification (mock)
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("🎉 New featured offer available!", { duration: 4000 });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

  // Use manualCountry if set, otherwise use detected location
  const effectiveLocation = manualCountry ? { country: manualCountry } : location;

  // Filter recent activity by location (mock logic)
  const filteredRecent = effectiveLocation && effectiveLocation.country !== 'US'
    ? mockRecent.filter(item => (effectiveLocation.country === 'Nigeria' && item.id.endsWith('1')) || (effectiveLocation.country === 'Ghana' && item.id.endsWith('2')))
    : mockRecent;

  return (
    <div className="min-h-screen bg-[#181A20] py-6 px-2 sm:px-4">
      {/* Top bar with profile icon */}
      <div className="max-w-2xl mx-auto flex items-center justify-end mb-2">
        <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 px-3 py-1 rounded bg-[#23262F] text-white text-xs">
          <span className="text-lg">👤</span>
          <span>Profile</span>
        </button>
      </div>
      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#23262F] rounded-xl p-6 shadow-lg w-full max-w-sm relative">
            <button onClick={() => setProfileOpen(false)} className="absolute top-2 right-2 text-white text-xl">×</button>
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-4xl">👤</span>
              <span className="text-white font-bold text-lg">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}</span>
              {isVerified && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Verified</span>}
              {!isVerified && <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">Unverified</span>}
              <span className="text-xs text-gray-300">KYC: {kycStatus}</span>
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < Math.round(mockRating) ? '★' : '☆'}</span>
                ))}
                <span className="text-xs text-gray-200 ml-1">{mockRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="mb-2 text-white font-semibold">Reviews</div>
            <ul className="mb-2 max-h-32 overflow-y-auto">
              {mockReviews.map((r, i) => (
                <li key={i} className="text-xs text-gray-200 mb-1 border-b border-gray-700 pb-1">
                  <span className="font-mono">{r.user}</span>: <span className="text-yellow-400">{Array.from({ length: 5 }).map((_, j) => (j < r.rating ? '★' : '☆'))}</span> <span className="ml-1">{r.text}</span>
                </li>
              ))}
            </ul>
            <button className="w-full mt-2 bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition" onClick={() => setProfileOpen(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Location Selector */}
      <div className="max-w-2xl mx-auto flex items-center gap-2 mb-4">
        <span className="text-lg">🌍</span>
        <span className="font-bold">Location:</span>
        <select
          value={manualCountry || (location && location.country) || "US"}
          onChange={e => setManualCountry(e.target.value)}
          className="bg-[#23262F] text-white rounded-lg px-2 py-1 border border-[#176B63] focus:ring-2 focus:ring-[#F0B90B]"
          title="Select country location"
        >
          {countryOptions.map(opt => (
            <option key={opt.code} value={opt.code}>{opt.flag} {opt.label}</option>
          ))}
        </select>
        <span className="ml-2 text-lg">
          {countryOptions.find(opt => opt.code === (manualCountry || (location && location.country) || "US"))?.flag}
        </span>
      </div>
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

            {/* Featured Offers */}
            <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-5 mb-6 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⭐</span>
                <span className="font-bold">Featured Offers</span>
              </div>
              <ul className="divide-y divide-gray-700">
                {featuredOffers.map((offer, i) => (
                  <li key={i} className="flex items-center py-2 text-sm text-gray-200">
                    <span className="mr-2 text-lg">{offer.asset}</span>
                    <span className="font-medium mr-2">{offer.amount}</span>
                    <span className="mr-2">@ {offer.rate}</span>
                    {offer.marketMaker && <span className="ml-2 bg-[#F0B90B] text-[#181A20] px-2 py-0.5 rounded text-xs font-bold">Market Maker</span>}
                    <button className="ml-auto bg-[#176B63] text-white px-3 py-1 rounded text-xs hover:bg-[#1A8C7A]">View</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-5 mb-8 shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕒</span>
                <span className="font-bold">Recent</span>
                {effectiveLocation && effectiveLocation.country !== 'US' && (
                  <span className="ml-2 text-xs bg-[#176B63] text-white px-2 py-0.5 rounded-lg">{effectiveLocation.country === 'Nigeria' ? '🇳🇬' : effectiveLocation.country === 'Ghana' ? '🇬🇭' : effectiveLocation.country}</span>
                )}
              </div>
              <ul className="divide-y divide-gray-700 mt-2">
                {filteredRecent.map((item, i) => (
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
      <Toaster position="top-right" />
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