'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addDiaperEntry } from '@/store/slices/appSlice';
import { DiaperEntry } from '@/types';
import { Plus, Droplets, Baby, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { analyzeDiaperPatterns, formatTime } from '@/utils/calculations';
import { ButtonGroup, ColorButtonGroup, Counter, Textarea, RadioGroup } from '@/components/ui/Input';

export default function DiaperTracker() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, profiles, dailyRecords } = useAppSelector((state) => state.app);
  const [showAddForm, setShowAddForm] = useState(false);
  const [diaperType, setDiaperType] = useState<'pee' | 'poop' | 'both'>('both');
  const [peeCount, setPeeCount] = useState(1);
  const [poopCount, setPoopCount] = useState(1);
  const [poopColor, setPoopColor] = useState<'yellow' | 'green' | 'brown' | 'red' | 'white' | 'black'>('brown');
  const [poopConsistency, setPoopConsistency] = useState<'normal' | 'mucus' | 'blood'>('normal');
  const [notes, setNotes] = useState('');

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileDailyRecords = selectedProfile ? dailyRecords[selectedProfile.id] || [] : [];
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = profileDailyRecords.find(record => record.date === today);
  const todayDiaperEntries = todayRecord?.diaperEntries || [];
  
  const allDiaperEntries = profileDailyRecords.flatMap(record => record.diaperEntries);
  const analysis = analyzeDiaperPatterns(allDiaperEntries);

  const handleAddDiaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    const diaperEntry: DiaperEntry = {
      id: Date.now().toString(),
      date: today,
      type: diaperType,
      peeCount: diaperType === 'pee' || diaperType === 'both' ? peeCount : 0,
      poopCount: diaperType === 'poop' || diaperType === 'both' ? poopCount : 0,
      poopColor: (diaperType === 'poop' || diaperType === 'both') ? poopColor : undefined,
      poopConsistency: (diaperType === 'poop' || diaperType === 'both') ? poopConsistency : undefined,
      notes: notes || undefined,
      createdAt: new Date().toISOString()
    };

    dispatch(addDiaperEntry({ profileId: selectedProfile.id, entry: diaperEntry }));

    // Reset form
    setDiaperType('both');
    setPeeCount(1);
    setPoopCount(1);
    setPoopColor('brown');
    setPoopConsistency('normal');
    setNotes('');
    setShowAddForm(false);
  };

  const getTodayStats = () => {
    const peeTotal = todayDiaperEntries.reduce((sum, entry) => sum + entry.peeCount, 0);
    const poopTotal = todayDiaperEntries.reduce((sum, entry) => sum + entry.poopCount, 0);
    return { peeTotal, poopTotal };
  };

  const todayStats = getTodayStats();

  const getColorClass = (color: string) => {
    const colorMap = {
      yellow: 'bg-yellow-200 text-yellow-800',
      green: 'bg-green-200 text-green-800',
      brown: 'bg-amber-200 text-amber-800',
      red: 'bg-red-200 text-red-800',
      white: 'bg-gray-200 text-gray-800',
      black: 'bg-gray-800 text-white'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Diaper Tracking</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pee Today</p>
                <p className="text-2xl font-bold">{todayStats.peeTotal}</p>
                <p className="text-blue-100 text-xs">times</p>
              </div>
              <Droplets className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Poop Today</p>
                <p className="text-2xl font-bold">{todayStats.poopTotal}</p>
                <p className="text-amber-100 text-xs">times</p>
              </div>
              <Baby className="w-8 h-8 text-amber-200" />
            </div>
          </div>
        </div>

        {/* Health Alerts */}
        {(analysis.dehydrationRisk || analysis.diarrheaRisk) && (
          <div className="space-y-3 mb-6">
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
          </div>
        )}

        {/* Pattern Analysis */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Pattern Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pee Frequency:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
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
                'px-2 py-1 rounded-full text-xs font-medium',
                analysis.poopFrequency === 'normal' && 'bg-green-100 text-green-800',
                analysis.poopFrequency === 'diarrhea' && 'bg-red-100 text-red-800',
                analysis.poopFrequency === 'constipation' && 'bg-yellow-100 text-yellow-800'
              )}>
                {analysis.poopFrequency}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        {todayDiaperEntries.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Today's Entries</h3>
            <div className="space-y-3">
              {todayDiaperEntries.slice().reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {entry.peeCount > 0 && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Droplets className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                      {entry.poopCount > 0 && (
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                          <Baby className="w-3 h-3 text-amber-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {entry.peeCount > 0 && `${entry.peeCount} pee`}
                        {entry.peeCount > 0 && entry.poopCount > 0 && ', '}
                        {entry.poopCount > 0 && `${entry.poopCount} poop`}
                      </p>
                      <p className="text-xs text-gray-600">{formatTime(entry.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {entry.poopColor && (
                      <span className={cn('text-xs px-2 py-1 rounded-full', getColorClass(entry.poopColor))}>
                        {entry.poopColor}
                      </span>
                    )}
                    {entry.poopConsistency && entry.poopConsistency !== 'normal' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {entry.poopConsistency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Diaper Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Diaper Entry</h2>
              <form onSubmit={handleAddDiaper} className="space-y-4">
                <ButtonGroup
                  label="Type"
                  value={diaperType}
                  onChange={(value) => setDiaperType(value as 'pee' | 'poop' | 'both')}
                  options={[
                    { value: 'pee', label: 'Pee' },
                    { value: 'poop', label: 'Poop' },
                    { value: 'both', label: 'Both' }
                  ]}
                />

                {(diaperType === 'pee' || diaperType === 'both') && (
                  <Counter
                    label="Pee Count"
                    value={peeCount}
                    onChange={setPeeCount}
                    min={1}
                  />
                )}

                {(diaperType === 'poop' || diaperType === 'both') && (
                  <>
                    <Counter
                      label="Poop Count"
                      value={poopCount}
                      onChange={setPoopCount}
                      min={1}
                    />

                    <ColorButtonGroup
                      label="Poop Color"
                      value={poopColor}
                      onChange={(value) => setPoopColor(value as any)}
                      options={[
                        { value: 'yellow', label: 'Yellow', color: 'yellow' },
                        { value: 'green', label: 'Green', color: 'green' },
                        { value: 'brown', label: 'Brown', color: 'brown' },
                        { value: 'red', label: 'Red', color: 'red' },
                        { value: 'white', label: 'White', color: 'white' },
                        { value: 'black', label: 'Black', color: 'black' }
                      ]}
                    />

                    <RadioGroup
                      label="Poop Consistency"
                      name="consistency"
                      value={poopConsistency}
                      onChange={(value) => setPoopConsistency(value as any)}
                      options={[
                        { value: 'normal', label: 'Normal' },
                        { value: 'mucus', label: 'Mucus' },
                        { value: 'blood', label: 'Blood' }
                      ]}
                    />
                  </>
                )}

                <Textarea
                  label="Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any additional notes..."
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
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
