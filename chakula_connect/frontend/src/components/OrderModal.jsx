import React, { useState } from 'react';
import { X, Loader2, CheckCircle, CreditCard } from 'lucide-react';

const OrderModal = ({ product, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('ORDER'); // ORDER, PAY, SUCCESS
    const [orderId, setOrderId] = useState(null);
    const [formData, setFormData] = useState({
        buyer_name: '',
        buyer_phone: '',
        buyer_location: '',
        buyer_type: 'WHOLESALER',
        quantity_kg: ''
    });

    if (!isOpen || !product) return null;

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                produce_id: product.id,
                ...formData
            };

            const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setOrderId(data.order_id);
                setStep('PAY');
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/payments/initiate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    phone_number: formData.buyer_phone
                })
            });

            if (response.ok) {
                setStep('SUCCESS');
                setTimeout(() => {
                    onClose();
                    setStep('ORDER'); // Reset
                    setOrderId(null);
                }, 3000);
            } else {
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment network error.');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = formData.quantity_kg ? (parseFloat(formData.quantity_kg) * parseFloat(product.price_per_kg)).toLocaleString() : '0';

    if (step === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-brand-green/30 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-brand-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h3>
                    <p className="text-gray-400">Order #{orderId} has been paid successfully.</p>
                </div>
            </div>
        );
    }

    if (step === 'PAY') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#1a1a1a] w-full max-w-md p-8 rounded-3xl border border-white/10 text-center animate-in fade-in zoom-in duration-200">
                    <h3 className="text-2xl font-bold text-white mb-2">Total: {totalPrice} TZS</h3>
                    <p className="text-gray-400 mb-8">Pay via M-PESA to complete your order.</p>

                    <div className="bg-white/5 rounded-xl p-4 mb-8 flex items-center gap-4 border border-white/10">
                        <div className="bg-green-500/20 p-3 rounded-full">
                            <CreditCard className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-medium">M-PESA STK Push</p>
                            <p className="text-sm text-gray-400">{formData.buyer_phone}</p>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay Now'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white">Complete Order</h3>
                        <p className="text-sm text-gray-400">Buying {product.crop_type} from {product.farmer_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Your Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50"
                                value={formData.buyer_name}
                                onChange={e => setFormData({ ...formData, buyer_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Phone Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="e.g. +254..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50"
                                value={formData.buyer_phone}
                                onChange={e => setFormData({ ...formData, buyer_phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Delivery Location</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50"
                            value={formData.buyer_location}
                            onChange={e => setFormData({ ...formData, buyer_location: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Organization Type</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 appearance-none cursor-pointer"
                                value={formData.buyer_type}
                                onChange={e => setFormData({ ...formData, buyer_type: e.target.value })}
                            >
                                <option value="WHOLESALER" className="bg-gray-800">Wholesaler</option>
                                <option value="SCHOOL" className="bg-gray-800">School</option>
                                <option value="HOSPITAL" className="bg-gray-800">Hospital</option>
                                <option value="NGO" className="bg-gray-800">NGO</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Quantity (kg)</label>
                            <input
                                required
                                type="number"
                                max={product.quantity_kg}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50"
                                value={formData.quantity_kg}
                                onChange={e => setFormData({ ...formData, quantity_kg: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-4 mt-6 flex justify-between items-center">
                        <span className="text-brand-accent font-medium">Total Estimate</span>
                        <span className="text-2xl font-bold text-white">{totalPrice} <span className="text-sm font-normal text-gray-400">TZS</span></span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-brand-accent text-brand-dark font-bold hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;
