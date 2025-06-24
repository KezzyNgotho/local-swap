"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/p2p');
    }
  }, [isConnected, router]);

  return <LoadingScreen />;
}
