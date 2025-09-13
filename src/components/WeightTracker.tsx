'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addWeightEntry } from '@/store/slices/appSlice';
import { WeightEntry } from '@/types';
import { Plus, TrendingUp, Calendar, Scale } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateWeightGain, formatDate } from '@/utils/calculations';
import { getWeightStatus, calculateAgeInMonths } from '@/data/babyStandards';
import { Input } from '@/components/ui/Input';

export default function WeightTracker() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, profiles, dailyRecords } = useAppSelector((state) => state.app);
  const [showAddForm, setShowAddForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileDailyRecords = selectedProfile ? dailyRecords[selectedProfile.id] || [] : [];
  const weightEntries = profileDailyRecords
    .filter(record => record.weight)
    .map(record => record.weight!)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !selectedProfile) return;

    const weightEntry: WeightEntry = {
      id: Date.now().toString(),
      date,
      weight: parseFloat(weight),
      createdAt: new Date().toISOString()
    };

    dispatch(addWeightEntry({ profileId: selectedProfile.id, entry: weightEntry }));

    setWeight('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  const getTodayWeight = () => {
    const today = new Date().toISOString().split('T')[0];
    return weightEntries.find(entry => entry.date === today);
  };

  const getWeightAnalysis = () => {
    if (!selectedProfile || weightEntries.length === 0) return null;

    const ageInMonths = calculateAgeInMonths(new Date(selectedProfile.dateOfBirth));
    const latestWeight = weightEntries[weightEntries.length - 1];
    const weightStatus = getWeightStatus(latestWeight.weight, ageInMonths, selectedProfile.gender);
    const weightGain = calculateWeightGain(weightEntries, ageInMonths);

    return { weightStatus, weightGain, latestWeight };
  };

  const analysis = getWeightAnalysis();
  const todayWeight = getTodayWeight();

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Weight Tracking</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Today's Weight */}
        {todayWeight ? (
          <div className="bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Today's Weight</p>
                <p className="text-3xl font-bold">{todayWeight.weight} kg</p>
                <p className="text-pink-100 text-sm">
                  {formatDate(todayWeight.date)}
                </p>
              </div>
              <Scale className="w-12 h-12 text-pink-200" />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center mb-6">
            <Scale className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No weight recorded today</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-pink-600 font-medium hover:text-pink-700"
            >
              Add today's weight
            </button>
          </div>
        )}

        {/* Weight Analysis */}
        {analysis && (
          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pink-500" />
                Weight Status
              </h3>
              <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={cn(
                      'font-medium',
                      analysis.weightStatus.status === 'normal' && 'text-green-600',
                      analysis.weightStatus.status === 'underweight' && 'text-yellow-600',
                      analysis.weightStatus.status === 'overweight' && 'text-orange-600',
                      analysis.weightStatus.status === 'belowStandard' && 'text-red-600',
                      !analysis.weightStatus && 'text-gray-600'
                    )}>
                      {analysis.weightStatus ? analysis.weightStatus.status.replace(/([A-Z])/g, ' $1').toLowerCase() : 'Not recorded'}
                    </span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentile:</span>
                  <span className="font-medium">{analysis.weightStatus.percentile}th</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{analysis.weightStatus.message}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Weight Gain</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600">{analysis.weightGain.daily}g</p>
                  <p className="text-xs text-gray-600">Daily</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analysis.weightGain.weekly}g</p>
                  <p className="text-xs text-gray-600">Weekly</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analysis.weightGain.monthly}g</p>
                  <p className="text-xs text-gray-600">Monthly</p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className={cn(
                  'text-sm font-medium px-2 py-1 rounded-full',
                  analysis.weightGain.status === 'excellent' && 'bg-green-100 text-green-800',
                  analysis.weightGain.status === 'good' && 'bg-blue-100 text-blue-800',
                  analysis.weightGain.status === 'needsAttention' && 'bg-yellow-100 text-yellow-800'
                )}>
                  {analysis.weightGain.status.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Weight History */}
        {weightEntries.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-pink-500" />
              Recent Entries
            </h3>
            <div className="space-y-2">
              {weightEntries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{entry.weight} kg</p>
                    <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
                  </div>
                  {entry.date === new Date().toISOString().split('T')[0] && (
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Weight Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Weight Entry</h2>
              <form onSubmit={handleAddWeight} className="space-y-4">
                <Input
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight"
                  required
                />
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
