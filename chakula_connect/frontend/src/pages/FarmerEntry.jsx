import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Sprout, MapPin, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FarmerEntry = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        location_name: '',
        latitude: '',
        longitude: '',
        produce: [
            { crop_type: 'MAIZE', quantity_kg: '', price_per_kg: '', harvest_date: new Date().toISOString().split('T')[0] }
        ]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProduceChange = (index, e) => {
        const newProduce = [...formData.produce];
        newProduce[index][e.target.name] = e.target.value;
        setFormData({ ...formData, produce: newProduce });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/farmers/', formData);
            alert(t.farmerEntry.success);
            navigate('/'); // Go back to dashboard to see new point
        } catch (error) {
            console.error(error);
            alert('Error registering farmer. Check console.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fill Geo-location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tighter flex items-center gap-3">
                            <UserPlus className="text-brand-accent" /> {t.farmerEntry.title}
                        </h1>
                        <p className="text-gray-400 mt-1">{t.farmerEntry.subtitle}</p>
                    </div>
                    <Link to="/" className="p-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </header>

                <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
                    {/* Farmer Details */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                            <UserPlus className="w-5 h-5 text-brand-green" /> {t.farmerEntry.personalInfo}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.fullName}</label>
                                <input name="name" onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.phone}</label>
                                <input name="phone_number" onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none" placeholder="+254..." />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-green" /> {t.farmerEntry.location}
                            </h3>
                            <button type="button" onClick={getLocation} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors">
                                {t.farmerEntry.getGps}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.region}</label>
                                <input name="location_name" onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none" placeholder="e.g. Kitale" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.latitude}</label>
                                <input name="latitude" value={formData.latitude} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none" placeholder="0.0000" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.longitude}</label>
                                <input name="longitude" value={formData.longitude} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none" placeholder="36.0000" />
                            </div>
                        </div>
                    </div>

                    {/* Produce */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                            <Sprout className="w-5 h-5 text-brand-green" /> {t.farmerEntry.harvestDetails}
                        </h3>
                        {formData.produce.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.cropType}</label>
                                    <select name="crop_type" onChange={(e) => handleProduceChange(idx, e)} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none">
                                        <option value="MAIZE">Maize</option>
                                        <option value="BEANS">Beans</option>
                                        <option value="POTATOES">Potatoes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.quantity}</label>
                                    <input name="quantity_kg" type="number" onChange={(e) => handleProduceChange(idx, e)} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">{t.farmerEntry.price}</label>
                                    <input name="price_per_kg" type="number" onChange={(e) => handleProduceChange(idx, e)} required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-green outline-none" placeholder="0" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-lg shadow-brand-green/20"
                    >
                        {loading ? 'Registering...' : <><Save className="w-5 h-5" /> {t.farmerEntry.submit}</>}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default FarmerEntry;
