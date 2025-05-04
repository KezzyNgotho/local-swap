import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import P2PEscrowABI from '../../../../contracts/P2PEscrow.json';

const MINPAY_WEBHOOK_SECRET = process.env.MINPAY_WEBHOOK_SECRET;
const P2P_ESCROW_ADDRESS = process.env.NEXT_PUBLIC_P2P_ESCROW_ADDRESS;
const PROVIDER_URL = process.env.NEXT_PUBLIC_PROVIDER_URL;

export async function POST(request: Request) {
    try {
        const signature = request.headers.get('x-minpay-signature');
        
        if (!signature || !MINPAY_WEBHOOK_SECRET) {
            return NextResponse.json(
                { success: false, message: 'Invalid webhook signature' },
                { status: 401 }
            );
        }

        // Verify webhook signature
        // Implementation depends on MinPay's signature verification method
        // This is a placeholder for the actual verification logic
        const isValidSignature = true; // Replace with actual verification

        if (!isValidSignature) {
            return NextResponse.json(
                { success: false, message: 'Invalid signature' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { 
            payment_id,
            status,
            trade_id, // Assuming this is passed in the payment metadata
            amount,
            currency
        } = body;

        if (status === 'completed') {
            // Connect to the blockchain and complete the trade
            const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
            const privateKey = process.env.ADMIN_PRIVATE_KEY;
            if (!privateKey) {
                throw new Error('Admin private key not configured');
            }

            const wallet = new ethers.Wallet(privateKey, provider);
            const contract = new ethers.Contract(
                P2P_ESCROW_ADDRESS!,
                P2PEscrowABI.abi, // Use the .abi property from the imported JSON
                wallet
            );

            // Complete the trade on the blockchain
            const tx = await contract.completeTrade(trade_id);
            await tx.wait();

            return NextResponse.json({
                success: true,
                message: 'Payment processed successfully',
                transactionHash: tx.hash,
            });
        }

        return NextResponse.json({
            success: true,
            message: `Payment ${status}`,
            paymentId: payment_id,
        });
    } catch (error: any) {
        console.error('MinPay callback error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
} 