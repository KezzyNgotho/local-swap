import { NextResponse } from 'next/server';

const MINPAY_API_KEY = process.env.MINPAY_API_KEY;
const MINPAY_API_URL = process.env.MINPAY_API_URL || 'https://api.minpay.example.com'; // Replace with actual MinPay API URL

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phoneNumber, amount, currency } = body;

        if (!phoneNumber || !amount || !currency) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!MINPAY_API_KEY) {
            return NextResponse.json(
                { success: false, message: 'MinPay API key not configured' },
                { status: 500 }
            );
        }

        // Make request to MinPay API
        const response = await fetch(`${MINPAY_API_URL}/payments/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MINPAY_API_KEY}`,
            },
            body: JSON.stringify({
                phone_number: phoneNumber,
                amount,
                currency,
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/minpay/callback`,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Payment initiation failed');
        }

        return NextResponse.json({
            success: true,
            paymentId: data.payment_id,
            status: data.status,
        });
    } catch (error: any) {
        console.error('MinPay payment initiation error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
} 