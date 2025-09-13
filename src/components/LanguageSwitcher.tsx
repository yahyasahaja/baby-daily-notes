'use client';

import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'id' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors shadow-md border-2 border-pink-600"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-semibold">
        {language === 'en' ? 'ID' : 'EN'}
      </span>
    </button>
  );
}
