"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "../../components/ui/button";
import Image from "next/image";

const mockRecent = [
  { type: "Order", id: "ORD-001", status: "Open", link: "/p2p/orders" },
  { type: "Trade", id: "TRD-002", status: "Completed", link: "/p2p/trades" },
  { type: "Order", id: "ORD-003", status: "Cancelled", link: "/p2p/orders" },
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-[#181A20] py-6 px-2 sm:px-4">
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
    </div>
  );
} 