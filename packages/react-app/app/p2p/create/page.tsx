"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useContractWrite, type BaseError } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useP2PExchange } from '../../../hooks/useP2PExchange';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { erc20Abi } from 'viem';
import P2PEscrowABI from '../../../contracts/P2PEscrow.json';

const P2P_ESCROW_ADDRESS = process.env.NEXT_PUBLIC_P2P_ESCROW_ADDRESS;

const currencies = [
  { symbol: 'USDT', address: '0x4cA2A3EE452CE28E64aE945E371A9f52105D82C5', name: 'Tether USD', icon: '₮' },
  { symbol: 'BUSD', address: '0x4B21b980d0Dc7D3C0C6175B3A192acF80dBB32A1', name: 'Binance USD', icon: '₿' },
  { symbol: 'USDC', address: '0x2F25deB3848C207fc8E0c8527cD1CDF4106EF15A', name: 'USD Coin', icon: '$' },
  { symbol: 'cUSD', address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', name: 'Celo Dollar', icon: '$' },
  { symbol: 'cEUR', address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F', name: 'Celo Euro', icon: '€' },
  { symbol: 'WBTC', address: '0xF19A2a979B7cC001E8BE2A9d57D8cC7e7C5Ea2f9', name: 'Bitcoin BTC', icon: '₿' },
  { symbol: 'WETH', address: '0x2D69B9830c2ABc29C1EBa9D47eB213DbBF50a9ed', name: 'Ethereum ETH', icon: 'Ξ' },
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
  },
  { 
    id: 'paypal',
    name: 'PayPal',
    icon: '💰',
    requiresDetails: true,
    placeholder: 'PayPal Email',
    processingTime: '10-30 mins'
  },
  {
    id: 'wise',
    name: 'Wise',
    icon: '🌐',
    requiresDetails: true,
    placeholder: 'Wise Email/Phone',
    processingTime: '10-30 mins'
  }
];

export default function CreateTrade() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { handleCreateTrade: createTradeFromContract } = useP2PExchange();
  
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('SELL');
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [paymentDetails, setPaymentDetails] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Token approval
  const { writeContract: approveToken, isPending: isApproving } = useContractWrite({
    mutation: {
      onSuccess: () => {
        toast.success('Token approved successfully!');
      },
      onError: (error) => {
        toast.error((error as BaseError).shortMessage || 'Failed to approve token');
      },
    },
    address: selectedCurrency.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'approve',
  });

  // Create trade
  const { writeContract: createTrade, isPending: isCreating } = useContractWrite({
    mutation: {
      onSuccess: () => {
        toast.success('Trade created successfully!');
        router.push('/p2p');
      },
      onError: (error) => {
        toast.error((error as BaseError).shortMessage || 'Failed to create trade');
      },
    },
    address: P2P_ESCROW_ADDRESS as `0x${string}`,
    abi: P2PEscrowABI.abi,
    functionName: 'createTrade',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!approveToken || !createTrade) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // First approve the token
      toast.loading('Approving token...');
      await approveToken({
        args: [P2P_ESCROW_ADDRESS as `0x${string}`, parseEther(amount || '0')]
      });
      
      // Then create the trade
      toast.loading('Creating trade...');
      await createTrade({
        args: [
          selectedCurrency.address,
          parseEther(amount || '0'),
          parseEther(price || '0'),
          selectedPaymentMethods.join(',')
        ]
      });
    } catch (error) {
      console.error('Error:', error);
      const baseError = error as BaseError;
      toast.error(baseError.shortMessage || 'Failed to create trade');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="fixed top-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-sm border-b z-50">
          <div className="flex justify-end max-w-7xl mx-auto">
            <ConnectButton />
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-xl shadow-lg text-center">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                P2P Trading Platform
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Buy and sell tokens securely with multiple payment methods
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-4xl">🔄</span>
                  <p className="text-base font-medium text-gray-800">Create Buy/Sell Orders</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-4xl">💳</span>
                  <p className="text-base font-medium text-gray-800">Multiple Payment Methods</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-4xl">🔒</span>
                  <p className="text-base font-medium text-gray-800">Secure Escrow System</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  const connectButton = document.querySelector('.connect-wallet-btn') as HTMLButtonElement | null;
                  connectButton?.click();
                }}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Connect Wallet to Start Trading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 animate-fade-in">
        <div className="card animate-slide-up">
          {/* Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Post New Advertisement</h1>
                <p className="mt-1 text-sm text-gray-500">Create a new P2P trading advertisement</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 hidden sm:inline">Connected:</span>
                <ConnectButton />
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-8">
            {/* Trade Type Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['SELL', 'BUY'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTradeType(type as 'SELL' | 'BUY')}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all hover-scale ${
                      tradeType === type
                        ? 'border-primary-DEFAULT bg-primary-light text-primary-DEFAULT'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-lg mr-2">{type === 'SELL' ? '💰' : '🛒'}</span>
                    <span className="font-medium">{type === 'SELL' ? 'Sell Crypto' : 'Buy Crypto'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Asset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currencies.map((currency) => (
                  <button
                    key={currency.symbol}
                    type="button"
                    onClick={() => setSelectedCurrency(currency)}
                    className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all hover-scale ${
                      selectedCurrency.symbol === currency.symbol
                        ? 'border-primary-DEFAULT bg-primary-light text-primary-DEFAULT'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2">{currency.icon}</span>
                      <span className="font-medium text-sm">{currency.symbol}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price and Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price per {selectedCurrency.symbol}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-DEFAULT transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">USD</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-DEFAULT transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    {selectedCurrency.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Order
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-DEFAULT transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">USD</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Order
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-DEFAULT transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">USD</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Methods
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      if (selectedPaymentMethods.includes(method.id)) {
                        setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== method.id));
                      } else {
                        setSelectedPaymentMethods([...selectedPaymentMethods, method.id]);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all hover-scale ${
                      selectedPaymentMethods.includes(method.id)
                        ? 'border-primary-DEFAULT bg-primary-light'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span className="text-2xl mb-2">{method.icon}</span>
                      <span className="font-medium text-sm text-gray-900">{method.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{method.processingTime}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Details
              </label>
              <textarea
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder="Enter your payment details and instructions for buyers/sellers"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-DEFAULT transition-all h-32 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading || isApproving}
                className={`btn btn-primary px-8 py-4 hover-scale ${
                  (isLoading || isApproving) ? 'loading' : ''
                }`}
              >
                {isApproving ? 'Approving Token...' : 
                 isLoading ? 'Creating Advertisement...' : 'Post Advertisement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 