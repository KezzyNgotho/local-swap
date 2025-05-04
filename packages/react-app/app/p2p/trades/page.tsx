"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useP2PExchange } from '../../../hooks/useP2PExchange';
import { toast } from 'sonner';
import { formatEther } from 'viem';

export default function Trades() {
  const { address, isConnected } = useAccount();
  const { trades, handleLockTrade, handleCompleteTrade, handleCancelTrade, handleDisputeTrade } = useP2PExchange();
  const [selectedTrade, setSelectedTrade] = useState<number | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const getStatusColor = (status: string) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Trades</h1>
          <button
            onClick={() => window.location.href = '/p2p/create'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Trade
          </button>
        </div>

        {/* Trades List */}
        <div className="grid gap-6">
          {trades.map((trade, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ID: {index}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">{formatEther(trade.amount)} tokens</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">{formatEther(trade.price)} tokens</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">{trade.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="font-medium">
                        {new Date(Number(trade.createdAt) * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {trade.paymentDetails && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Payment Details</p>
                      <p className="text-sm whitespace-pre-wrap">{trade.paymentDetails}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {trade.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedTrade(index);
                          handleAction('lock');
                        }}
                        className="flex-1 md:flex-none px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        disabled={isLoading}
                      >
                        Lock
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTrade(index);
                          handleAction('cancel');
                        }}
                        className="flex-1 md:flex-none px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
                        className="flex-1 md:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        disabled={isLoading}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTrade(index);
                          handleAction('dispute');
                        }}
                        className="flex-1 md:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        Dispute
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {trades.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No trades found</p>
              <button
                onClick={() => window.location.href = '/p2p/create'}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Trade
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 