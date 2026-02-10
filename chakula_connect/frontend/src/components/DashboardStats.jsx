import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Truck, Users, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-panel p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
        <Icon className={`w-10 h-10 mb-2 ${color}`} />
        <h3 className="text-gray-400 text-sm uppercase tracking-wider text-center">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
);

const DashboardStats = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const totalOrders = orders.length;
    const activeDeliveries = orders.filter(o => o.status !== 'DELIVERED').length;
    const totalVolume = orders.reduce((acc, curr) => acc + parseFloat(curr.quantity_ordered_kg), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard title={t.dashboardStats.activeDeliveries} value={activeDeliveries} icon={Truck} color="text-blue-400" />
            <StatsCard title={t.dashboardStats.totalVolume} value={totalVolume.toLocaleString()} icon={TrendingUp} color="text-green-400" />
            <StatsCard title={t.dashboardStats.partnerBuyers} value="3" icon={Users} color="text-purple-400" />
            <StatsCard title={t.dashboardStats.criticalAlerts} value="2" icon={AlertTriangle} color="text-red-400" />
        </div>
    );
};

export default DashboardStats;
