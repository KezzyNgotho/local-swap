"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

// Supported cStable and MiniPay coins
const currencyOptions = [
  { code: "cUSD", label: "cUSD (Celo Dollar)", coingecko: "celo-dollar" },
  { code: "cEUR", label: "cEUR (Celo Euro)", coingecko: "celo-euro" },
  { code: "cREAL", label: "cREAL (Celo Real)", coingecko: "celo-real" },
  { code: "cKES", label: "cKES (Celo Kenyan Shilling)", coingecko: "celo-kenyan-shilling" },
  { code: "cNGN", label: "cNGN (Celo Naira)", coingecko: "celo-naira" },
  { code: "cGHS", label: "cGHS (Celo Ghanaian Cedi)", coingecko: "celo-ghanaian-cedi" },
  { code: "cZAR", label: "cZAR (Celo South African Rand)", coingecko: "celo-south-african-rand" },
  { code: "cXOF", label: "cXOF (Celo West African CFA)", coingecko: "celo-west-african-cfa" },
  { code: "cXAF", label: "cXAF (Celo Central African CFA)", coingecko: "celo-central-african-cfa" },
  { code: "USDC", label: "USDC (USD Coin)", coingecko: "usd-coin" },
  { code: "USDT", label: "USDT (Tether)", coingecko: "tether" },
  // Add more MiniPay coins here as needed
];

const getSuggestedRate = (location, currency, hour, liveRates, lastUpdated) => {
  if (!location) return { rate: "-", currency: "-", reason: "Location unknown" };
  const coin = currencyOptions.find(opt => opt.code === currency);
  if (liveRates && coin && coin.coingecko) {
    // Map country to fiat
    let fiat = "usd";
    if (location.country === "Nigeria") fiat = "ngn";
    else if (location.country === "Ghana") fiat = "ghs";
    else if (location.country === "Kenya") fiat = "kes";
    else if (location.country === "Brazil") fiat = "brl";
    else if (location.country === "Germany" || location.country === "France") fiat = "eur";
    else if (location.country === "South Africa") fiat = "zar";
    else if (location.country === "Senegal") fiat = "xof";
    else if (location.country === "Cameroon") fiat = "xaf";
    const price = liveRates[coin.coingecko]?.[fiat];
    if (price) {
      return { rate: `1 ${currency} ≈ ${price} ${fiat.toUpperCase()}`, currency: fiat.toUpperCase(), reason: "Live rate", lastUpdated };
    }
  }
  // Fallback to mock rates
  if (currency === "cUSD" || currency === "USDC" || currency === "USDT") {
    if (location.country === "Nigeria" || location.country === "US") return { rate: `1 ${currency} ≈ 1500 NGN`, currency: "NGN", reason: "Based on local market (Nigeria)" };
    if (location.country === "Ghana") return { rate: `1 ${currency} ≈ 12 GHS`, currency: "GHS", reason: "Based on local market (Ghana)" };
    if (location.country === "Kenya") return { rate: `1 ${currency} ≈ 130 KES`, currency: "KES", reason: "Based on local market (Kenya)" };
  }
  if (currency === "cEUR") {
    if (location.country === "Germany" || location.country === "France") return { rate: "1 cEUR ≈ 1 EUR", currency: "EUR", reason: "Based on local market (Europe)" };
  }
  if (currency === "cREAL") {
    if (location.country === "Brazil") return { rate: "1 cREAL ≈ 1 BRL", currency: "BRL", reason: "Based on local market (Brazil)" };
  }
  if (currency === "cKES") {
    if (location.country === "Kenya") return { rate: "1 cKES ≈ 1 KES", currency: "KES", reason: "Based on local market (Kenya)" };
  }
  if (currency === "cZAR") {
    if (location.country === "South Africa") return { rate: "1 cZAR ≈ 1 ZAR", currency: "ZAR", reason: "Based on local market (South Africa)" };
  }
  if (currency === "cXOF") {
    if (location.country === "Senegal") return { rate: "1 cXOF ≈ 1 XOF", currency: "XOF", reason: "Based on local market (Senegal)" };
  }
  if (currency === "cXAF") {
    if (location.country === "Cameroon") return { rate: "1 cXAF ≈ 1 XAF", currency: "XAF", reason: "Based on local market (Cameroon)" };
  }
  return { rate: `1 ${currency} ≈ 1 ${currency.replace('c', '')}`, currency: currency.replace('c', ''), reason: "Default rate" };
};

