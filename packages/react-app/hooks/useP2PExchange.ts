import { useCallback, useEffect, useState } from 'react';
import { 
  useContractRead, 
  useContractWrite, 
  useAccount, 
  usePublicClient, 
  type BaseError,
  Address as WagmiAddress
} from 'wagmi';
import { type Address, parseEther, formatEther, ContractFunctionExecutionError } from 'viem';
import { toast } from 'sonner';
import P2PEscrowABI from '../contracts/P2PEscrow.json';
import contractAddresses from '../contracts/addresses.json';

const P2P_EXCHANGE_ADDRESS = contractAddresses.P2PEscrow as Address;

// Define contract config with proper typing for wagmi v2
const contractConfig = {
  address: P2P_EXCHANGE_ADDRESS,
  abi: P2PEscrowABI,
} as const;

export type TradeStatus = 'ACTIVE' | 'LOCKED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export type Trade = {
  seller: string;
  buyer: string;
  token: string;
  amount: bigint;
  price: bigint;
  paymentMethod: string;
  paymentDetails: string;
  createdAt: bigint;
  status: TradeStatus;
};

export function useP2PExchange() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState({
    create: false,
    lock: false,
    complete: false,
    cancel: false,
    dispute: false
  });

  // Contract reads
  const { data: tradeCount } = useContractRead({
    ...contractConfig,
    functionName: 'tradeCount',
  });

  const { data: escrowFee } = useContractRead({
    ...contractConfig,
    functionName: 'escrowFee',
  });

  // Fetch trade details
  useEffect(() => {
    if (!tradeCount || !publicClient) return;

    const fetchTrades = async () => {
      const trades = [];
      for (let i = 0; i < Number(tradeCount); i++) {
        try {
          const trade = await publicClient.readContract({
            address: P2P_EXCHANGE_ADDRESS,
            abi: P2PEscrowABI,
            functionName: 'getTrade',
            args: [BigInt(i)],
          });
          trades.push(trade as Trade);
        } catch (error) {
          console.error(`Error fetching trade ${i}:`, error);
        }
      }
      setTrades(trades);
    };

    fetchTrades();
  }, [tradeCount, publicClient]);

  // Contract writes with proper wagmi v2 configuration
  const { writeAsync: createTradeAsync } = useContractWrite({
    address: P2P_EXCHANGE_ADDRESS,
    abi: P2PEscrowABI,
    functionName: 'createTrade'
  });

  const { writeAsync: lockTradeAsync } = useContractWrite({
    address: P2P_EXCHANGE_ADDRESS,
    abi: P2PEscrowABI,
    functionName: 'lockTrade'
  });

  const { writeAsync: completeTradeAsync } = useContractWrite({
    address: P2P_EXCHANGE_ADDRESS,
    abi: P2PEscrowABI,
    functionName: 'completeTrade'
  });

  const { writeAsync: cancelTradeAsync } = useContractWrite({
    address: P2P_EXCHANGE_ADDRESS,
    abi: P2PEscrowABI,
    functionName: 'cancelTrade'
  });

  const { writeAsync: disputeTradeAsync } = useContractWrite({
    address: P2P_EXCHANGE_ADDRESS,
    abi: P2PEscrowABI,
    functionName: 'disputeTrade'
  });

  // Helper functions with proper error handling and transaction monitoring
  const handleCreateTrade = useCallback(
    async (
      token: string,
      amount: string,
      price: string,
      paymentMethod: string,
      paymentDetails: string,
      isMinPay: boolean
    ) => {
      if (!address) throw new Error('Wallet not connected');
      if (!publicClient) throw new Error('Public client not available');
      if (!createTradeAsync) throw new Error('Contract write not initialized');

      try {
        setIsLoading(prev => ({ ...prev, create: true }));
        
        const args = [
          token as `0x${string}`,
          parseEther(amount),
          parseEther(price),
          paymentMethod,
          paymentDetails,
          isMinPay,
        ] as const;

        const tx = await createTradeAsync({ args });
        
        if (tx?.hash) {
          await publicClient.waitForTransactionReceipt({ hash: tx.hash });
          toast.success('Trade created successfully');
          return tx;
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.error('Create trade error:', error);
        const baseError = error as BaseError;
        const errorMessage = baseError.message || 'Failed to create trade';
        toast.error(`Error creating trade: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(prev => ({ ...prev, create: false }));
      }
    },
    [address, createTradeAsync, publicClient]
  );

  const handleLockTrade = useCallback(
    async (tradeId: bigint) => {
      if (!address) throw new Error('Wallet not connected');
      if (!publicClient) throw new Error('Public client not available');
      if (!lockTradeAsync) throw new Error('Contract write not initialized');

      try {
        setIsLoading(prev => ({ ...prev, lock: true }));
        
        const tx = await lockTradeAsync({
          args: [tradeId],
        });

        if (tx?.hash) {
          await publicClient.waitForTransactionReceipt({ hash: tx.hash });
          toast.success('Trade locked successfully');
          return tx;
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.error('Lock trade error:', error);
        const baseError = error as BaseError;
        const errorMessage = baseError.message || 'Failed to lock trade';
        toast.error(`Error locking trade: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(prev => ({ ...prev, lock: false }));
      }
    },
    [address, lockTradeAsync, publicClient]
  );

  const handleCompleteTrade = useCallback(
    async (tradeId: bigint) => {
      if (!address) throw new Error('Wallet not connected');
      if (!publicClient) throw new Error('Public client not available');
      if (!completeTradeAsync) throw new Error('Contract write not initialized');

      try {
        setIsLoading(prev => ({ ...prev, complete: true }));
        
        const tx = await completeTradeAsync({
          args: [tradeId],
        });

        if (tx?.hash) {
          await publicClient.waitForTransactionReceipt({ hash: tx.hash });
          toast.success('Trade completed successfully');
          return tx;
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.error('Complete trade error:', error);
        const baseError = error as BaseError;
        const errorMessage = baseError.message || 'Failed to complete trade';
        toast.error(`Error completing trade: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(prev => ({ ...prev, complete: false }));
      }
    },
    [address, completeTradeAsync, publicClient]
  );

  const handleCancelTrade = useCallback(
    async (tradeId: bigint) => {
      if (!address) throw new Error('Wallet not connected');
      if (!publicClient) throw new Error('Public client not available');
      if (!cancelTradeAsync) throw new Error('Contract write not initialized');

      try {
        setIsLoading(prev => ({ ...prev, cancel: true }));
        
        const tx = await cancelTradeAsync({
          args: [tradeId],
        });

        if (tx?.hash) {
          await publicClient.waitForTransactionReceipt({ hash: tx.hash });
          toast.success('Trade cancelled successfully');
          return tx;
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.error('Cancel trade error:', error);
        const baseError = error as BaseError;
        const errorMessage = baseError.message || 'Failed to cancel trade';
        toast.error(`Error cancelling trade: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(prev => ({ ...prev, cancel: false }));
      }
    },
    [address, cancelTradeAsync, publicClient]
  );

  const handleDisputeTrade = useCallback(
    async (tradeId: bigint) => {
      if (!address) throw new Error('Wallet not connected');
      if (!publicClient) throw new Error('Public client not available');
      if (!disputeTradeAsync) throw new Error('Contract write not initialized');

      try {
        setIsLoading(prev => ({ ...prev, dispute: true }));
        
        const tx = await disputeTradeAsync({
          args: [tradeId],
        });

        if (tx?.hash) {
          await publicClient.waitForTransactionReceipt({ hash: tx.hash });
          toast.success('Trade disputed successfully');
          return tx;
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.error('Dispute trade error:', error);
        const baseError = error as BaseError;
        const errorMessage = baseError.message || 'Failed to dispute trade';
        toast.error(`Error disputing trade: ${errorMessage}`);
        throw error;
      } finally {
        setIsLoading(prev => ({ ...prev, dispute: false }));
      }
    },
    [address, disputeTradeAsync, publicClient]
  );

  return {
    trades,
    tradeCount,
    escrowFee,
    handleCreateTrade,
    handleLockTrade,
    handleCompleteTrade,
    handleCancelTrade,
    handleDisputeTrade,
    isLoading,
  };
} 