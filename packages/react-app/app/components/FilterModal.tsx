import React from 'react';

export default function FilterModal({
  open,
  onClose,
  paymentMethods = [],
  selectedPayment = '',
  onPaymentChange,
  saveFilter = false,
  onSaveFilterChange,
  verifiedOnly = false,
  onVerifiedChange,
  tradedWith = false,
  onTradedWithChange,
  followed = false,
  onFollowedChange,
  sortBy = 'price',
  onSortByChange,
  onReset,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  paymentMethods?: { id: string; name: string }[];
  selectedPayment?: string;
  onPaymentChange?: (val: string) => void;
  saveFilter?: boolean;
  onSaveFilterChange?: (val: boolean) => void;
  verifiedOnly?: boolean;
  onVerifiedChange?: (val: boolean) => void;
  tradedWith?: boolean;
  onTradedWithChange?: (val: boolean) => void;
  followed?: boolean;
  onFollowedChange?: (val: boolean) => void;
  sortBy?: string;
  onSortByChange?: (val: string) => void;
  onReset?: () => void;
  onApply?: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-[#23262F] w-full sm:w-[380px] max-w-full rounded-t-2xl sm:rounded-2xl shadow-lg p-6 flex flex-col max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">More Filters</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">×</button>
        </div>
        {/* Payment Methods */}
        <div className="mb-6">
          <label className="block text-xs text-gray-400 mb-1">Payment Methods</label>
          <select
            className="w-full px-4 py-2 rounded-xl bg-[#181A20] text-white focus:outline-none border border-[#333]"
            value={selectedPayment}
            onChange={e => onPaymentChange?.(e.target.value)}
          >
            <option value="">All payments</option>
            {paymentMethods.map(pm => (
              <option key={pm.id} value={pm.id}>{pm.name}</option>
            ))}
          </select>
        </div>
        {/* Save filter switch */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-white">Save filter for next use <span className="text-gray-400 ml-1" title="Save your filter settings for next time.">i</span></span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={saveFilter} onChange={e => onSaveFilterChange?.(e.target.checked)} />
            <div className="w-10 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[#F0B90B] transition-all"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4"></div>
          </label>
        </div>
        {/* Ad Types */}
        <div className="mb-6">
          <div className="text-sm text-white mb-2">Ad Types</div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white">Verified Merchant Ads only <span className="text-gray-400 ml-1" title="Show only ads from verified merchants.">i</span></span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={verifiedOnly} onChange={e => onVerifiedChange?.(e.target.checked)} />
              <div className="w-10 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[#F0B90B] transition-all"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4"></div>
            </label>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white">Advertisers you've traded with <span className="text-gray-400 ml-1" title="Show only ads from advertisers you've traded with.">i</span></span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={tradedWith} onChange={e => onTradedWithChange?.(e.target.checked)} />
              <div className="w-10 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[#F0B90B] transition-all"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Advertisers you follow <span className="text-gray-400 ml-1" title="Show only ads from advertisers you follow.">i</span></span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={followed} onChange={e => onFollowedChange?.(e.target.checked)} />
              <div className="w-10 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[#F0B90B] transition-all"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4"></div>
            </label>
          </div>
        </div>
        {/* Sort By */}
        <div className="mb-8">
          <div className="text-sm text-white mb-2">Sort By</div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sortBy" value="price" checked={sortBy === 'price'} onChange={() => onSortByChange?.('price')} className="accent-[#F0B90B]" />
              <span className="text-white">Price</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sortBy" value="completed" checked={sortBy === 'completed'} onChange={() => onSortByChange?.('completed')} className="accent-[#F0B90B]" />
              <span className="text-white">Completed order number</span>
            </label>
          </div>
        </div>
        {/* Footer */}
        <div className="flex gap-3 mt-auto">
          <button onClick={onReset} className="flex-1 py-3 rounded-xl bg-[#23262F] text-white font-bold border border-[#333]">Reset</button>
          <button onClick={onApply} className="flex-1 py-3 rounded-xl bg-[#F0B90B] text-black font-bold">Apply</button>
        </div>
      </div>
    </div>
  );
} 