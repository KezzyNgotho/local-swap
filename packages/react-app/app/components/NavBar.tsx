'use client';

import Link from 'next/link';
import { useAccount, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { useP2PExchange } from '../../hooks/useP2PExchange';
import ProfileModal from './ProfileModal';

export default function NavBar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [profileOpen, setProfileOpen] = useState(false);
  const { trades } = useP2PExchange();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <nav className="w-full bg-[#181A20] border-b border-[#222] text-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex flex-wrap items-center justify-between h-16 min-h-[4rem]">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold text-[#F0B90B]">P2P</span>
          <span className="text-base sm:text-lg font-semibold text-white hidden sm:inline">LocalSwap</span>
        </div>
        {/* Profile/Address */}
        <div className="relative">
          {isConnected ? (
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg bg-[#23262F] hover:bg-[#2C2F36] border border-[#222] focus:outline-none min-h-[2.5rem]"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F0B90B] flex items-center justify-center text-black font-bold text-base sm:text-lg">
                {address?.slice(2, 3).toUpperCase()}
              </span>
              <span className="font-mono text-xs sm:text-sm">{shortAddress}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          ) : (
            <Link href="/" className="px-3 py-2 bg-[#F0B90B] text-black rounded-lg font-semibold text-sm sm:text-base">Connect</Link>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        address={address || ''}
        trades={trades}
        joinDate={new Date('2024-01-01')} // Mock join date
      />
    </nav>
  );
} 