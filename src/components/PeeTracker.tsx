'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DiaperEntry } from '@/types';
import { 
  addDiaperEntry, 
  updateDiaperEntry, 
  removeDiaperEntry
} from '@/store/slices/appSlice';
import { Plus, Droplets, Clock, Trash2, Edit } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/calculations';
import QuickCounter from './QuickCounter';

export default function PeeTracker() {
  const dispatch = useAppDispatch();
  const { profiles, selectedProfileId, dailyRecords } = useAppSelector(state => state.app);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaperEntry | null>(null);
  const [notes, setNotes] = useState('');

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileDailyRecords = selectedProfile ? dailyRecords[selectedProfile.id] || [] : [];
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = profileDailyRecords.find(record => record.date === today);
  const todayDiaperEntries = todayRecord?.diaperEntries || [];
  const todayPeeEntries = todayDiaperEntries.filter(entry => entry.peeCount > 0);
  const todayPeeCount = todayRecord?.peeCount || 0;


  const handleQuickIncrement = () => {
    if (!selectedProfile) return;

    const peeEntry: DiaperEntry = {
      id: Date.now().toString(),
      date: today,
      type: 'pee',
      peeCount: 1,
      poopCount: 0,
      createdAt: new Date().toISOString()
    };

    dispatch(addDiaperEntry({ profileId: selectedProfile.id, entry: peeEntry }));
  };

  const handleQuickDecrement = () => {
    if (!selectedProfile || todayPeeCount <= 0) return;

    // Remove the last pee entry
    const lastPeeEntry = todayPeeEntries[todayPeeEntries.length - 1];
    if (lastPeeEntry) {
      dispatch(removeDiaperEntry({ profileId: selectedProfile.id, entryId: lastPeeEntry.id }));
    }
  };

  const handleAddWithDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    const peeEntry: DiaperEntry = {
      id: Date.now().toString(),
      date: today,
      type: 'pee',
      peeCount: 1,
      poopCount: 0,
      notes: notes || undefined,
      createdAt: new Date().toISOString()
    };

    dispatch(addDiaperEntry({ profileId: selectedProfile.id, entry: peeEntry }));

    setNotes('');
    setShowAddForm(false);
  };

  const handleRemoveEntry = (entryId: string) => {
    if (!selectedProfile) return;
    
    if (confirm('Are you sure you want to remove this entry?')) {
      dispatch(removeDiaperEntry({ profileId: selectedProfile.id, entryId }));
    }
  };

  const handleEditEntry = (entry: DiaperEntry) => {
    setEditingEntry(entry);
    setNotes(entry.notes || '');
    setShowAddForm(true);
  };

  const handleUpdateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !editingEntry) return;

    const updatedEntry: DiaperEntry = {
      ...editingEntry,
      notes: notes || undefined,
    };

    dispatch(updateDiaperEntry({ profileId: selectedProfile.id, entry: updatedEntry }));

    setNotes('');
    setEditingEntry(null);
    setShowAddForm(false);
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Droplets className="w-6 h-6 mr-2 text-blue-500" />
            Pee Tracking
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Counter */}
        <div className="mb-6">
          <QuickCounter
            type="pee"
            count={todayPeeCount}
            onIncrement={handleQuickIncrement}
            onDecrement={handleQuickDecrement}
            onEdit={() => setShowAddForm(true)}
          />
        </div>

        {/* Recent Entries */}
        {todayPeeEntries.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Today's Entries
            </h3>
            <div className="space-y-3">
              {todayPeeEntries.slice().reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Pee recorded
                      </p>
                      <p className="text-xs text-gray-600">{formatTime(entry.createdAt)}</p>
                      {entry.notes && (
                        <p className="text-xs text-gray-500 mt-1 bg-gray-50 px-2 py-1 rounded">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit entry"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveEntry(entry.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Details Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {editingEntry ? 'Edit Pee Entry' : 'Add Pee Entry'}
              </h2>
              <form onSubmit={editingEntry ? handleUpdateEntry : handleAddWithDetails} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 shadow-md transition-colors resize-none"
                    rows={3}
                    placeholder="Add any notes about this pee..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingEntry(null);
                      setNotes('');
                    }}
                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingEntry ? 'Update Entry' : 'Add Entry'}
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
