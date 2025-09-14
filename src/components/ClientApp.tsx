'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectProfile } from '@/store/slices/appSlice';
import ProfileSelector from '@/components/ProfileSelector';
import HomeDashboard from '@/components/HomeDashboard';

export default function ClientApp() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, profiles } = useAppSelector((state) => state.app);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no profile is selected, show landing page with profile selector
  if (!selectedProfileId || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Baby Daily Notes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track your baby's weight, diaper changes, and health with detailed analytics and insights. 
              Monitor growth patterns and health trends with WHO growth standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Weight Tracking</h3>
                <p className="text-sm text-gray-600">Monitor growth with WHO standards</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">💧 Diaper Analysis</h3>
                <p className="text-sm text-gray-600">Track hydration and health</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">📈 Health Insights</h3>
                <p className="text-sm text-gray-600">Get detailed analytics</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Baby Daily Notes?</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-pink-500 mt-1">✓</span>
                  <span className="text-gray-700">WHO Growth Standards integration for accurate health monitoring</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-pink-500 mt-1">✓</span>
                  <span className="text-gray-700">Privacy-first: All data stored locally on your device</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-pink-500 mt-1">✓</span>
                  <span className="text-gray-700">Comprehensive tracking: Weight, diapers, and health symptoms</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-pink-500 mt-1">✓</span>
                  <span className="text-gray-700">Smart alerts for dehydration and health concerns</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-pink-500 mt-1">✓</span>
                  <span className="text-gray-700">PWA support for mobile app-like experience</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Create Profile</h3>
                    <p className="text-sm text-gray-600">Add your baby's information and birth details</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Daily Tracking</h3>
                    <p className="text-sm text-gray-600">Record weight, diaper changes, and health data</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Monitor Progress</h3>
                    <p className="text-sm text-gray-600">View insights and growth charts with WHO standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start?</h2>
              <p className="text-gray-600 mb-6">
                Create your baby's profile and start tracking their health journey today.
              </p>
              <div className="text-sm text-gray-500">
                Use the form below to get started
              </div>
            </div>
          </div>
        </div>

        {/* Profile Selector */}
        <div className="bg-white pb-20">
          <ProfileSelector 
            onProfileSelect={(profileId) => {
              dispatch(selectProfile(profileId));
            }} 
          />
        </div>
      </div>
    );
  }

  return <HomeDashboard />;
}
