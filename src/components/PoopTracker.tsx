'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addDiaperEntry, removeDiaperEntry } from '@/store/slices/appSlice';
import { DiaperEntry } from '@/types';
import { Plus, Baby, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/calculations';
import { ColorButtonGroup, RadioGroup, Textarea } from '@/components/ui/Input';
import QuickCounter from './QuickCounter';

export default function PoopTracker() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, profiles, dailyRecords } = useAppSelector((state) => state.app);
  const [showAddForm, setShowAddForm] = useState(false);
  const [poopColor, setPoopColor] = useState<'yellow' | 'green' | 'brown' | 'red' | 'white' | 'black'>('brown');
  const [poopConsistency, setPoopConsistency] = useState<'normal' | 'mucus' | 'blood'>('normal');
  const [notes, setNotes] = useState('');

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileDailyRecords = selectedProfile ? dailyRecords[selectedProfile.id] || [] : [];
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = profileDailyRecords.find(record => record.date === today);
  const todayDiaperEntries = todayRecord?.diaperEntries || [];
  const todayPoopEntries = todayDiaperEntries.filter(entry => entry.poopCount > 0);
  const todayPoopCount = todayRecord?.poopCount || 0;

  const handleQuickIncrement = () => {
    if (!selectedProfile) return;

    const poopEntry: DiaperEntry = {
      id: Date.now().toString(),
      date: today,
      type: 'poop',
      peeCount: 0,
      poopCount: 1,
      poopColor: 'brown',
      poopConsistency: 'normal',
      createdAt: new Date().toISOString()
    };

    dispatch(addDiaperEntry({ profileId: selectedProfile.id, entry: poopEntry }));
  };

  const handleQuickDecrement = () => {
    if (!selectedProfile || todayPoopCount <= 0) return;

    // Remove the last poop entry
    const lastPoopEntry = todayPoopEntries[todayPoopEntries.length - 1];
    if (lastPoopEntry) {
      dispatch(removeDiaperEntry({ profileId: selectedProfile.id, entryId: lastPoopEntry.id }));
    }
  };

  const handleAddWithDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    const poopEntry: DiaperEntry = {
      id: Date.now().toString(),
      date: today,
      type: 'poop',
      peeCount: 0,
      poopCount: 1,
      poopColor,
      poopConsistency,
      notes: notes || undefined,
      createdAt: new Date().toISOString()
    };

    dispatch(addDiaperEntry({ profileId: selectedProfile.id, entry: poopEntry }));

    setNotes('');
    setPoopColor('brown');
    setPoopConsistency('normal');
    setShowAddForm(false);
  };

  const handleRemoveEntry = (entryId: string) => {
    if (!selectedProfile) return;
    
    if (confirm('Are you sure you want to remove this entry?')) {
      dispatch(removeDiaperEntry({ profileId: selectedProfile.id, entryId }));
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Baby className="w-6 h-6 mr-2 text-amber-500" />
            Poop Tracking
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Counter */}
        <div className="mb-6">
          <QuickCounter
            type="poop"
            count={todayPoopCount}
            onIncrement={handleQuickIncrement}
            onDecrement={handleQuickDecrement}
            onEdit={() => setShowAddForm(true)}
          />
        </div>

        {/* Recent Entries */}
        {todayPoopEntries.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-amber-500" />
              Today's Entries
            </h3>
            <div className="space-y-3">
              {todayPoopEntries.slice().reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Baby className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Poop recorded
                      </p>
                      <p className="text-xs text-gray-600">{formatTime(entry.createdAt)}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
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
                        {entry.notes && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {entry.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEntry(entry.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Details Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Poop Entry</h2>
              <form onSubmit={handleAddWithDetails} className="space-y-4">
                <ColorButtonGroup
                  label="Poop Color"
                  value={poopColor}
                      onChange={(value) => setPoopColor(value as 'yellow' | 'green' | 'brown' | 'red' | 'white' | 'black')}
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
                      onChange={(value) => setPoopConsistency(value as 'normal' | 'mucus' | 'blood')}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'mucus', label: 'Mucus' },
                    { value: 'blood', label: 'Blood' }
                  ]}
                />

                <Textarea
                  label="Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about this poop..."
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
                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Add Entry
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
