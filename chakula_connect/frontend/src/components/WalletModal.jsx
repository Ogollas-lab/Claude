import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WalletModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleConnect = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate STK Push delay
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-brand-dark border border-white/20 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <CreditCard className="text-brand-green" /> {t.wallet.title}
                </h2>
                <p className="text-gray-400 mb-6">{t.wallet.subtitle}</p>

                {success ? (
                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 text-center">
                        <Lock className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">{t.wallet.connected}</h3>
                        <p className="text-green-200">{t.wallet.connectedMsg}</p>
                    </div>
                ) : (
                    <form onSubmit={handleConnect} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm mb-1">{t.wallet.phoneLabel}</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="2547..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-200">
                            <strong>{t.wallet.note}</strong>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? t.wallet.connecting : t.wallet.connectBtn}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default WalletModal;
