import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoadingScreen() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/p2p');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        {/* Spinning Logo */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 animate-spin-slow">
            <div className="w-full h-full rounded-full border-4 border-[#F0B90B] border-t-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-[#F0B90B]">P2P</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to P2P Trading</h1>
          <p className="text-gray-600">Connect your wallet to start trading</p>
        </div>

        {/* Connect Button */}
        <div className="mt-8">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
} 