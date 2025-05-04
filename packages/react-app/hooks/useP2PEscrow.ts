import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
import { BigNumber } from 'ethers';
import P2PEscrowABI from '../contracts/P2PEscrow.json';

const P2P_ESCROW_ADDRESS = ''; // Add your deployed contract address here

export const useP2PEscrow = () => {
    const { toast } = useToast();

    // Read functions
    const { data: tradeCount } = useContractRead({
        address: P2P_ESCROW_ADDRESS,
        abi: P2PEscrowABI,
        functionName: 'tradeCount',
    });

    const { data: escrowFee } = useContractRead({
        address: P2P_ESCROW_ADDRESS,
        abi: P2PEscrowABI,
        functionName: 'escrowFee',
    });

    // Write functions
    const { data: createTradeData, write: createTrade } = useContractWrite({
        address: P2P_ESCROW_ADDRESS,
        abi: P2PEscrowABI,
        functionName: 'createTrade',
    });

    const { isLoading: isCreateTradeLoading } = useWaitForTransaction({
        hash: createTradeData?.hash,
        onSuccess() {
            toast({
                title: 'Trade Created',
                description: 'Your trade has been created successfully!',
            });
        },
        onError(error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const { data: lockTradeData, write: lockTrade } = useContractWrite({
        address: P2P_ESCROW_ADDRESS,
        abi: P2PEscrowABI,
        functionName: 'lockTrade',
    });

    const { isLoading: isLockTradeLoading } = useWaitForTransaction({
        hash: lockTradeData?.hash,
        onSuccess() {
            toast({
                title: 'Trade Locked',
                description: 'You have successfully locked this trade!',
            });
        },
    });

    const { data: completeTradeData, write: completeTrade } = useContractWrite({
        address: P2P_ESCROW_ADDRESS,
        abi: P2PEscrowABI,
        functionName: 'completeTrade',
    });

    const { isLoading: isCompleteTradeLoading } = useWaitForTransaction({
        hash: completeTradeData?.hash,
        onSuccess() {
            toast({
                title: 'Trade Completed',
                description: 'The trade has been completed successfully!',
            });
        },
    });

    const { data: cancelTradeData, write: cancelTrade } = useContractWrite({
        address: P2P_ESCROW_ADDRESS,
        abi: P2PEscrowABI,
        functionName: 'cancelTrade',
    });

    const { isLoading: isCancelTradeLoading } = useWaitForTransaction({
        hash: cancelTradeData?.hash,
        onSuccess() {
            toast({
                title: 'Trade Cancelled',
                description: 'The trade has been cancelled.',
            });
        },
    });

    const { data: disputeTradeData, write: disputeTrade } = useContractWrite({
        address: P2P_ESCROW_ADDRESS,
        abi: P2PEscrowABI,
        functionName: 'disputeTrade',
    });

    const { isLoading: isDisputeTradeLoading } = useWaitForTransaction({
        hash: disputeTradeData?.hash,
        onSuccess() {
            toast({
                title: 'Trade Disputed',
                description: 'You have initiated a dispute for this trade.',
            });
        },
    });

    // Helper functions
    const handleCreateTrade = async (
        token: string,
        amount: BigNumber,
        price: BigNumber,
        paymentMethod: string,
        paymentDetails: string,
        isMinPay: boolean
    ) => {
        try {
            await createTrade({
                args: [token, amount, price, paymentMethod, paymentDetails, isMinPay],
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleLockTrade = async (tradeId: BigNumber) => {
        try {
            await lockTrade({
                args: [tradeId],
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleCompleteTrade = async (tradeId: BigNumber) => {
        try {
            await completeTrade({
                args: [tradeId],
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleCancelTrade = async (tradeId: BigNumber) => {
        try {
            await cancelTrade({
                args: [tradeId],
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleDisputeTrade = async (tradeId: BigNumber) => {
        try {
            await disputeTrade({
                args: [tradeId],
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    return {
        // Read states
        tradeCount,
        escrowFee,
        
        // Write functions
        handleCreateTrade,
        handleLockTrade,
        handleCompleteTrade,
        handleCancelTrade,
        handleDisputeTrade,
        
        // Loading states
        isCreateTradeLoading,
        isLockTradeLoading,
        isCompleteTradeLoading,
        isCancelTradeLoading,
        isDisputeTradeLoading,
    };
}; 