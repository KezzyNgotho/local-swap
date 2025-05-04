"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import Chat from '../../../../components/Chat';

// Add MinPay status types
type MinPayStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface TradeDetails {
  id: string;
  seller: string;
  buyer: string;
  asset: string;
  amount: string;
  price: string;
  fiatCurrency: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentDetails: string;
  createdAt: number;
  minPayDetails?: {
    status: MinPayStatus;
    transactionId?: string;
    processingTime?: string;
    estimatedCompletion?: number;
  };
}

export default function TradePage() {
  const params = useParams();
  const { address } = useAccount();
  const [trade, setTrade] = useState<TradeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock trade data for demo
  useEffect(() => {
    const mockTrade: TradeDetails = {
      id: params.id as string,
      seller: '0x1234567890abcdef1234567890abcdef12345678',
      buyer: '0xabcdef1234567890abcdef1234567890abcdef12',
      asset: 'USDT',
      amount: '100',
      price: '1.02',
      fiatCurrency: 'USD',
      status: 'active',
      paymentMethod: 'MiniPay',
      paymentDetails: 'MiniPay ID: MP123456789',
      createdAt: Date.now() - 3600000,
      minPayDetails: {
        status: 'processing',
        transactionId: 'MP-TX-123456',
        processingTime: '1-2 minutes',
        estimatedCompletion: Date.now() + 120000 // 2 minutes from now
      }
    };
    setTrade(mockTrade);
    setIsLoading(false);
  }, [params.id]);

  const getMinPayStatusColor = (status: MinPayStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTimeRemaining = (estimatedCompletion: number) => {
    const remaining = Math.max(0, estimatedCompletion - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Trade Not Found</h2>
          <p className="mt-2 text-gray-600">The trade you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isUserBuyer = address?.toLowerCase() === trade.buyer.toLowerCase();
  const isUserSeller = address?.toLowerCase() === trade.seller.toLowerCase();
  const counterparty = isUserBuyer ? trade.seller : trade.buyer;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trade Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Trade Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      trade.status === 'active' ? 'bg-green-100 text-green-800' :
                      trade.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      trade.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* MinPay Status Section */}
                {trade.minPayDetails && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-3">MinPay Transaction</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-blue-800">Status</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          getMinPayStatusColor(trade.minPayDetails.status)
                        }`}>
                          {trade.minPayDetails.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-sm text-blue-800">Transaction ID</p>
                        <p className="text-sm font-mono mt-1">{trade.minPayDetails.transactionId}</p>
                      </div>

                      {trade.minPayDetails.status === 'processing' && trade.minPayDetails.estimatedCompletion && (
                        <div>
                          <p className="text-sm text-blue-800">Estimated Completion</p>
                          <p className="text-sm font-medium mt-1">
                            {getTimeRemaining(trade.minPayDetails.estimatedCompletion)}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-blue-800">Processing Time</p>
                        <p className="text-sm mt-1">{trade.minPayDetails.processingTime}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Trade Amount</p>
                  <p className="mt-1 font-medium">
                    {trade.amount} {trade.asset}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="mt-1 font-medium">
                    {trade.price} {trade.fiatCurrency}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="mt-1 font-medium">
                    {(parseFloat(trade.amount) * parseFloat(trade.price)).toFixed(2)} {trade.fiatCurrency}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                      💳 {trade.paymentMethod}
                    </span>
                  </div>
                </div>

                {(isUserBuyer || isUserSeller) && (
                  <div>
                    <p className="text-sm text-gray-500">Payment Details</p>
                    <pre className="mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg text-sm font-mono">
                      {trade.paymentDetails}
                    </pre>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="mt-1 text-sm">
                    {new Date(trade.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Security Tips</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">🔒</span>
                      <span>Verify MinPay transaction ID before confirming</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">⚠️</span>
                      <span>Only release funds after MinPay confirmation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">⏱️</span>
                      <span>Wait for MinPay processing to complete</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2 h-[800px]">
            <Chat tradeId={trade.id} counterparty={counterparty} />
          </div>
        </div>
      </div>
    </div>
  );
} 