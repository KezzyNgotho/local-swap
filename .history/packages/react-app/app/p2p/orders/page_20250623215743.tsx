"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Mock orders data for demonstration
const orders = [
  { id: "ORD-001", type: "Order", status: "Open" },
  { id: "ORD-002", type: "Order", status: "Completed" },
  { id: "ORD-003", type: "Order", status: "Cancelled" },
];

const countryOptions = [
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "Nigeria", label: "Nigeria", flag: "🇳🇬" },
  { code: "Ghana", label: "Ghana", flag: "🇬🇭" },
];

export default function OrdersPage() {
  const [location, setLocation] = useState<{country: string, latitude: number, longitude: number} | null>(null);
  const [manualCountry, setManualCountry] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          let country = "US";
          if (longitude < 10 && latitude > 4 && latitude < 14) country = "Nigeria";
          else if (longitude > -2 && latitude > 4 && latitude < 12) country = "Ghana";
          setLocation({ country, latitude, longitude });
        },
        () => setLocation(null)
      );
    } else {
      setLocation(null);
    }
  }, []);

  const effectiveCountry = manualCountry || (location && location.country) || "US";
  const filteredOrders = effectiveCountry !== 'US'
    ? orders.filter(item => (effectiveCountry === 'Nigeria' && item.id.endsWith('1')) || (effectiveCountry === 'Ghana' && item.id.endsWith('2')))
    : orders;

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
      <div className="max-w-lg mx-auto flex items-center gap-2 mb-4">
        <span className="text-lg">🌍</span>
        <span className="font-bold">Location:</span>
        <select
          value={effectiveCountry}
          onChange={e => setManualCountry(e.target.value)}
          className="bg-[#23262F] text-white rounded-lg px-2 py-1 border border-[#176B63] focus:ring-2 focus:ring-[#F0B90B]"
          title="Select country location"
        >
          {countryOptions.map(opt => (
            <option key={opt.code} value={opt.code}>{opt.flag} {opt.label}</option>
          ))}
        </select>
        <span className="ml-2 text-lg">
          {countryOptions.find(opt => opt.code === effectiveCountry)?.flag}
        </span>
      </div>
      <div className="max-w-lg mx-auto bg-[#23262F] rounded-xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📦</span>
          <span className="font-bold">Orders</span>
          {effectiveCountry !== 'US' && (
            <span className="ml-2 text-xs bg-[#176B63] text-white px-2 py-0.5 rounded-lg">{countryOptions.find(opt => opt.code === effectiveCountry)?.flag}</span>
          )}
        </div>
        <ul className="divide-y divide-gray-700">
          {filteredOrders.map((item, i) => (
            <li key={i} className="flex items-center py-2 text-sm text-gray-200">
              <span className="mr-2 text-lg">📦</span>
              <span className="font-medium mr-2">{item.id}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold mr-2 ${item.status === "Completed" ? "bg-green-200 text-green-800" : item.status === "Open" ? "bg-blue-200 text-blue-800" : "bg-red-200 text-red-800"}`}>{item.status}</span>
            </li>
          ))}
        </ul>
      </div>
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