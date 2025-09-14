'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Scale, Baby, Heart, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateWeightGain, analyzeDiaperPatterns, groupByWeek, groupByMonth, formatDate, calculateDetailedAge, formatDetailedAge } from '@/utils/calculations';
import { getWeightStatus, calculateAgeInMonths } from '@/data/babyStandards';
import { useI18n } from '@/context/I18nContext';

type DataType = 'weight' | 'diaper' | 'sick';
type TimePeriod = 'weekly' | 'monthly';

export default function SummaryDashboard() {
  const [activeDataType, setActiveDataType] = useState<DataType>('weight');
  const [activeTimePeriod, setActiveTimePeriod] = useState<TimePeriod>('weekly');
  const { selectedProfileId, profiles, dailyRecords } = useAppSelector((state) => state.app);
  const { t } = useI18n();
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileDailyRecords = selectedProfile ? dailyRecords[selectedProfile.id] || [] : [];
  
  const weightEntries = profileDailyRecords
    .filter(record => record.weight)
    .map(record => record.weight!)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const allDiaperEntries = profileDailyRecords.flatMap(record => record.diaperEntries);
  const analysis = analyzeDiaperPatterns(allDiaperEntries);

  // Sick data analysis
  const allSickEntries = profileDailyRecords.flatMap(record => record.sickEntries || []);
  const uniqueSickEntries = allSickEntries.filter((entry, index, self) => 
    index === self.findIndex(e => e.id === entry.id)
  );

  // Calculate sick statistics
  const totalSickDays = uniqueSickEntries.reduce((total, entry) => {
    const startDate = new Date(entry.startDate);
    const endDate = new Date(entry.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return total + diffDays;
  }, 0);

  const sickPeriods = uniqueSickEntries.length;
  const avgSickDuration = sickPeriods > 0 ? Math.round(totalSickDays / sickPeriods) : 0;

  // Symptom frequency analysis
  const symptomFrequency = uniqueSickEntries.flatMap(entry => entry.symptoms)
    .reduce((acc, symptom) => {
      acc[symptom.type] = (acc[symptom.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const symptomChartData = Object.entries(symptomFrequency).map(([type, count]) => ({
    name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    color: getSymptomColor(type)
  }));

  function getSymptomColor(type: string) {
    const colors = {
      fever: '#ef4444',
      vomit: '#f97316',
      weak: '#eab308',
      dizzy: '#84cc16',
      cough: '#22c55e',
      runny_nose: '#06b6d4',
      rash: '#8b5cf6',
      diarrhea: '#ec4899',
      constipation: '#6b7280',
      other: '#9ca3af'
    };
    return colors[type as keyof typeof colors] || '#9ca3af';
  }

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
  const detailedAge = calculateDetailedAge(new Date(selectedProfile.dateOfBirth));
  const weightGain = calculateWeightGain(weightEntries, ageInMonths);
  const latestWeight = weightEntries[weightEntries.length - 1];
  const weightStatus = latestWeight ? getWeightStatus(latestWeight.weight, ageInMonths, selectedProfile.gender, selectedProfile.birthWeight) : null;

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

  // Prepare chart data based on active data type and time period
  const getChartData = () => {
    if (activeDataType === 'weight') {
      if (activeTimePeriod === 'weekly') {
        return Object.entries(groupByWeek(profileDailyRecords)).map(([week, records]) => {
          const weightEntries = records.filter(r => r.weight).map(r => r.weight!);
          const avgWeight = weightEntries.length > 0 
            ? weightEntries.reduce((sum, w) => sum + w.weight, 0) / weightEntries.length 
            : 0;
          return {
            period: week.split('-W')[1],
            value: avgWeight,
            label: 'Weight (g)'
          };
        }).slice(-8);
      } else {
        return Object.entries(groupByMonth(profileDailyRecords)).map(([month, records]) => {
          const weightEntries = records.filter(r => r.weight).map(r => r.weight!);
          const avgWeight = weightEntries.length > 0 
            ? weightEntries.reduce((sum, w) => sum + w.weight, 0) / weightEntries.length 
            : 0;
          return {
            period: month.split('-')[1],
            value: avgWeight,
            label: 'Weight (g)'
          };
        }).slice(-6);
      }
    } else if (activeDataType === 'diaper') {
      if (activeTimePeriod === 'weekly') {
        return Object.entries(groupByWeek(profileDailyRecords)).map(([week, records]) => {
          const peeTotal = records.reduce((sum, record) => sum + record.peeCount, 0);
          const poopTotal = records.reduce((sum, record) => sum + record.poopCount, 0);
          return {
            period: week.split('-W')[1],
            pee: peeTotal,
            poop: poopTotal
          };
        }).slice(-8);
      } else {
        return Object.entries(groupByMonth(profileDailyRecords)).map(([month, records]) => {
          const peeTotal = records.reduce((sum, record) => sum + record.peeCount, 0);
          const poopTotal = records.reduce((sum, record) => sum + record.poopCount, 0);
          return {
            period: month.split('-')[1],
            pee: peeTotal,
            poop: poopTotal
          };
        }).slice(-6);
      }
    } else { // sick
      if (activeTimePeriod === 'weekly') {
        return Object.entries(groupByWeek(profileDailyRecords)).map(([week, records]) => {
          const sickDays = records.filter(record => record.sickEntries && record.sickEntries.length > 0).length;
          return {
            period: week.split('-W')[1],
            value: sickDays,
            label: 'Sick Days'
          };
        }).slice(-8);
      } else {
        return Object.entries(groupByMonth(profileDailyRecords)).map(([month, records]) => {
          const sickDays = records.filter(record => record.sickEntries && record.sickEntries.length > 0).length;
          return {
            period: month.split('-')[1],
            value: sickDays,
            label: 'Sick Days'
          };
        }).slice(-6);
      }
    }
  };

  const chartData = getChartData();

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Summary Dashboard</h1>

        {/* Profile Info */}
        <div className="bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl p-4 text-white mb-6">
          <h2 className="text-lg font-semibold mb-1">{selectedProfile.name}</h2>
          <p className="text-pink-100 text-sm">
            {formatDetailedAge(detailedAge, t)} • {selectedProfile.gender === 'male' ? 'Boy' : 'Girl'}
          </p>
        </div>

        {/* Data Type Tabs */}
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-4">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveDataType('weight')}
              className={cn(
                'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                activeDataType === 'weight'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Scale className="w-4 h-4 mx-auto mb-1" />
              Weight
            </button>
            <button
              onClick={() => setActiveDataType('diaper')}
              className={cn(
                'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                activeDataType === 'diaper'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Baby className="w-4 h-4 mx-auto mb-1" />
              Diaper
            </button>
            <button
              onClick={() => setActiveDataType('sick')}
              className={cn(
                'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                activeDataType === 'sick'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Heart className="w-4 h-4 mx-auto mb-1" />
              Sick
            </button>
          </div>
        </div>

        {/* Time Period Tabs */}
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTimePeriod('weekly')}
              className={cn(
                'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                activeTimePeriod === 'weekly'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <BarChart3 className="w-4 h-4 mx-auto mb-1" />
              Weekly
            </button>
            <button
              onClick={() => setActiveTimePeriod('monthly')}
              className={cn(
                'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                activeTimePeriod === 'monthly'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <TrendingUp className="w-4 h-4 mx-auto mb-1" />
              Monthly
            </button>
          </div>
        </div>

        {/* Dynamic Content Based on Active Tabs */}
        <div className="space-y-4 mb-6">
          {/* Chart Section */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                {activeDataType === 'weight' && <Scale className="w-5 h-5 mr-2 text-pink-500" />}
                {activeDataType === 'diaper' && <Baby className="w-5 h-5 mr-2 text-blue-500" />}
                {activeDataType === 'sick' && <Heart className="w-5 h-5 mr-2 text-red-500" />}
                {activeDataType === 'weight' && 'Weight Trend'}
                {activeDataType === 'diaper' && 'Diaper Activity'}
                {activeDataType === 'sick' && 'Sick Days'}
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  {activeDataType === 'weight' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#ec4899" 
                        strokeWidth={2}
                        dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  ) : activeDataType === 'diaper' ? (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pee" fill="#3b82f6" name="Pee" />
                      <Bar dataKey="poop" fill="#f59e0b" name="Poop" />
                    </BarChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ef4444" name="Sick Days" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              {activeDataType === 'weight' && <Scale className="w-5 h-5 mr-2 text-pink-500" />}
              {activeDataType === 'diaper' && <Baby className="w-5 h-5 mr-2 text-blue-500" />}
              {activeDataType === 'sick' && <Heart className="w-5 h-5 mr-2 text-red-500" />}
              {activeDataType === 'weight' && 'Weight Analysis'}
              {activeDataType === 'diaper' && 'Diaper Analysis'}
              {activeDataType === 'sick' && 'Sick Analysis'}
            </h3>
            
            {activeDataType === 'weight' && latestWeight && weightStatus && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Weight:</span>
                  <span className="text-xl font-bold text-gray-800">{latestWeight.weight}g</span>
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
                  <span className="font-bold text-gray-800">{weightStatus.percentile}th</span>
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

            {activeDataType === 'diaper' && (
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
            )}

            {activeDataType === 'sick' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-red-600">{sickPeriods}</p>
                    <p className="text-xs text-red-600 font-medium">Sick Periods</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-orange-600">{totalSickDays}</p>
                    <p className="text-xs text-orange-600 font-medium">Total Days</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-yellow-600">{avgSickDuration}</p>
                    <p className="text-xs text-yellow-600 font-medium">Avg Duration</p>
                  </div>
                </div>

                {symptomChartData.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Most Common Symptoms</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={symptomChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={20}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {symptomChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
