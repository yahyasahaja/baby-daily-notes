'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Scale, Droplets, Baby, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateWeightGain, analyzeDiaperPatterns, formatDate } from '@/utils/calculations';
import { getWeightStatus, calculateAgeInMonths } from '@/data/babyStandards';

export default function HomeDashboard() {
  const { selectedProfileId, profiles, dailyRecords } = useAppSelector((state) => state.app);
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileDailyRecords = selectedProfile ? dailyRecords[selectedProfile.id] || [] : [];
  
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = profileDailyRecords.find(record => record.date === today);
  const todayDiaperEntries = todayRecord?.diaperEntries || [];
  
  const weightEntries = profileDailyRecords
    .filter(record => record.weight)
    .map(record => record.weight!)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const allDiaperEntries = profileDailyRecords.flatMap(record => record.diaperEntries);
  const analysis = analyzeDiaperPatterns(allDiaperEntries);

  if (!selectedProfile) {
    return (
      <div className="p-4 pb-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome</h1>
          <p className="text-gray-600">Please select a profile to get started</p>
        </div>
      </div>
    );
  }

  const ageInMonths = calculateAgeInMonths(new Date(selectedProfile.dateOfBirth));
  const latestWeight = weightEntries[weightEntries.length - 1];
  const weightStatus = latestWeight ? getWeightStatus(latestWeight.weight, ageInMonths, selectedProfile.gender) : null;
  const weightGain = calculateWeightGain(weightEntries, ageInMonths);

  const todayStats = {
    weight: todayRecord?.weight?.weight,
    peeCount: todayRecord?.peeCount || 0,
    poopCount: todayRecord?.poopCount || 0
  };

  const hasAlerts = analysis.dehydrationRisk || analysis.diarrheaRisk || 
    (weightStatus && weightStatus.status !== 'normal');

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
          <p className="text-gray-600">
            {selectedProfile.name} • {ageInMonths} months old
          </p>
        </div>

        {/* Alerts */}
        {hasAlerts && (
          <div className="mb-6 space-y-3">
            {analysis.dehydrationRisk && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Dehydration Warning</h3>
                    <p className="text-sm text-red-600 mt-1">
                      Low urine output detected. Please ensure adequate hydration.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {analysis.diarrheaRisk && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Diarrhea Alert</h3>
                    <p className="text-sm text-orange-600 mt-1">
                      Frequent loose stools detected. Please monitor closely.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {weightStatus && weightStatus.status !== 'normal' && (
              <div className={cn(
                'border rounded-xl p-4',
                weightStatus.status === 'belowStandard' && 'bg-red-50 border-red-200',
                weightStatus.status === 'underweight' && 'bg-yellow-50 border-yellow-200',
                weightStatus.status === 'overweight' && 'bg-orange-50 border-orange-200'
              )}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={cn(
                    'w-5 h-5 mt-0.5',
                    weightStatus.status === 'belowStandard' && 'text-red-500',
                    weightStatus.status === 'underweight' && 'text-yellow-500',
                    weightStatus.status === 'overweight' && 'text-orange-500'
                  )} />
                  <div>
                    <h3 className={cn(
                      'font-semibold',
                      weightStatus.status === 'belowStandard' && 'text-red-800',
                      weightStatus.status === 'underweight' && 'text-yellow-800',
                      weightStatus.status === 'overweight' && 'text-orange-800'
                    )}>
                      Weight Status Alert
                    </h3>
                    <p className={cn(
                      'text-sm mt-1',
                      weightStatus.status === 'belowStandard' && 'text-red-600',
                      weightStatus.status === 'underweight' && 'text-yellow-600',
                      weightStatus.status === 'overweight' && 'text-orange-600'
                    )}>
                      {weightStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white">
            <div className="text-center">
              <Scale className="w-6 h-6 text-pink-200 mx-auto mb-2" />
              <p className="text-pink-100 text-xs">Weight</p>
              <p className="text-lg font-bold">
                {todayStats.weight ? `${todayStats.weight} kg` : 'Not recorded'}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-center">
              <Droplets className="w-6 h-6 text-blue-200 mx-auto mb-2" />
              <p className="text-blue-100 text-xs">Pee</p>
              <p className="text-lg font-bold">{todayStats.peeCount}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
            <div className="text-center">
              <Baby className="w-6 h-6 text-amber-200 mx-auto mb-2" />
              <p className="text-amber-100 text-xs">Poop</p>
              <p className="text-lg font-bold">{todayStats.poopCount}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">
                {weightGain.daily}g
              </p>
              <p className="text-xs text-gray-600">Daily Weight Gain</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {analysis.peeFrequency === 'normal' ? '✓' : '⚠'}
              </p>
              <p className="text-xs text-gray-600">Hydration Status</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-500" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {todayRecord?.weight && (
              <div className="flex items-center space-x-3 p-2 bg-pink-50 rounded-lg">
                <Scale className="w-4 h-4 text-pink-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Weight recorded: {todayRecord.weight.weight} kg
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatDate(todayRecord.weight.date)}
                  </p>
                </div>
              </div>
            )}
            
            {todayDiaperEntries.length > 0 && (
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <Baby className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {todayDiaperEntries.length} diaper change{todayDiaperEntries.length > 1 ? 's' : ''} today
                  </p>
                  <p className="text-xs text-gray-600">
                    Latest: {formatDate(todayDiaperEntries[todayDiaperEntries.length - 1].createdAt)}
                  </p>
                </div>
              </div>
            )}
            
            {!todayRecord?.weight && todayDiaperEntries.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No activity recorded today</p>
                <p className="text-gray-400 text-xs mt-1">Start tracking your baby's progress!</p>
              </div>
            )}
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Health Status
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weight Status:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                weightStatus?.status === 'normal' && 'bg-green-100 text-green-800',
                weightStatus?.status === 'underweight' && 'bg-yellow-100 text-yellow-800',
                weightStatus?.status === 'overweight' && 'bg-orange-100 text-orange-800',
                weightStatus?.status === 'belowStandard' && 'bg-red-100 text-red-800',
                !weightStatus?.status && 'bg-gray-200 text-gray-800'
              )}>
                {weightStatus?.status || 'Not recorded'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hydration:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                analysis.peeFrequency === 'normal' && 'bg-green-100 text-green-800',
                analysis.peeFrequency === 'low' && 'bg-red-100 text-red-800',
                analysis.peeFrequency === 'high' && 'bg-blue-100 text-blue-800',
                !analysis.peeFrequency && 'bg-gray-200 text-gray-800'
              )}>
                {analysis.peeFrequency || 'Not recorded'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Digestive Health:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                analysis.poopFrequency === 'normal' && 'bg-green-100 text-green-800',
                analysis.poopFrequency === 'diarrhea' && 'bg-red-100 text-red-800',
                analysis.poopFrequency === 'constipation' && 'bg-yellow-100 text-yellow-800',
                !analysis.poopFrequency && 'bg-gray-200 text-gray-800'
              )}>
                {analysis.poopFrequency || 'Not recorded'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
