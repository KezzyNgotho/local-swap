import React from 'react';

export default function ProfileModal({
  open,
  onClose,
  address,
  trades = [],
  joinDate,
}: {
  open: boolean;
  onClose: () => void;
  address: string;
  trades: any[];
  joinDate?: Date;
}) {
  if (!open) return null;
  const completedTrades = trades.length;
  const rating = 4.8; // mock
  const accountAge = joinDate ? Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24)) : 120; // days
  const username = address ? `User${address.slice(2, 6)}` : 'User';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-[#23262F] w-full sm:w-[400px] max-w-full rounded-t-2xl sm:rounded-2xl shadow-lg p-6 flex flex-col max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">×</button>
        </div>
        {/* Avatar and Address */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#F0B90B] flex items-center justify-center text-black font-bold text-2xl mb-2">
            {address?.slice(2, 3).toUpperCase()}
          </div>
          <div className="font-bold text-white text-lg mb-1">{username}</div>
          <div className="font-mono text-xs text-gray-400 mb-1">{address}</div>
        </div>
        {/* Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center">
            <span className="text-yellow-400 text-xl font-bold flex items-center gap-1">★ {rating}</span>
            <span className="text-xs text-gray-400">Rating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl font-bold">{completedTrades}</span>
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl font-bold">{accountAge}d</span>
            <span className="text-xs text-gray-400">Account Age</span>
          </div>
        </div>
        {/* Transaction History */}
        <div>
          <div className="text-sm text-white font-bold mb-2">Transaction History</div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {trades.length === 0 ? (
              <div className="text-xs text-gray-400">No trades yet.</div>
            ) : (
              trades.map((trade, i) => (
                <div key={i} className="bg-[#181A20] rounded-lg px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs text-gray-400">{new Date(Number(trade.createdAt)).toLocaleDateString()}</span>
                    <span className="text-xs text-white font-bold">{trade.token}</span>
                    <span className="text-xs text-gray-400">{Number(trade.amount).toLocaleString()}</span>
                    <span className="text-xs text-gray-400">{trade.seller === address ? 'Sell' : 'Buy'}</span>
                  </div>
                  <span className="text-xs text-[#F0B90B] font-bold">{Number(trade.price).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 