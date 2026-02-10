import React from 'react';
import { X, Truck, Phone, User } from 'lucide-react';
import DeliveryMap from './DeliveryMap';

const TrackingModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-brand-dark border border-white/20 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Truck className="text-brand-accent" /> Track Delivery
                </h2>
                <p className="text-gray-400 mb-6 text-sm">Order #{order.order_id} • 25 mins remaining</p>

                {/* Driver Info */}
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl mb-4 border border-white/10">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="text-gray-300" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Samuel K. (Driver)</h4>
                        <p className="text-brand-green text-xs flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Isuzu Truck • KBA 123Z
                        </p>
                    </div>
                    <a href="tel:+254712345678" className="ml-auto px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold no-underline">
                        <Phone className="w-4 h-4" /> Call Driver
                    </a>
                </div>

                {/* Map */}
                <DeliveryMap order={order} />

            </div>
        </div>
    );
};

export default TrackingModal;
