import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiClient } from '../../../services/apiClient'; // Corrected path
import { useToast } from '../../../components/Toast'; // Corrected path

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

interface StripeFormProps {
    orderId: string;
    amount: number;
}

const CheckoutForm: React.FC<StripeFormProps> = ({ orderId, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            showToast('Stripe has not loaded yet.', 'error');
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            showToast('Card details are missing.', 'error');
            setLoading(false);
            return;
        }

        try {
            // 1. Initiate payment on your backend
            const paymentResponse = await apiClient.post('/api/payment/initiate', {
                orderId,
                amount,
                paymentProvider: 'STRIPE'
            });

            const { clientSecret } = paymentResponse;

            // 2. Confirm the payment with Stripe on the client-side
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                throw new Error(error.message || 'Payment failed');
            }

            if (paymentIntent?.status === 'succeeded') {
                showToast('Payment successful!', 'success');
                // Here you would typically redirect to an order confirmation page
                // For now, we'll just show a success message
            }
        } catch (err: any) {
            showToast(err.message || 'An unexpected error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4 p-3 border rounded-md">
                <CardElement />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
};

export const StripePaymentForm: React.FC<StripeFormProps> = (props) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm {...props} />
    </Elements>
);
