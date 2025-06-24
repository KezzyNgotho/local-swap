"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useP2PExchange } from '../../../hooks/useP2PExchange';
import { toast } from 'sonner';
import { formatEther } from 'viem';
import Link from 'next/link';

type TradeStatus = 'ACTIVE' | 'LOCKED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

interface Trade {
  id: string;
  token: string;
  amount: string;
  price: string;
  status: TradeStatus;
  seller: string;
  buyer: string;
  createdAt: string;
  paymentMethod: string;
}

export default function Trades() {
  const { address, isConnected } = useAccount();
  const { trades, handleLockTrade, handleCompleteTrade, handleCancelTrade, handleDisputeTrade } = useP2PExchange();
  const [selectedTrade, setSelectedTrade] = useState<number | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Connect Wallet to View Trades</h1>
        <ConnectButton />
      </div>
    );
  }

  const handleAction = async (action: 'lock' | 'complete' | 'cancel' | 'dispute') => {
    if (selectedTrade === null) return;

    setIsLoading(true);
    try {
      switch (action) {
        case 'lock':
          await handleLockTrade(BigInt(selectedTrade));
          break;
        case 'complete':
          await handleCompleteTrade(BigInt(selectedTrade));
          break;
        case 'cancel':
          await handleCancelTrade(BigInt(selectedTrade));
          break;
        case 'dispute':
          await handleDisputeTrade(BigInt(selectedTrade));
          break;
      }
      toast.success(`Trade ${action}ed successfully!`);
      setIsActionModalOpen(false);
    } catch (error) {
      console.error(`Error ${action}ing trade:`, error);
      toast.error(`Failed to ${action} trade. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: TradeStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'LOCKED':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'DISPUTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort trades
  const filteredTrades = trades
    .filter(trade => {
      if (filter === 'all') return true;
      return trade.status.toLowerCase() === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? Number(a.createdAt) - Number(b.createdAt)
          : Number(b.createdAt) - Number(a.createdAt);
      } else {
        return sortOrder === 'asc'
          ? Number(a.amount) - Number(b.amount)
          : Number(b.amount) - Number(a.amount);
      }
    });

  return (
    <div className="min-h-screen bg-[#181A20] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">My Trades</h1>
          <div className="flex gap-4">
            <Link
              href="/p2p/create"
              className="px-4 py-2 bg-[#F0B90B] text-black rounded-lg font-semibold hover:bg-[#F0B90B]/90 transition-colors"
          >
            Create New Trade
            </Link>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-[#23262F] rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-[#F0B90B] text-black' : 'bg-[#181A20] text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg ${filter === 'active' ? 'bg-[#F0B90B] text-black' : 'bg-[#181A20] text-white'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg ${filter === 'completed' ? 'bg-[#F0B90B] text-black' : 'bg-[#181A20] text-white'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-3 py-1 rounded-lg ${filter === 'cancelled' ? 'bg-[#F0B90B] text-black' : 'bg-[#181A20] text-white'}`}
              >
                Cancelled
              </button>
            </div>
            <div className="flex gap-2 ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="bg-[#181A20] text-white px-3 py-1 rounded-lg"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-[#181A20] text-white px-3 py-1 rounded-lg"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
            </div>
          </div>
        </div>

        {/* Trades List */}
        <div className="space-y-4">
          {filteredTrades.length > 0 ? (
            filteredTrades.map((trade, index) => (
            <div
              key={index}
                className="bg-[#23262F] rounded-xl p-6 border border-[#333] hover:border-[#F0B90B] transition-colors"
            >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(Number(trade.createdAt)).toLocaleDateString()}
                    </span>
                  </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <p className="text-gray-400 text-sm">Token</p>
                        <p className="font-semibold">{trade.token}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Amount</p>
                        <p className="font-semibold">{formatEther(BigInt(trade.amount))}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Price</p>
                        <p className="font-semibold">{formatEther(BigInt(trade.price))}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Type</p>
                        <p className="font-semibold">
                          {trade.seller === address ? 'Sell' : 'Buy'}
                      </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                  {trade.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedTrade(index);
                          handleAction('lock');
                        }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        disabled={isLoading}
                      >
                        Lock
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTrade(index);
                          handleAction('cancel');
                        }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {trade.status === 'LOCKED' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedTrade(index);
                          handleAction('complete');
                        }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        disabled={isLoading}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTrade(index);
                          handleAction('dispute');
                        }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        Dispute
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#23262F] rounded-xl">
              <p className="text-gray-400 text-lg mb-4">No trades found</p>
              <Link
                href="/p2p/create"
                className="inline-block px-6 py-2 bg-[#F0B90B] text-black rounded-lg font-semibold hover:bg-[#F0B90B]/90 transition-colors"
              >
                Create Your First Trade
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 