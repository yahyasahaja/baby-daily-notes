'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import SummaryDashboard from '@/components/SummaryDashboard';

export default function SummaryPage() {
  const router = useRouter();
  const { selectedProfileId, profiles } = useAppSelector((state) => state.app);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && (!selectedProfileId || profiles.length === 0)) {
      router.push('/');
    }
  }, [isClient, selectedProfileId, profiles.length, router]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no profile is selected, don't render anything (will redirect)
  if (!selectedProfileId || profiles.length === 0) {
    return null;
  }

  return <SummaryDashboard />;
}
