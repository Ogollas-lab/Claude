import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Loader2, Sparkles } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PriceForecastWidget = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/analytics/forecast/');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching forecast:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, []);

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9ca3af' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        }
    };

    const chartData = {
        labels: data.labels,
        datasets: data.datasets,
    };

    return (
        <div className="bg-[#1a1a1a] border border-brand-accent/30 rounded-2xl p-6 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl -z-10 group-hover:bg-brand-accent/20 transition-colors"></div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-5 h-5 text-brand-accent" />
                        <h3 className="text-xl font-bold text-white">AI Price Forecast</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Predictive market rates (Maize)</p>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${data.trend === 'UP' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                    {data.trend === 'UP' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {data.predicted_increase}% {data.trend === 'UP' ? 'Increase' : 'Decrease'}
                </div>
            </div>

            <div className="h-[300px]">
                <Line options={chartOptions} data={chartData} />
            </div>

            <div className="mt-4 text-xs text-center text-gray-500">
                * Powered by Scikit-Learn Linear Regression Model
            </div>
        </div>
    );
};

export default PriceForecastWidget;
