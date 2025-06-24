'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { celoAlfajores } from '@wagmi/core/chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'ddc7fcf606c15032494d1f48f4252abf';

const connectors = connectorsForWallets({
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
  ],
  appName: 'P2P Trading Platform',
  projectId,
});

const { chains, publicClient } = configureChains(
  [celoAlfajores],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 