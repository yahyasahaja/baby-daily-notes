'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectProfile } from '@/store/slices/appSlice';
import ProfileSelector from '@/components/ProfileSelector';
import HomeDashboard from '@/components/HomeDashboard';

export default function RootPage() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, profiles } = useAppSelector((state) => state.app);

  // If no profile is selected, show profile selector
  if (!selectedProfileId || profiles.length === 0) {
    return (
      <ProfileSelector 
        onProfileSelect={(profileId) => {
          dispatch(selectProfile(profileId));
        }} 
      />
    );
  }

  return <HomeDashboard />;
}
