"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-[#181A20] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Orders Card */}
          <Link href="/p2p/orders" className="card card-hover p-6 flex flex-col items-center justify-center">
            <span className="text-4xl mb-2">📦</span>
            <span className="text-lg font-semibold">My Orders</span>
            <span className="text-gray-500 mt-1 text-sm">View and manage your open orders</span>
          </Link>
          {/* Trades Card */}
          <Link href="/p2p/trades" className="card card-hover p-6 flex flex-col items-center justify-center">
            <span className="text-4xl mb-2">💱</span>
            <span className="text-lg font-semibold">My Trades</span>
            <span className="text-gray-500 mt-1 text-sm">See your active and past trades</span>
          </Link>
          {/* Create Trade Card */}
          <Link href="/p2p/create" className="card card-hover p-6 flex flex-col items-center justify-center">
            <span className="text-4xl mb-2">➕</span>
            <span className="text-lg font-semibold">Create Trade</span>
            <span className="text-gray-500 mt-1 text-sm">Start a new P2P trade</span>
          </Link>
        </div>
        <div className="bg-[#23262F] rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Welcome{address ? `, ${address.slice(0, 6)}...${address.slice(-4)}` : "!"}</h2>
          <p className="mb-2">This is your dashboard. Here you can:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>View and manage your P2P orders</li>
            <li>Track your ongoing and completed trades</li>
            <li>Quickly create new trades</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 