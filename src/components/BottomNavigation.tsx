'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Weight, Baby, Heart, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useI18n } from '@/context/I18nContext';
import { useAppSelector } from '@/store/hooks';

interface BottomNavigationProps {
  activeTab?: string;
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const selectedProfileId = useAppSelector((state) => state.app.selectedProfileId);

  // Show different tabs based on whether a profile is selected
  const tabs = selectedProfileId ? [
    { id: 'home', icon: Home, label: t('home'), path: '/' },
    { id: 'weight', icon: Weight, label: t('weight'), path: '/weight' },
    { id: 'diaper', icon: Baby, label: t('diaper'), path: '/diaper' },
    { id: 'sick', icon: Heart, label: t('sick'), path: '/sick' },
    { id: 'summary', icon: BarChart3, label: t('summary'), path: '/summary' },
    { id: 'settings', icon: Settings, label: t('settings'), path: '/settings' },
  ] : [
    { id: 'home', icon: Home, label: t('home'), path: '/' },
    { id: 'settings', icon: Settings, label: t('settings'), path: '/settings' },
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 ios-safe-area">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={cn(
                'flex flex-col items-center py-1 px-1 rounded-lg transition-colors flex-1 min-w-0',
                active
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className={cn('w-4 h-4 mb-0.5', active && 'text-pink-600')} />
              <span className="text-[10px] font-medium truncate w-full text-center leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
