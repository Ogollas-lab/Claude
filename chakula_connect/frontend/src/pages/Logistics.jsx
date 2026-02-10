
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck, Package, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrackingModal from '../components/TrackingModal';
import { useLanguage } from '../context/LanguageContext';

const Logistics = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/orders/')
            .then(res => {
                setOrders(res.data.orders);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-brand-dark p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tighter flex items-center gap-3">
                        <Truck className="text-brand-accent" /> {t.logistics.title}
                    </h1>
                    <p className="text-gray-400 mt-1">{t.logistics.subtitle}</p>
                </div>
                <Link to="/" className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                    {t.logistics.back}
                </Link>
            </header>

            {loading ? (
                <div className="text-white text-center py-20">{t.logistics.loading}</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.length === 0 && <div className="text-gray-500 text-center py-10">{t.logistics.noOrders}</div>}

                    {orders.map((order, idx) => (
                        <div key={idx} className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                                <div className="p-4 rounded-full bg-blue-500/20 text-blue-400">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{t.logistics.order} #{order.order_id}</h3>
                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {t.logistics.destination}: <span className="text-white">{order.buyer__name}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">{t.logistics.cargo}</p>
                                    <p className="font-bold text-white">{order.quantity_ordered_kg}kg {order.produce__crop_type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">{t.logistics.status}</p>
                                    <span className={`inline - flex items - center gap - 1 px - 3 py - 1 rounded - full text - xs font - bold ${order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                        } `}>
                                        {order.status === 'DELIVERED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {order.status === 'DELIVERED' ? t.logistics.delivered : (order.status === 'PENDING' ? t.logistics.pending : t.logistics.in_transit)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-6 py-2 rounded-lg bg-brand-green/20 text-brand-green border border-brand-green hover:bg-brand-green hover:text-white transition-all text-sm font-bold"
                                >
                                    {t.logistics.track}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tracking Modal */}
            <TrackingModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    );
};

export default Logistics;
