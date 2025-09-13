'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertTriangle, CheckCircle, Scale, Baby } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateWeightGain, analyzeDiaperPatterns, groupByWeek, groupByMonth, formatDate } from '@/utils/calculations';
import { getWeightStatus, calculateAgeInMonths } from '@/data/babyStandards';

export default function SummaryDashboard() {
  const { selectedProfileId, profiles, dailyRecords } = useAppSelector((state) => state.app);
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileDailyRecords = selectedProfile ? dailyRecords[selectedProfile.id] || [] : [];
  
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Summary Dashboard</h1>
          <p className="text-gray-600">Please select a profile to view summary</p>
        </div>
      </div>
    );
  }

  const ageInMonths = calculateAgeInMonths(new Date(selectedProfile.dateOfBirth));
  const weightGain = calculateWeightGain(weightEntries, ageInMonths);
  const latestWeight = weightEntries[weightEntries.length - 1];
  const weightStatus = latestWeight ? getWeightStatus(latestWeight.weight, ageInMonths, selectedProfile.gender) : null;

  // Prepare chart data
  const weightChartData = weightEntries.map(entry => ({
    date: formatDate(entry.date),
    weight: entry.weight
  }));

  const weeklyData = Object.entries(groupByWeek(profileDailyRecords)).map(([week, records]) => {
    const peeTotal = records.reduce((sum, record) => sum + record.peeCount, 0);
    const poopTotal = records.reduce((sum, record) => sum + record.poopCount, 0);
    const weightEntries = records.filter(r => r.weight).map(r => r.weight!);
    const avgWeight = weightEntries.length > 0 
      ? weightEntries.reduce((sum, w) => sum + w.weight, 0) / weightEntries.length 
      : 0;

    return {
      week: week.split('-W')[1],
      pee: peeTotal,
      poop: poopTotal,
      weight: avgWeight
    };
  }).slice(-8); // Last 8 weeks

  // Monthly data removed to fix unused variable warning

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Summary Dashboard</h1>

        {/* Profile Info */}
        <div className="bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl p-4 text-white mb-6">
          <h2 className="text-lg font-semibold mb-1">{selectedProfile.name}</h2>
          <p className="text-pink-100 text-sm">
            {ageInMonths} months old • {selectedProfile.gender === 'male' ? 'Boy' : 'Girl'}
          </p>
        </div>

        {/* Weight Summary */}
        {weightEntries.length > 0 && (
          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-pink-500" />
                Weight Analysis
              </h3>
              
              {latestWeight && weightStatus && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Weight:</span>
                    <span className="text-xl font-bold text-gray-800">{latestWeight.weight} kg</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-sm font-medium',
                      weightStatus.status === 'normal' && 'bg-green-100 text-green-800',
                      weightStatus.status === 'underweight' && 'bg-yellow-100 text-yellow-800',
                      weightStatus.status === 'overweight' && 'bg-orange-100 text-orange-800',
                      weightStatus.status === 'belowStandard' && 'bg-red-100 text-red-800',
                      !weightStatus && 'bg-gray-200 text-gray-800'
                    )}>
                      {weightStatus ? weightStatus.status.replace(/([A-Z])/g, ' $1').toLowerCase() : 'Not recorded'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Percentile:</span>
                    <span className="font-medium">{weightStatus.percentile}th</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-2">Weight Gain</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-pink-600">{weightGain.daily}g</p>
                        <p className="text-xs text-gray-600">Daily</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{weightGain.weekly}g</p>
                        <p className="text-xs text-gray-600">Weekly</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{weightGain.monthly}g</p>
                        <p className="text-xs text-gray-600">Monthly</p>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className={cn(
                        'text-sm font-medium px-2 py-1 rounded-full',
                        weightGain.status === 'excellent' && 'bg-green-100 text-green-800',
                        weightGain.status === 'good' && 'bg-blue-100 text-blue-800',
                        weightGain.status === 'needsAttention' && 'bg-yellow-100 text-yellow-800'
                      )}>
                        {weightGain.status.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Chart */}
            {weightChartData.length > 1 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Weight Trend</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#ec4899" 
                        strokeWidth={2}
                        dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diaper Analysis */}
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Baby className="w-5 h-5 mr-2 text-blue-500" />
              Diaper Analysis
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pee Frequency:</span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-sm font-medium',
                  analysis.peeFrequency === 'normal' && 'bg-green-100 text-green-800',
                  analysis.peeFrequency === 'low' && 'bg-red-100 text-red-800',
                  analysis.peeFrequency === 'high' && 'bg-blue-100 text-blue-800'
                )}>
                  {analysis.peeFrequency}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Poop Frequency:</span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-sm font-medium',
                  analysis.poopFrequency === 'normal' && 'bg-green-100 text-green-800',
                  analysis.poopFrequency === 'diarrhea' && 'bg-red-100 text-red-800',
                  analysis.poopFrequency === 'constipation' && 'bg-yellow-100 text-yellow-800'
                )}>
                  {analysis.poopFrequency}
                </span>
              </div>

              {(analysis.dehydrationRisk || analysis.diarrheaRisk) && (
                <div className="space-y-2">
                  {analysis.dehydrationRisk && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Dehydration risk detected</span>
                    </div>
                  )}
                  {analysis.diarrheaRisk && (
                    <div className="flex items-center space-x-2 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Diarrhea risk detected</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Weekly Diaper Chart */}
          {weeklyData.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Weekly Patterns</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pee" fill="#3b82f6" name="Pee" />
                    <Bar dataKey="poop" fill="#f59e0b" name="Poop" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Health Insights */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Health Insights
          </h3>
          
          <div className="space-y-3">
            {weightStatus && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{weightStatus.message}</p>
              </div>
            )}
            
            {analysis.dehydrationRisk && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  Low urine output detected. Please ensure adequate hydration and consult a pediatrician if concerns persist.
                </p>
              </div>
            )}
            
            {analysis.diarrheaRisk && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700">
                  Frequent loose stools detected. Please monitor closely and consult a pediatrician if symptoms worsen.
                </p>
              </div>
            )}

            {!analysis.dehydrationRisk && !analysis.diarrheaRisk && weightStatus?.status === 'normal' && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  Great! Your baby&apos;s patterns look healthy. Keep up the good work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
