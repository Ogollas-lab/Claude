import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import OrderModal from '../components/OrderModal';
import PriceForecastWidget from '../components/PriceForecastWidget';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        crop: 'ALL',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.crop_type.toLowerCase().includes(filters.search.toLowerCase()) ||
            (product.location_name && product.location_name.toLowerCase().includes(filters.search.toLowerCase()));

        const matchesCrop = filters.crop === 'ALL' || product.crop_type === filters.crop;

        const matchesMinPrice = !filters.minPrice || parseFloat(product.price_per_kg) >= parseFloat(filters.minPrice);
        const matchesMaxPrice = !filters.maxPrice || parseFloat(product.price_per_kg) <= parseFloat(filters.maxPrice);

        return matchesSearch && matchesCrop && matchesMinPrice && matchesMaxPrice;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Marketplace</h2>
                    <p className="text-gray-400">Direct from farm to table. Browse available produce.</p>
                </div>
            </div>

            {/* AI Forecast Widget */}
            <div className="mb-8">
                <PriceForecastWidget />
            </div>

            {/* Filters Bar */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search crop or location..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent/50"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <select
                    className="bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-brand-accent/50 appearance-none"
                    value={filters.crop}
                    onChange={(e) => setFilters({ ...filters, crop: e.target.value })}
                >
                    <option value="ALL" className="bg-gray-800">All Crops</option>
                    <option value="MAIZE" className="bg-gray-800">Maize</option>
                    <option value="BEANS" className="bg-gray-800">Beans</option>
                    <option value="POTATOES" className="bg-gray-800">Potatoes</option>
                </select>

                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min Price"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-brand-accent/50"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-brand-accent/50"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onBuy={(prod) => {
                                setSelectedProduct(prod);
                                setIsOrderModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                    <p className="text-gray-400">No products found matching your criteria.</p>
                </div>
            )}


            <OrderModal
                product={selectedProduct}
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
            />
        </div>
    );
};

export default Marketplace;
