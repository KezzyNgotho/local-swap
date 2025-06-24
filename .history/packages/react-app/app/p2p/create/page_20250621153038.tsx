"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useP2PExchange } from '../../../hooks/useP2PExchange';
import { toast } from 'sonner';
import { parseEther } from 'viem';

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
  { id: 'all', name: 'All', icon: '🌐' },
  { id: 'minipay', name: 'MiniPay', icon: '💳' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'mobile_money', name: 'Mobile Money', icon: '📱' },
  { id: 'physical', name: 'Physical', icon: '🤝' },
];

export default function CreateTrade() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { handleCreateTrade } = useP2PExchange();
  const [step, setStep] = useState(1);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [enableCharity, setEnableCharity] = useState(false);
  const [charityAmount, setCharityAmount] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('Enter a valid price');
      return;
    }
    if (selectedPaymentMethods.length === 0) {
      toast.error('Select at least one payment method');
      return;
    }
    if (enableCharity && (!charityAmount || isNaN(Number(charityAmount)) || Number(charityAmount) < 0)) {
      toast.error('Enter a valid charity amount');
      return;
    }

    setIsLoading(true);
    try {
      const totalAmount = enableCharity 
        ? (Number(amount) + Number(charityAmount)).toString()
        : amount;

      await handleCreateTrade(
        selectedCurrency.address,
        parseEther(totalAmount).toString(),
        parseEther(price).toString(),
        selectedPaymentMethods.join(','),
        enableCharity ? parseEther(charityAmount).toString() : parseEther('0').toString(),
        false
      );

      toast.success('Trade created successfully!');
      router.push('/p2p/trades');
    } catch (error) {
      console.error('Error creating trade:', error);
      toast.error('Failed to create trade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#181A20] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Connect Wallet to Create Trade</h1>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181A20] text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                stepNumber === step ? 'bg-[#F0B90B] text-black border-[#F0B90B]' : 'bg-[#23262F] text-white border-[#333]'
              }`}>
                {stepNumber}
              </div>
              <div className={`mt-2 text-xs ${stepNumber === step ? 'text-[#F0B90B]' : 'text-gray-400'}`}>
                {stepNumber === 1 ? 'Set Type & Price' : stepNumber === 2 ? 'Details' : 'Preview'}
              </div>
            </div>
          ))}
        </div>

        <form id="create-trade-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Buy/Sell Toggle */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setTradeType('BUY')}
              className={`flex-1 py-3 rounded-xl text-lg font-bold border-2 transition-all focus:outline-none
                ${tradeType === 'BUY' ? 'bg-[#F0B90B] border-[#F0B90B] text-black shadow' : 'bg-[#23262F] border-[#23262F] text-white hover:border-[#F0B90B] hover:text-[#F0B90B]'}`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setTradeType('SELL')}
              className={`flex-1 py-3 rounded-xl text-lg font-bold border-2 transition-all focus:outline-none
                ${tradeType === 'SELL' ? 'bg-[#F0B90B] border-[#F0B90B] text-black shadow' : 'bg-[#23262F] border-[#23262F] text-white hover:border-[#F0B90B] hover:text-[#F0B90B]'}`}
            >
              Sell
            </button>
          </div>

          {/* Currency Selection */}
          <div className="bg-[#23262F] rounded-xl p-4 border border-[#333]">
            <label className="block text-sm text-gray-400 mb-2">Select Currency</label>
            <select
              title="Currency"
              value={selectedCurrency.symbol}
              onChange={e => {
                const currency = currencies.find(c => c.symbol === e.target.value);
                if (currency) setSelectedCurrency(currency);
              }}
              className="w-full bg-[#181A20] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-[#F0B90B] focus:outline-none text-base font-semibold appearance-none"
            >
              {currencies.map(currency => (
                <option key={currency.symbol} value={currency.symbol} className="bg-[#23262F] text-white">
                  {currency.symbol} – {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount and Price */}
          <div className="bg-[#23262F] rounded-xl p-4 border border-[#333]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#181A20] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-[#F0B90B] focus:outline-none"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="absolute right-4 top-2 text-gray-400">{selectedCurrency.symbol}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price per {selectedCurrency.symbol}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#181A20] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-[#F0B90B] focus:outline-none"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="absolute right-4 top-2 text-gray-400">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-[#23262F] rounded-xl p-4 border border-[#333]">
            <label className="block text-sm text-gray-400 mb-2">Payment Methods</label>
            <select
              
              multiple
              value={selectedPaymentMethods}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setSelectedPaymentMethods(options);
              }}
              className="w-full bg-[#181A20] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-[#F0B90B] focus:outline-none text-base font-semibold appearance-none h-32"
            >
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id} className="bg-[#23262F] text-white">
                  {method.icon} {method.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-2">Hold Ctrl (Windows) or Cmd (Mac) to select multiple methods.</p>
          </div>

          {/* Charity Round-up Section */}
          <div className="bg-[#23262F] rounded-xl p-4 border border-[#333]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Charity Round-up</h3>
                <p className="text-sm text-gray-400">Round up your trade amount and donate to charity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enableCharity}
                  onChange={(e) => setEnableCharity(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[#F0B90B]"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
            
            {enableCharity && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Donation Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={charityAmount}
                      onChange={(e) => setCharityAmount(e.target.value)}
                      className="w-full bg-[#181A20] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-[#F0B90B] focus:outline-none"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute right-4 top-2 text-gray-400">{selectedCurrency.symbol}</span>
                  </div>
                </div>
                <div className="bg-[#181A20] rounded-lg p-3">
                  <p className="text-sm text-gray-400">Total Amount (including donation)</p>
                  <p className="text-lg font-semibold">
                    {(Number(amount) + Number(charityAmount)).toFixed(2)} {selectedCurrency.symbol}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#F0B90B] text-black font-bold text-lg shadow hover:bg-yellow-400 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Trade...' : 'Create Trade'}
          </button>
        </form>
      </div>
    </div>
  );
} 