"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useP2PExchange } from "../../hooks/useP2PExchange";
import { formatEther } from "viem";
import { useState } from "react";

// Mock market makers data
const topMarketMakers = [
  { address: "0x1234...abcd", trades: 120, liquidity: "5,000 cUSD" },
  { address: "0x5678...efgh", trades: 98, liquidity: "3,200 cUSD" },
  { address: "0x9abc...ijkl", trades: 75, liquidity: "2,100 cUSD" },
];

export default function P2PDashboard() {
  const { address, isConnected } = useAccount();
  const { trades } = useP2PExchange();
  const [showMakerInfo, setShowMakerInfo] = useState(false);

  // For demo: show only the user's trades
  const myTrades = trades.filter(
    (trade) => trade.seller === address || trade.buyer === address
  );

  // For demo: mock balance (replace with real balance logic if available)
  const balance = myTrades.length > 0 ? myTrades[0].amount : "0";

  return (
    <div className="min-h-screen bg-[#23262F] flex flex-col justify-between">
      {/* Header */}
      <header className="bg-[#176B63] py-4 px-8 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-white">P2P Mini</span>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <span className="bg-[#23262F] text-white px-3 py-1 rounded-lg font-mono text-xs">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          )}
          <ConnectButton showBalance={false} accountStatus="avatar" />
        </div>
      </header>

      {/* Market Maker CTA */}
      <div className="w-full flex flex-col items-center justify-center mt-8">
        <div className="bg-[#F0B90B] text-[#176B63] px-6 py-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4 max-w-xl">
          <div className="font-bold text-lg">Become a Market Maker</div>
          <button
            className="bg-[#176B63] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0e4d3a] transition"
            onClick={() => setShowMakerInfo(true)}
          >
            Learn More
          </button>
        </div>
        {showMakerInfo && (
          <div className="mt-4 bg-[#23262F] border border-[#176B63] rounded-lg p-4 text-white max-w-lg text-center">
            <div className="font-bold text-[#F0B90B] mb-2">Why become a Market Maker?</div>
            <ul className="list-disc list-inside text-left text-sm mb-2">
              <li>Earn fees by providing liquidity to the P2P market</li>
              <li>Help travelers and locals get the best rates</li>
              <li>Get a special Market Maker badge</li>
            </ul>
            <button className="mt-2 px-4 py-2 bg-[#F0B90B] text-[#176B63] rounded-lg font-semibold hover:bg-[#e6a800] transition" onClick={() => setShowMakerInfo(false)}>Close</button>
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full gap-8">
        {/* Balance Card */}
        <div className="w-full bg-[#176B63] rounded-2xl shadow-lg p-6 flex flex-col items-center mb-6">
          <span className="text-white text-lg font-semibold mb-2">Wallet Balance</span>
          <span className="text-3xl font-bold text-white mb-1">{formatEther(BigInt(balance))} cUSD</span>
        </div>

        {/* Quick Actions */}
        <div className="w-full flex gap-4 justify-center mb-8">
          <Link href="/p2p/create" className="bg-[#F0B90B] text-[#176B63] font-bold px-6 py-3 rounded-lg text-lg shadow hover:bg-[#e6a800] transition">Create Trade</Link>
          <Link href="/p2p/trades" className="bg-[#23262F] text-white font-bold px-6 py-3 rounded-lg text-lg shadow border border-[#176B63] hover:bg-[#176B63] hover:text-white transition">My Trades</Link>
        </div>

        {/* Top Market Makers */}
        <div className="w-full bg-[#23262F] rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>Top Market Makers</span>
            <span className="bg-[#F0B90B] text-[#176B63] px-2 py-1 rounded text-xs font-bold ml-2">Market Maker</span>
          </h2>
          <ul className="divide-y divide-[#333]">
            {topMarketMakers.map((maker, idx) => (
              <li key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white">{maker.address}</span>
                  <span className="bg-[#F0B90B] text-[#176B63] px-2 py-1 rounded text-xs font-bold">Market Maker</span>
                </div>
                <div className="text-gray-300 text-sm">{maker.trades} trades • {maker.liquidity}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Trades */}
        <div className="w-full bg-[#23262F] rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
          {myTrades.length === 0 ? (
            <div className="text-gray-400 text-center">No recent trades yet.</div>
          ) : (
            <ul className="divide-y divide-[#333]">
              {myTrades.slice(0, 5).map((trade, idx) => (
                <li key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white mr-2">
                      {trade.seller === address ? "Sell" : "Buy"}
                    </span>
                    <span className="text-gray-300">{formatEther(BigInt(trade.amount))} {trade.token}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-[#176B63] text-white font-semibold">
                    {trade.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#176B63] text-white py-4 px-8 mt-8 shadow-inner text-center text-sm">
        &copy; {new Date().getFullYear()} P2P Mini. All rights reserved.
      </footer>
    </div>
  );
} 