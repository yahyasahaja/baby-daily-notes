'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Settings from '@/components/Settings';

export default function SettingsPage() {
  const router = useRouter();
  const { selectedProfileId, profiles } = useAppSelector((state) => state.app);

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

  return <Settings />;
}
