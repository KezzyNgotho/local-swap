import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MinPayIntegrationProps {
    amount: number;
    currency: string;
    onSuccess: () => void;
    onError: (error: string) => void;
}

export const MinPayIntegration: React.FC<MinPayIntegrationProps> = ({
    amount,
    currency,
    onSuccess,
    onError,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleMinPaySubmit = async () => {
        if (!phoneNumber) {
            toast({
                title: 'Error',
                description: 'Please enter a valid phone number',
                variant: 'destructive',
            });
            return;
        }

        setIsProcessing(true);

        try {
            // Here you would integrate with MinPay's API
            // This is a placeholder for the actual API integration
            const response = await fetch('/api/minpay/initiate-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    amount,
                    currency,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Payment Initiated',
                    description: 'Please check your phone for the payment confirmation.',
                });
                onSuccess();
                setIsOpen(false);
            } else {
                throw new Error(data.message || 'Payment failed');
            }
        } catch (error: any) {
            toast({
                title: 'Payment Failed',
                description: error.message,
                variant: 'destructive',
            });
            onError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            >
                Pay with MinPay
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>MinPay Payment</DialogTitle>
                        <DialogDescription>
                            Enter your phone number to proceed with the payment
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1234567890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Amount</Label>
                            <div className="text-2xl font-bold">
                                {amount} {currency}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleMinPaySubmit}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-blue-600 to-blue-700"
                        >
                            {isProcessing ? 'Processing...' : 'Confirm Payment'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}; 