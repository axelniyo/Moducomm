import React from 'react';
import { useLocation } from 'react-router-dom';

// A simple placeholder component for now
const CheckoutPage: React.FC = () => {
    const location = useLocation();
    // We can get cart data from location state if passed from the cart drawer
    const { cart } = location.state || { cart: null };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-gray-500 mt-2">Add some items to your cart to proceed to checkout.</p>
            </div>
        );
    }

    const total = cart.items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-12">
                {/* Order Summary */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {cart.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p>Stripe Payment Form will go here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
