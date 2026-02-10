import React from 'react';
import { MapPin, Calendar, Tag } from 'lucide-react';

const ProductCard = ({ product, onBuy }) => {
    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">
                        {product.crop_type}
                    </h3>
                    <p className="text-gray-400 text-sm">{product.farmer_name}</p>
                </div>
                <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold border border-brand-green/30">
                    {product.quantity_kg} kg
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300">
                    <Tag className="w-4 h-4 text-brand-accent" />
                    <span className="font-mono text-lg">{parseInt(product.price_per_kg).toLocaleString()} TZS <span className="text-xs text-gray-500">/kg</span></span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location_name || 'Unknown Location'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Harvest: {product.harvest_date}</span>
                </div>
            </div>

            <button
                onClick={() => onBuy(product)}
                className="w-full py-3 rounded-xl bg-brand-accent text-brand-dark font-bold hover:opacity-90 transition-opacity"
            >
                Buy Now
            </button>
        </div>
    );
};

export default ProductCard;
