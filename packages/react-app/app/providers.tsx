'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'ddc7fcf606c15032494d1f48f4252abf';

const config = getDefaultConfig({
  appName: 'P2P Trading Platform',
  projectId,
  chains: [celoAlfajores],
  transports: {
    [celoAlfajores.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 