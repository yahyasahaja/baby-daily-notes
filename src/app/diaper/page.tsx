'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import PeeTracker from '@/components/PeeTracker';
import PoopTracker from '@/components/PoopTracker';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/utils/cn';

export default function DiaperPage() {
  const router = useRouter();
  const { selectedProfileId, profiles } = useAppSelector((state) => state.app);
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'pee' | 'poop'>('pee');

  useEffect(() => {
    // If no profile is selected, redirect to home
    if (!selectedProfileId || profiles.length === 0) {
      router.push('/');
    }
  }, [selectedProfileId, profiles.length, router]);

  // If no profile is selected, don't render anything (will redirect)
  if (!selectedProfileId || profiles.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex w-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('pee')}
            className={cn(
              'flex-1 py-4 px-4 text-center font-medium transition-colors min-w-0',
              activeTab === 'pee'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <span className="truncate block">{t('pee')}</span>
          </button>
          <button
            onClick={() => setActiveTab('poop')}
            className={cn(
              'flex-1 py-4 px-4 text-center font-medium transition-colors min-w-0',
              activeTab === 'poop'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <span className="truncate block">{t('poop')}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'pee' ? <PeeTracker /> : <PoopTracker />}
      </div>
    </div>
  );
}
