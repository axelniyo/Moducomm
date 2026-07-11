import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from '../../../modules/cart/cartService'; // Corrected path
import { Cart } from '../../../types'; // Corrected path
import { StripePaymentForm } from './StripePaymentForm';

const CheckoutPage: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCart()
            .then(setCart)
            .catch(() => setError('Failed to load your cart. Please try again.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-center p-12">Loading your cart...</div>;
    }

    if (error) {
        return <div className="text-center p-12 text-red-500">{error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center p-12">
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty.</h2>
                <Link to="/" className="text-primary hover:underline">
                    &larr; Continue Shopping
                </Link>
            </div>
        );
    }

    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
                    <div className="space-y-4">
                        {cart.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-6 border-t pt-4">
                        <p>Total</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <StripePaymentForm orderId={cart.id.toString()} amount={total} />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
