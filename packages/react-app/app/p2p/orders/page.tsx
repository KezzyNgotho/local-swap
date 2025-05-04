"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Order = {
  id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  amount: string;
  price: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  counterparty?: string;
  date: string;
};

const sampleOrders: Order[] = [
  {
    id: '1',
    type: 'SELL',
    asset: 'cUSD',
    amount: '1000',
    price: '1.00',
    status: 'ACTIVE',
    date: '2024-03-10',
  },
  {
    id: '2',
    type: 'BUY',
    asset: 'cEUR',
    amount: '500',
    price: '1.08',
    status: 'COMPLETED',
    counterparty: '0x1234...5678',
    date: '2024-03-09',
  },
];

export default function MyOrders() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Connect Wallet to View Orders</h1>
        <ConnectButton />
      </div>
    );
  }

  const filteredOrders = sampleOrders.filter(order => 
    activeTab === 'ACTIVE' ? order.status === 'ACTIVE' : order.status === 'COMPLETED'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === 'ACTIVE'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Active Orders
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === 'COMPLETED'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Order History
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Asset</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              {activeTab === 'COMPLETED' && (
                <th className="p-4 text-left">Counterparty</th>
              )}
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-4">{order.date}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.type === 'BUY'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.type}
                  </span>
                </td>
                <td className="p-4">{order.asset}</td>
                <td className="p-4">{order.amount}</td>
                <td className="p-4">{order.price}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === 'ACTIVE'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                {activeTab === 'COMPLETED' && (
                  <td className="p-4">
                    <span className="text-sm font-mono">
                      {order.counterparty || 'N/A'}
                    </span>
                  </td>
                )}
                <td className="p-4">
                  {order.status === 'ACTIVE' ? (
                    <button
                      onClick={() => {
                        // TODO: Implement cancel order functionality
                        console.log('Cancel order:', order.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // TODO: Implement view details functionality
                        console.log('View details:', order.id);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 