"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useP2PExchange } from '../../hooks/useP2PExchange';
import { toast } from 'sonner';
import FilterModal from '../components/FilterModal';

const currencies = [
  { symbol: 'USDT', name: 'Tether USD', icon: '₮', chart: '↗' },
  { symbol: 'BUSD', name: 'Binance USD', icon: '₿', chart: '→' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', chart: '↗' },
  { symbol: 'cUSD', name: 'Celo Dollar', icon: '🟡', chart: '↗' },
  { symbol: 'cEUR', name: 'Celo Euro', icon: '💶', chart: '↘' },
  { symbol: 'DAI', name: 'Dai', icon: '◉', chart: '→' },
  { symbol: 'TUSD', name: 'TrueUSD', icon: 'Ⓣ', chart: '→' },
  { symbol: 'USDP', name: 'Pax Dollar', icon: '🅿️', chart: '→' },
  { symbol: 'GUSD', name: 'Gemini Dollar', icon: '🟦', chart: '→' },
  { symbol: 'cREAL', name: 'Celo Real', icon: '🇧🇷', chart: '→' },
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

// Helper for payment method styles and icons
const paymentMethodStyles: Record<string, { bg: string; text: string; icon: string }> = {
  minipay: {
    bg: 'bg-green-600/20',
    text: 'text-green-500',
    icon: '💳',
  },
  bank_transfer: {
    bg: 'bg-blue-600/20',
    text: 'text-blue-500',
    icon: '🏦',
  },
  mobile_money: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-500',
    icon: '📱',
  },
  default: {
    bg: 'bg-gray-600/20',
    text: 'text-gray-300',
    icon: '💰',
  },
};

export default function P2PMarket() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { trades, refetch } = useP2PExchange();
  
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [amountFilter, setAmountFilter] = useState('');
  const [fiatCurrency, setFiatCurrency] = useState('USD');

  // Filter state
  const [amount, setAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [saveFilter, setSaveFilter] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [tradedWith, setTradedWith] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleTradeAction = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet to trade');
      return;
    }
    // Handle trade action
  };

  // Filtering logic
  const filteredTrades = trades
    .filter((trade, idx) =>
      (!selectedCurrency || trade.token === selectedCurrency.symbol) &&
      (!amount || Number(trade.amount) >= Number(amount)) &&
      (!selectedPayment || trade.paymentMethod === selectedPayment) &&
      (!verifiedOnly || idx % 3 === 0) && // mock: every 3rd trade is verified
      (!tradedWith || idx % 4 === 0) && // mock: every 4th trade is tradedWith
      (!followed || idx % 5 === 0) // mock: every 5th trade is followed
    )
    .sort((a, b) => {
      if (sortBy === 'price') return Number(a.price) - Number(b.price);
      if (sortBy === 'completed') return Number(b.amount) - Number(a.amount); // mock: use amount as completed order number
      return 0;
    });

  if (!isConnected) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
      {/* Top Row: Buy/Sell, Reload, Filter */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex gap-1">
          {['BUY', 'SELL'].map((type) => (
            <button
              key={type}
              onClick={() => setTradeType(type as 'BUY' | 'SELL')}
              className={`px-3 sm:px-8 py-1.5 sm:py-2 rounded-full text-xs sm:text-base font-semibold transition-all border-2 focus:outline-none
                ${tradeType === type
                  ? 'bg-[#23262F] border-[#F0B90B] text-[#F0B90B] shadow'
                  : 'bg-[#181A20] border-[#23262F] text-white hover:bg-[#23262F] hover:text-[#F0B90B]'}
              `}
            >
              {type === 'BUY' ? 'Buy' : 'Sell'}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            className="p-2 rounded-full bg-[#23262F] border border-[#333] hover:bg-[#181A20] text-[#F0B90B] text-lg"
            onClick={() => refetch && refetch()}
            title="Reload"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5 9A7.003 7.003 0 0112 5c1.657 0 3.156.576 4.354 1.536M19 15a7.003 7.003 0 01-7 4c-1.657 0-3.156-.576-4.354-1.536" /></svg>
          </button>
          <button
            className="p-2 rounded-full bg-[#23262F] border border-[#333] hover:bg-[#181A20] text-[#F0B90B] text-lg"
            onClick={() => setShowFilterModal(true)}
            title="Filter"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" /></svg>
          </button>
        </div>
      </div>
      {/* Second Row: Currency and Amount */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {/* Left: Currencies Dropdown */}
        <div className="w-1/2">
          <select
            title="Currency"
            value={selectedCurrency.symbol}
            onChange={e => setSelectedCurrency(currencies.find(c => c.symbol === e.target.value) || currencies[0])}
            className="w-full px-4 py-2 rounded-full bg-[#23262F] text-white focus:outline-none border border-[#333] text-xs sm:text-base"
          >
            {currencies.map(currency => (
              <option key={currency.symbol} value={currency.symbol}>{currency.symbol}</option>
            ))}
          </select>
        </div>
        {/* Right: Amount and Fiat Dropdown */}
        <div className="flex items-center gap-2 w-1/2 justify-end">
          <input
            type="number"
            placeholder="Amount"
            className="bg-[#23262F] text-white w-20 px-2 py-2 rounded-full focus:outline-none border border-[#333] text-xs sm:text-sm"
            onChange={e => setAmount(e.target.value)}
            value={amount}
          />
          <select
            className="bg-[#23262F] text-white rounded-full px-3 py-2 focus:outline-none border border-[#333] text-xs sm:text-sm"
            value={fiatCurrency}
            onChange={e => setFiatCurrency(e.target.value)}
          >
            <option value="KES">KES</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
      {/* Trade List (responsive grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade, idx) => (
            <div
              key={idx}
              className="bg-[#23262F] rounded-xl p-5 sm:p-7 flex flex-col gap-4 shadow-lg border border-[#333] transition hover:scale-[1.01] hover:border-[#F0B90B] relative"
            >
              {/* Promoted badge for first trade */}
              {idx === 0 && (
                <span className="absolute -top-3 left-4 bg-[#F0B90B] text-black text-xs font-bold px-3 py-1 rounded-b-xl shadow">Promoted</span>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F0B90B] flex items-center justify-center text-black font-bold text-lg">
                  {trade.seller.slice(2, 3).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white text-base">{trade.seller.slice(0, 6)}...{trade.seller.slice(-4)}</div>
                  <div className="text-xs text-gray-400">Seller</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <div className="text-xs text-gray-400">Amount</div>
                  <div className="font-bold text-lg text-white">{Number(trade.amount).toLocaleString()} {selectedCurrency.symbol}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Price</div>
                  <div className="font-bold text-lg text-[#F0B90B]">{Number(trade.price).toLocaleString()} {fiatCurrency}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Payment</div>
                  <div className="flex flex-wrap gap-2">
                    {trade.paymentMethod.split(',').map((method, i) => {
                      const style = paymentMethodStyles[method] || paymentMethodStyles.default;
                      const label = paymentMethods.find(pm => pm.id === method)?.name || method;
                      return (
                        <span
                          key={i}
                          className={`flex items-center gap-1 px-4 py-2 rounded-full font-bold text-sm ${style.bg} ${style.text} shadow`}
                          style={{ minWidth: '110px', justifyContent: 'center' }}
                        >
                          <span className="text-lg">{style.icon}</span>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Created</div>
                  <div className="font-medium text-white">{new Date(Number(trade.createdAt)).toLocaleString()}</div>
                </div>
              </div>
              <button
                onClick={handleTradeAction}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#16C784] text-white font-bold text-lg flex items-center justify-center gap-2 shadow hover:bg-[#13a06b] transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {isConnected ? (
                  trade.seller.toLowerCase() === address?.toLowerCase() ? 'Sell' : `Buy ${selectedCurrency.symbol}`
                ) : (
                  'Connect Wallet'
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="bg-[#23262F] rounded-lg p-8 text-center text-white col-span-1 sm:col-span-2">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No trades found</h3>
            <p className="text-gray-400">
              {isConnected ? (
                'Be the first to create a trade!'
              ) : (
                'Connect your wallet to start trading'
              )}
            </p>
          </div>
        )}
      </div>
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        paymentMethods={paymentMethods}
        selectedPayment={selectedPayment}
        onPaymentChange={setSelectedPayment}
        saveFilter={saveFilter}
        onSaveFilterChange={setSaveFilter}
        verifiedOnly={verifiedOnly}
        onVerifiedChange={setVerifiedOnly}
        tradedWith={tradedWith}
        onTradedWithChange={setTradedWith}
        followed={followed}
        onFollowedChange={setFollowed}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={() => {
          setSelectedPayment('');
          setSaveFilter(false);
          setVerifiedOnly(false);
          setTradedWith(false);
          setFollowed(false);
          setSortBy('price');
        }}
        onApply={() => setShowFilterModal(false)}
      />
    </div>
  );
} 