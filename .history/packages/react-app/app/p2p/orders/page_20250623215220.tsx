"use client";

import { useEffect, useState } from "react";

// Mock orders data for demonstration
const orders = [
  { id: "ORD-001", type: "Order", status: "Open" },
  { id: "ORD-002", type: "Order", status: "Completed" },
  { id: "ORD-003", type: "Order", status: "Cancelled" },
];

export default function OrdersPage() {
  const [location, setLocation] = useState<{country: string, latitude: number, longitude: number} | null>(null);

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

  const filteredOrders = location && location.country !== 'US'
    ? orders.filter(item => (location.country === 'Nigeria' && item.id.endsWith('1')) || (location.country === 'Ghana' && item.id.endsWith('2')))
    : orders;

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">📦</span>
      <span className="font-bold">Orders</span>
      {location && location.country !== 'US' && (
        <span className="ml-2 text-xs bg-[#176B63] text-white px-2 py-0.5 rounded-lg">
          {location.country === 'Nigeria' ? '🇳🇬' : location.country === 'Ghana' ? '🇬🇭' : location.country}
        </span>
      )}
    </div>
  );
} 