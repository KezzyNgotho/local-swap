"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useP2PExchange } from '../../hooks/useP2PExchange';
import { toast } from 'sonner';

type Trade = {
  id: string;
  type: 'BUY' | 'SELL';
  amount: string;
  currency: string;
  price: string;
  paymentMethods: string[];
  trader: string;
  completedTrades: number;
  rating: number;
  completion: number;
};

const currencies = [
  { symbol: 'USDT', name: 'Tether USD', icon: '₮', chart: '↗' },
  { symbol: 'BUSD', name: 'Binance USD', icon: '₿', chart: '→' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', chart: '↗' },
  { symbol: 'cUSD', name: 'Celo Dollar', icon: '$', chart: '↗' },
  { symbol: 'cEUR', name: 'Celo Euro', icon: '€', chart: '↘' },
];

const paymentMethods = [
  { 
    id: 'minipay',
    name: 'MiniPay',
    icon: '💳',
    processingTime: '1-2 mins',
    description: 'Instant payments via MiniPay'
  },
  { 
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: '🏦',
    processingTime: '10-15 mins',
    description: 'Traditional bank transfer'
  },
  { 
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: '📱',
    processingTime: '5-10 mins',
    description: 'M-PESA, MTN, etc.'
  }
];

export default function P2PMarket() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { trades } = useP2PExchange();
  
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [amountFilter, setAmountFilter] = useState('');
  const [fiatCurrency, setFiatCurrency] = useState('USD');

  const handleTradeAction = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet to trade');
      return;
    }
    // Handle trade action
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Landing Section */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            P2P Trading Platform
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Buy and sell crypto directly with other traders
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: '🔒', title: 'Secure Escrow', desc: 'Safe and secure trading with smart contract escrow' },
              { icon: '💸', title: 'Multiple Payment Methods', desc: 'Choose from various payment options' },
              { icon: '⚡', title: 'Fast Transactions', desc: 'Quick and efficient trading process' }
            ].map((feature) => (
              <div key={feature.title} className="card p-6 hover-lift">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">P2P Market</h2>
            <p className="text-sm text-gray-600 mt-1">Current market prices and available trades</p>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton />
            {isConnected && (
              <Link
                href="/p2p/create"
                className="btn btn-primary hover-scale"
              >
                Create Trade
              </Link>
            )}
          </div>
        </div>

        {/* Currency Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {currencies.map((currency) => (
            <button
              key={currency.symbol}
              onClick={() => setSelectedCurrency(currency)}
              className={`card p-4 hover-lift transition-all ${
                selectedCurrency.symbol === currency.symbol
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{currency.icon}</span>
                <span className="text-lg text-gray-600">{currency.chart}</span>
              </div>
              <div className="text-sm font-medium">{currency.symbol}</div>
              <div className="text-xs text-gray-500">{currency.name}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trade Type Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['BUY', 'SELL'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTradeType(type as 'BUY' | 'SELL')}
                    className={`p-3 text-sm rounded-xl border-2 transition-all hover-scale ${
                      tradeType === type
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select className="w-full p-3 text-sm border-2 rounded-xl focus:border-primary transition-all">
                <option value="">All Methods</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>

            {/* Amount Range */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Amount Range ({fiatCurrency})
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="p-3 text-sm border-2 rounded-xl focus:border-primary transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="p-3 text-sm border-2 rounded-xl focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Fiat Currency */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Fiat Currency
              </label>
              <select 
                value={fiatCurrency}
                onChange={(e) => setFiatCurrency(e.target.value)}
                className="w-full p-3 text-sm border-2 rounded-xl focus:border-primary transition-all"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trade List */}
        <div className="space-y-4">
          {trades.length > 0 ? (
            trades.map((trade) => (
              <div
                key={trade.id}
                className="card p-6 hover-lift animate-fade-in"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <div className={`font-medium ${trade.type === 'SELL' ? 'text-red-600' : 'text-green-600'}`}>
                      {trade.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-medium">{trade.amount} {trade.currency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-medium">{trade.price} {fiatCurrency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payment Methods</div>
                    <div className="font-medium">{trade.paymentMethods.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Trader Stats</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{trade.rating.toFixed(1)}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{trade.completedTrades} trades</span>
                    </div>
                    <div className="text-xs text-gray-500">{trade.completion}% completion</div>
                  </div>
                  <div>
                    <button
                      onClick={handleTradeAction}
                      className="btn btn-primary w-full hover-scale"
                    >
                      {isConnected ? (
                        trade.type === 'SELL' ? 'Buy Now' : 'Sell Now'
                      ) : (
                        'Connect Wallet'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-8 text-center animate-fade-in">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trades found</h3>
              <p className="text-gray-600">
                {isConnected ? (
                  'Be the first to create a trade!'
                ) : (
                  'Connect your wallet to start trading'
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 