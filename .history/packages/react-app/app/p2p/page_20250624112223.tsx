"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useState, useContext, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { DemoModeContext, LocalCurrencyContext, LanguageContext } from "../layout";
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

// Mock currency conversion rates
const mockRates = {
  USD: 1,
  NGN: 1500,
  GHS: 12,
  KES: 130,
  EUR: 0.9,
  BRL: 5,
  ZAR: 18,
  XOF: 600,
  XAF: 600,
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [suggestedRate, setSuggestedRate] = useState({ rate: "-", currency: "-", reason: "-" });
  const router = useRouter();
  const pathname = usePathname();
  const [manualCountry, setManualCountry] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currency, setCurrency } = useContext(LocalCurrencyContext);
  const { lang } = useContext(LanguageContext);
  const [showTravel, setShowTravel] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [abTest, setAbTest] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const [analytics, setAnalytics] = useState({ pageViews: 1234, trades: 56 }); // mock
  const inviteRef = useRef<HTMLInputElement>(null);
  const inviteLink = "https://localswap.app/invite/abc123";

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

  // Helper to convert and format values
  function formatValue(amount, asset) {
    const rate = mockRates[currency] || 1;
    return `${(amount * rate).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} ${currency}`;
  }

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

            {/* Travel Mode Button */}
            <div className="max-w-2xl mx-auto flex justify-end mb-2">
              <button onClick={() => setShowTravel(true)} className="px-3 py-1 rounded bg-[#F0B90B] text-[#181A20] text-xs font-bold" aria-label="Activate Travel Mode" tabIndex={0}>✈️ Travel Mode</button>
            </div>
            {showTravel && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-[#23262F] rounded-xl p-6 shadow-lg w-full max-w-sm relative">
                  <button onClick={() => setShowTravel(false)} className="absolute top-2 right-2 text-white text-xl">×</button>
                  <div className="text-white font-bold text-lg mb-2">Travel Mode</div>
                  <div className="mb-2 text-gray-200">Welcome traveler! Here are local cash-out agents and ATMs near you (mock):</div>
                  <ul className="mb-4">
                    <li className="mb-1">🏧 ATM - Main Street, 0.2km</li>
                    <li className="mb-1">🧑‍💼 Agent - Market Square, 0.5km</li>
                    <li className="mb-1">🏧 ATM - Airport, 1.1km</li>
                  </ul>
                  <button onClick={() => setShowQR(true)} className="w-full bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition mb-2">Show QR for Payment</button>
                  <button onClick={() => setShowTravel(false)} className="w-full bg-[#23262F] text-white font-bold py-2 rounded-lg border border-gray-700 hover:bg-[#181A20] transition">Close</button>
                </div>
              </div>
            )}
            {showQR && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-[#23262F] rounded-xl p-6 shadow-lg w-full max-w-xs relative flex flex-col items-center">
                  <button onClick={() => setShowQR(false)} className="absolute top-2 right-2 text-white text-xl">×</button>
                  <div className="text-white font-bold text-lg mb-2">Scan to Pay</div>
                  <div className="bg-white p-4 rounded mb-2"><span className="text-4xl">📱</span></div>
                  <div className="text-xs text-gray-300 mb-2">(QR code placeholder)</div>
                  <button onClick={() => setShowQR(false)} className="w-full bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition">Close</button>
                </div>
              </div>
            )}

            {/* Featured Offers */}
            <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-5 mb-6 shadow-md" aria-label="Featured Offers" tabIndex={0}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⭐</span>
                <span className="font-bold">Featured Offers</span>
              </div>
              <ul className="divide-y divide-gray-700">
                {featuredOffers.map((offer, i) => (
                  <li key={i} className="flex items-center py-2 text-sm text-gray-200" tabIndex={0} aria-label={`Featured offer ${offer.asset} ${offer.amount}`}> 
                    <span className="mr-2 text-lg">{offer.asset}</span>
                    <span className="font-medium mr-2">{formatValue(offer.amount, offer.asset)}</span>
                    <span className="mr-2">@ {offer.rate}</span>
                    {offer.marketMaker && <span className="ml-2 bg-[#F0B90B] text-[#181A20] px-2 py-0.5 rounded text-xs font-bold">Market Maker</span>}
                    <button className="ml-auto bg-[#176B63] text-white px-3 py-1 rounded text-xs hover:bg-[#1A8C7A]" aria-label="View offer" tabIndex={0}>View</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-5 mb-8 shadow-md" aria-label="Recent Activity" tabIndex={0}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕒</span>
                <span className="font-bold">Recent</span>
                {effectiveLocation && effectiveLocation.country !== 'US' && (
                  <span className="ml-2 text-xs bg-[#176B63] text-white px-2 py-0.5 rounded-lg">{effectiveLocation.country === 'Nigeria' ? '🇳🇬' : effectiveLocation.country === 'Ghana' ? '🇬🇭' : effectiveLocation.country}</span>
                )}
              </div>
              <ul className="divide-y divide-gray-700 mt-2">
                {filteredRecent.map((item, i) => (
                  <li key={i} className="flex items-center py-2 text-sm text-gray-200" tabIndex={0} aria-label={`Recent activity ${item.id}`}> 
                    <span className="mr-2 text-lg">{item.type === "Order" ? "📦" : "💱"}</span>
                    <span className="font-medium mr-2">{item.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold mr-2 ${item.status === "Completed" ? "bg-green-200 text-green-800" : item.status === "Open" ? "bg-blue-200 text-blue-800" : "bg-red-200 text-red-800"}`}>{item.status}</span>
                    <Link href={item.link} className="ml-auto text-[#F0B90B] hover:underline" aria-label="View activity" tabIndex={0}>View</Link>
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

            {/* Referral Program & Community Links */}
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 bg-[#23262F] rounded-xl p-4 shadow-md flex flex-col items-start">
                <div className="font-bold text-white mb-2">Referral Program</div>
                <div className="text-xs text-gray-300 mb-2">Invite friends and earn rewards!</div>
                <div className="flex items-center gap-2 w-full mb-2">
                  <input ref={inviteRef} value={inviteLink} readOnly className="flex-1 px-2 py-1 rounded bg-[#181A20] text-white text-xs border border-gray-700" />
                  <button onClick={() => {navigator.clipboard.writeText(inviteLink); toast.success('Copied!')}} className="px-2 py-1 rounded bg-[#F0B90B] text-[#181A20] text-xs font-bold">Copy</button>
                </div>
                <div className="text-xs text-gray-400">Share your link: <a href={inviteLink} className="underline text-[#F0B90B]">{inviteLink}</a></div>
              </div>
              <div className="flex-1 bg-[#23262F] rounded-xl p-4 shadow-md flex flex-col items-start">
                <div className="font-bold text-white mb-2">Community</div>
                <div className="flex gap-3">
                  <a href="https://t.me/localswap" target="_blank" rel="noopener" className="text-2xl" aria-label="Telegram">💬</a>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener" className="text-2xl" aria-label="WhatsApp">🟢</a>
                  <a href="https://discord.gg/localswap" target="_blank" rel="noopener" className="text-2xl" aria-label="Discord">🟣</a>
                </div>
              </div>
            </div>
            {/* Fee Transparency */}
            <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-4 mb-6 shadow-md flex items-center gap-2">
              <span className="text-2xl">💸</span>
              <span className="font-bold">Fees:</span>
              <span className="text-xs text-gray-300">0.5% per trade, no hidden fees.</span>
            </div>
            {/* Help/FAQ and Status Page Buttons */}
            <div className="max-w-2xl mx-auto flex gap-4 mb-6">
              <button onClick={() => setShowFAQ(true)} className="flex-1 px-3 py-2 rounded bg-[#176B63] text-white text-xs font-bold">❓ FAQ / Help</button>
              <button onClick={() => setShowStatus(true)} className="flex-1 px-3 py-2 rounded bg-[#23262F] text-white text-xs font-bold">🟢 Status</button>
            </div>
            {showFAQ && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-[#23262F] rounded-xl p-6 shadow-lg w-full max-w-md relative">
                  <button onClick={() => setShowFAQ(false)} className="absolute top-2 right-2 text-white text-xl">×</button>
                  <div className="text-white font-bold text-lg mb-2">FAQ / Help</div>
                  <ul className="text-xs text-gray-200 list-disc pl-4">
                    <li>How do I create a trade? <span className="text-gray-400">Go to Create, fill the form, and submit.</span></li>
                    <li>How are rates set? <span className="text-gray-400">Rates are suggested based on live and local data.</span></li>
                    <li>Is my money safe? <span className="text-gray-400">Funds are held in escrow until both parties confirm.</span></li>
                    <li>How do I contact support? <span className="text-gray-400">Join our Telegram or Discord.</span></li>
                  </ul>
                  <button onClick={() => setShowFAQ(false)} className="w-full mt-4 bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition">Close</button>
                </div>
              </div>
            )}
            {showStatus && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-[#23262F] rounded-xl p-6 shadow-lg w-full max-w-xs relative">
                  <button onClick={() => setShowStatus(false)} className="absolute top-2 right-2 text-white text-xl">×</button>
                  <div className="text-white font-bold text-lg mb-2">Status Page</div>
                  <ul className="text-xs text-gray-200">
                    <li>Platform: <span className="text-green-400">Online</span></li>
                    <li>Escrow: <span className="text-green-400">Operational</span></li>
                    <li>Payments: <span className="text-green-400">Operational</span></li>
                    <li>Last checked: just now</li>
                  </ul>
                  <button onClick={() => setShowStatus(false)} className="w-full mt-4 bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition">Close</button>
                </div>
              </div>
            )}
            {/* 2FA and Session Management (mock) */}
            <div className="max-w-2xl mx-auto flex gap-4 mb-6">
              <button onClick={() => setShow2FA(true)} className="flex-1 px-3 py-2 rounded bg-[#23262F] text-white text-xs font-bold">🔒 2FA</button>
              <button onClick={() => setSessionModal(true)} className="flex-1 px-3 py-2 rounded bg-[#23262F] text-white text-xs font-bold">🖥️ Sessions</button>
              <button onClick={() => setAbTest(a => !a)} className={`flex-1 px-3 py-2 rounded text-xs font-bold ${abTest ? 'bg-[#F0B90B] text-[#181A20]' : 'bg-[#23262F] text-white'}`}>A/B Test: {abTest ? 'B' : 'A'}</button>
            </div>
            {show2FA && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-[#23262F] rounded-xl p-6 shadow-lg w-full max-w-xs relative">
                  <button onClick={() => setShow2FA(false)} className="absolute top-2 right-2 text-white text-xl">×</button>
                  <div className="text-white font-bold text-lg mb-2">2FA (Mock)</div>
                  <div className="text-xs text-gray-200 mb-2">Enable 2FA for extra security (mock only).</div>
                  <button onClick={() => setShow2FA(false)} className="w-full mt-2 bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition">Close</button>
                </div>
              </div>
            )}
            {sessionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-[#23262F] rounded-xl p-6 shadow-lg w-full max-w-xs relative">
                  <button onClick={() => setSessionModal(false)} className="absolute top-2 right-2 text-white text-xl">×</button>
                  <div className="text-white font-bold text-lg mb-2">Sessions (Mock)</div>
                  <ul className="text-xs text-gray-200 mb-2">
                    <li>Chrome (this device) <span className="text-green-400">Active</span></li>
                    <li>Mobile <span className="text-gray-400">Last week</span></li>
                  </ul>
                  <button onClick={() => setSessionModal(false)} className="w-full mt-2 bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition">Close</button>
                </div>
              </div>
            )}
            {/* Analytics (mock) */}
            <div className="max-w-2xl mx-auto bg-[#23262F] rounded-xl p-4 mb-6 shadow-md flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="font-bold">Analytics:</span>
              <span className="text-xs text-gray-300">Page Views: {analytics.pageViews} | Trades: {analytics.trades}</span>
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