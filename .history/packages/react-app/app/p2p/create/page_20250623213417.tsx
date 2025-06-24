"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const getSuggestedRate = (location, currency, hour) => {
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

export default function CreateTrade() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [suggestedRate, setSuggestedRate] = useState({ rate: "-", currency: "-", reason: "-" });
  const [form, setForm] = useState({ amount: "", rate: "", currency: "USD", paymentMethod: "MiniPay" });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          let country = "US";
          if (longitude < 10 && latitude > 4 && latitude < 14) country = "Nigeria";
          else if (longitude > -2 && latitude > 4 && latitude < 12) country = "Ghana";
          setLocation({ country, latitude, longitude });
          setSuggestedRate(getSuggestedRate({ country }, currency, new Date().getHours()));
          setIsLoading(false);
        },
        () => {
          setLocation(null);
          setSuggestedRate(getSuggestedRate(null, currency, new Date().getHours()));
          setIsLoading(false);
        }
      );
    } else {
      setLocation(null);
      setSuggestedRate(getSuggestedRate(null, currency, new Date().getHours()));
      setIsLoading(false);
    }
  }, [currency]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "currency") setCurrency(e.target.value);
  };

  const handleAutoFill = () => {
    setForm((f) => ({ ...f, rate: suggestedRate.rate.split(" ")[3] || "" }));
  };

  return (
    <div className="min-h-screen bg-[#181A20] py-6 px-2 sm:px-4">
      {/* Persistent NavBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#23262F] border-t border-[#181A20] flex justify-around items-center py-2 sm:static sm:max-w-lg sm:mx-auto sm:rounded-xl sm:mt-4 sm:mb-6 sm:py-3">
        <NavLink href="/p2p" label="Dashboard" icon="🏠" active={pathname === "/p2p"} />
        <NavLink href="/p2p/create" label="Create" icon="➕" active={pathname === "/p2p/create"} />
        <NavLink href="/p2p/orders" label="Orders" icon="📦" active={pathname === "/p2p/orders"} />
        <NavLink href="/p2p/trades" label="Trades" icon="💱" active={pathname === "/p2p/trades"} />
      </nav>
      <div className="pb-16 sm:pb-0"> {/* Add bottom padding for mobile nav */}
      {/* Travel Utility Banner */}
      <div className="max-w-lg mx-auto mb-4">
        <div className="flex items-center gap-3 bg-[#F0B90B] text-[#181A20] rounded-xl p-4 shadow-md">
          <span className="text-2xl">✈️</span>
          <div>
            <span className="font-bold">Traveling?</span> Instantly swap your stablecoins for local cash when you arrive. No banks, no hassle.
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-lg mx-auto flex items-center gap-3 mb-6">
        <Image src="/logo.svg" alt="App Logo" width={40} height={40} className="rounded-full bg-white p-1" />
        <div>
          <h1 className="text-xl font-extrabold text-white leading-tight">Create a Trade</h1>
          <p className="text-xs text-gray-300">Quick, safe, and local</p>
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
        <div className="max-w-lg mx-auto flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0B90B]"></div>
        </div>
      ) : (
        <>
          {/* Suggested Rate Card */}
          <div className="max-w-lg mx-auto mb-4">
            <div className="flex items-center gap-3 bg-[#176B63] text-white rounded-xl p-4 shadow-md">
              <span className="text-2xl">💱</span>
              <div>
                <div className="font-bold">Suggested Rate</div>
                <div className="text-lg">{suggestedRate.rate}</div>
                <div className="text-xs text-[#F0B90B]">{suggestedRate.reason}</div>
              </div>
              <button onClick={handleAutoFill} className="ml-auto bg-[#F0B90B] text-[#181A20] px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#ffe066] transition">Auto-Fill</button>
            </div>
          </div>

          {/* Trade Form */}
          <form className="max-w-lg mx-auto bg-[#23262F] rounded-xl p-6 shadow-lg flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[#181A20] text-white border border-gray-700 focus:ring-2 focus:ring-[#F0B90B]"
                placeholder="Enter amount"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm text-gray-300 mb-1">Currency</label>
              <select
                id="currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[#181A20] text-white border border-gray-700 focus:ring-2 focus:ring-[#F0B90B]"
              >
                <option value="USD">USD</option>
                <option value="cUSD">cUSD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rate</label>
              <input
                type="text"
                name="rate"
                value={form.rate}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[#181A20] text-white border border-gray-700 focus:ring-2 focus:ring-[#F0B90B]"
                placeholder="e.g. 1500 NGN"
              />
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-sm text-gray-300 mb-1">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[#181A20] text-white border border-gray-700 focus:ring-2 focus:ring-[#F0B90B]"
              >
                <option value="MiniPay">MiniPay</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition">Create Trade</button>
          </form>

          {/* Trust & Safety */}
          <div className="max-w-lg mx-auto mt-4 mb-4">
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
          <div className="max-w-lg mx-auto bg-[#176B63] rounded-xl p-5 shadow-md text-white">
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
    </div>
  );
}

// NavLink component
function NavLink({ href, label, icon, active }) {
  return (
    <a href={href} className={`flex flex-col items-center px-2 sm:px-4 py-1 rounded-lg transition text-xs font-semibold ${active ? "text-[#F0B90B] bg-[#181A20]" : "text-white hover:text-[#F0B90B]"}`}>
      <span className="text-xl mb-0.5">{icon}</span>
      <span>{label}</span>
    </a>
  );
} 