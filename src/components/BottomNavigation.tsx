'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Weight, Baby, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useI18n } from '@/context/I18nContext';

interface BottomNavigationProps {
  activeTab?: string;
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();

  const tabs = [
    { id: 'home', icon: Home, label: t('nav.home'), path: '/' },
    { id: 'weight', icon: Weight, label: t('nav.weight'), path: '/weight' },
    { id: 'pee', icon: Baby, label: t('nav.pee'), path: '/pee' },
    { id: 'poop', icon: Baby, label: t('nav.poop'), path: '/poop' },
    { id: 'summary', icon: BarChart3, label: t('nav.summary'), path: '/summary' },
    { id: 'settings', icon: Settings, label: t('nav.settings'), path: '/settings' },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    router.push(tab.path);
  };

  const isActive = (tab: typeof tabs[0]) => {
    if (activeTab) return activeTab === tab.id;
    
    // Handle home page specially
    if (tab.path === '/') {
      return pathname === '/' || pathname === '/index.html' || pathname === '';
    }
    
    // For other pages, check if pathname starts with the tab path
    return pathname.startsWith(tab.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={cn(
                'flex flex-col items-center py-2 px-3 rounded-lg transition-colors',
                active
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-1', active && 'text-pink-600')} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
