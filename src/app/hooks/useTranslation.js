'use client';
import { useState, useEffect } from 'react';

const translations = {
    en: require('../locales/en.json'),
    hi: require('../locales/hi.json'),
    gu: require('../locales/gu.json'),
};

export const useTranslation = () => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        setLanguage(savedLang);
    }, []);

    const t = (key) => {
        return translations[language]?.[key] || translations['en'][key] || key;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
    };

    return { t, language, changeLanguage };
};