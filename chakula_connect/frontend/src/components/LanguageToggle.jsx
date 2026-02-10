import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
            title="Switch Language / Badili Lugha"
        >
            <Globe className="w-4 h-4 text-brand-accent" />
            <span className="text-gray-300">
                {language === 'en' ? 'ENG' : 'SWA'}
            </span>
        </button>
    );
};

export default LanguageToggle;
