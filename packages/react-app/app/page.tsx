"use client";

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-900">CeloSwap</div>
          <div className="flex items-center gap-4">
            <Link href="/p2p" 
              className="text-gray-600 hover:text-gray-900 transition-colors">
              Trade
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Peer-to-Peer Trading, <span className="text-blue-600">Simplified</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Trade Celo stablecoins securely with multiple payment options
            </p>
            <div className="flex justify-center gap-4">
              {!isConnected ? (
                <ConnectButton />
              ) : (
                <Link href="/p2p" 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Trading
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Secure Escrow',
                description: 'Smart contract protection for every trade',
                icon: '🔒'
              },
              {
                title: 'Multiple Payments',
                description: 'Bank, Mobile Money, MinPay & more',
                icon: '💳'
              },
              {
                title: 'Low Fees',
                description: 'Minimal fees, maximum value',
                icon: '💰'
              }
            ].map((feature) => (
              <div key={feature.title} 
                className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Connect',
                description: 'Link your Celo wallet'
              },
              {
                step: '02',
                title: 'Choose',
                description: 'Select payment method'
              },
              {
                step: '03',
                title: 'Trade',
                description: 'Create or accept offers'
              },
              {
                step: '04',
                title: 'Complete',
                description: 'Finalize securely'
              }
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="text-sm font-mono text-blue-600 mb-2">{step.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to trade?
            </h2>
            <p className="text-gray-600">
              Join the secure P2P trading platform for Celo stablecoins
            </p>
            {!isConnected ? (
              <ConnectButton />
            ) : (
              <Link href="/p2p/create"
                className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                Create Trade
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