export default function CreateTrade() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [suggestedRate, setSuggestedRate] = useState({ rate: "-", currency: "-", reason: "-" });
  const [form, setForm] = useState({ amount: "", rate: "", currency: "USD", paymentMethod: "MiniPay" });
  const [liveRates, setLiveRates] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch live rates from CoinGecko
  useEffect(() => {
    async function fetchRates() {
      try {
        const ids = currencyOptions.map(opt => opt.coingecko).join(",");
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,ngn,ghs,kes,brl,eur,zar,xof,xaf`);
        const data = await res.json();
        setLiveRates(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch {
        setLiveRates(null);
        setLastUpdated(null);
      }
    }
    fetchRates();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          let country = "US";
          if (longitude < 10 && latitude > 4 && latitude < 14) country = "Nigeria";
          else if (longitude > -2 && latitude > 4 && latitude < 12) country = "Ghana";
          else if (longitude > 33 && longitude < 42 && latitude > -5 && latitude < 5) country = "Kenya";
          else if (longitude > -50 && longitude < -30 && latitude > -35 && latitude < 0) country = "Brazil";
          else if (longitude > -10 && longitude < 30 && latitude > 35 && latitude < 60) country = "Germany";
          setLocation({ country, latitude, longitude });
          // Auto-select currency based on country
          let autoCurrency = "cUSD";
          if (country === "Ghana") autoCurrency = "cUSD";
          else if (country === "Kenya") autoCurrency = "cKES";
          else if (country === "Brazil") autoCurrency = "cREAL";
          else if (country === "Germany" || country === "France") autoCurrency = "cEUR";
          else if (country === "US") autoCurrency = "USDC";
          else if (country === "South Africa") autoCurrency = "cZAR";
          else if (country === "Senegal") autoCurrency = "cXOF";
          else if (country === "Cameroon") autoCurrency = "cXAF";
          setCurrency(autoCurrency);
          setForm(f => ({ ...f, currency: autoCurrency, rate: getSuggestedRate({ country }, autoCurrency, new Date().getHours(), liveRates, lastUpdated).rate.split(" ")[3] || "" }));
          setSuggestedRate(getSuggestedRate({ country }, autoCurrency, new Date().getHours(), liveRates, lastUpdated));
          setIsLoading(false);
        },
        () => {
          setLocation(null);
          setSuggestedRate(getSuggestedRate(null, currency, new Date().getHours(), liveRates, lastUpdated));
          setIsLoading(false);
        }
      );
    } else {
      setLocation(null);
      setSuggestedRate(getSuggestedRate(null, currency, new Date().getHours(), liveRates, lastUpdated));
      setIsLoading(false);
    }
  }, [liveRates, lastUpdated]);

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
        <h1 className="text-xl font-extrabold text-white leading-tight">Create</h1>
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
                <div className="text-xs text-[#F0B90B]">
                  {suggestedRate.reason}
                  {lastUpdated && suggestedRate.reason === "Live rate" && (
                    <span className="ml-2 text-gray-300">(updated {lastUpdated})</span>
                  )}
                </div>
              </div>
              <button onClick={handleAutoFill} className="ml-auto bg-[#F0B90B] text-[#181A20] px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#ffe066] transition">Auto-Fill</button>
            </div>
          </div>

          {/* Trade Form */}
          <form className="max-w-lg mx-auto bg-[#23262F] rounded-xl p-6 shadow-lg flex flex-col gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm text-gray-300 mb-1">Amount</label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[#181A20] text-white border border-gray-700 focus:ring-2 focus:ring-[#F0B90B]"
                placeholder="0"
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
                title="Select currency"
              >
                {currencyOptions.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rate" className="block text-sm text-gray-300 mb-1">Rate</label>
              <input
                id="rate"
                type="text"
                name="rate"
                value={form.rate}
                readOnly
                className="w-full rounded-lg px-3 py-2 bg-[#181A20] text-white border border-gray-700 focus:ring-2 focus:ring-[#F0B90B] opacity-70 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-sm text-gray-300 mb-1">Pay</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-[#181A20] text-white border border-gray-700 focus:ring-2 focus:ring-[#F0B90B]"
                title="Select payment method"
              >
                <option value="MiniPay">MiniPay</option>
                <option value="Bank">Bank</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-[#F0B90B] text-[#181A20] font-bold py-2 rounded-lg hover:bg-[#ffe066] transition">Create</button>
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