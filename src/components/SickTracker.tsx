'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addSickEntry, updateSickEntry, removeSickEntry } from '@/store/slices/appSlice';
import { SickEntry, SickSymptom } from '@/types';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/utils/cn';
import { Plus, Edit2, Trash2, Calendar, Heart } from 'lucide-react';

const SYMPTOM_TYPES = [
  { value: 'fever', label: 'fever' },
  { value: 'vomit', label: 'vomit' },
  { value: 'weak', label: 'weak' },
  { value: 'dizzy', label: 'dizzy' },
  { value: 'cough', label: 'cough' },
  { value: 'runny_nose', label: 'runnyNose' },
  { value: 'rash', label: 'rash' },
  { value: 'diarrhea', label: 'diarrhea' },
  { value: 'constipation', label: 'constipation' },
  { value: 'other', label: 'other' },
] as const;

const SEVERITY_LEVELS = [
  { value: 'mild', label: 'mild' },
  { value: 'moderate', label: 'moderate' },
  { value: 'severe', label: 'severe' },
] as const;

export default function SickTracker() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, dailyRecords } = useAppSelector((state) => state.app);
  const { t } = useI18n();
  
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SickEntry | null>(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    symptoms: [] as SickSymptom[],
    notes: '',
  });

  const currentProfileRecords = selectedProfileId ? dailyRecords[selectedProfileId] || [] : [];
  const sickEntries = currentProfileRecords.flatMap(record => record.sickEntries || []);
  const uniqueSickEntries = sickEntries.filter((entry, index, self) => 
    index === self.findIndex(e => e.id === entry.id)
  );

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        startDate: editingEntry.startDate,
        endDate: editingEntry.endDate,
        symptoms: editingEntry.symptoms,
        notes: editingEntry.notes || '',
      });
      setShowForm(true);
    }
  }, [editingEntry]);

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      symptoms: [],
      notes: '',
    });
    setShowForm(false);
    setEditingEntry(null);
  };

  const addSymptom = () => {
    const newSymptom: SickSymptom = {
      id: Date.now().toString(),
      type: 'fever',
      severity: 'mild',
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, newSymptom],
    }));
  };

  const updateSymptom = (index: number, field: keyof SickSymptom, value: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map((symptom, i) => 
        i === index ? { ...symptom, [field]: value } : symptom
      ),
    }));
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfileId || formData.symptoms.length === 0) return;

    const entry: SickEntry = {
      id: editingEntry?.id || Date.now().toString(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      symptoms: formData.symptoms,
      notes: formData.notes,
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
    };

    if (editingEntry) {
      dispatch(updateSickEntry({ profileId: selectedProfileId, entry }));
    } else {
      dispatch(addSickEntry({ profileId: selectedProfileId, entry }));
    }

    resetForm();
  };

  const handleDelete = (entryId: string) => {
    if (!selectedProfileId) return;
    dispatch(removeSickEntry({ profileId: selectedProfileId, entryId }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getSymptomLabel = (type: string) => {
    return t(type as keyof typeof t);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'severe': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('sickTracking')}</h1>
          <p className="text-gray-600">{t('sickHistory')}</p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mb-6 hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addSickEntry')}
        </button>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  {editingEntry ? t('editSickEntry') : t('addSickEntry')}
                </h2>

                {/* Date Range */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('startDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('endDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('symptoms')}
                    </label>
                    <button
                      type="button"
                      onClick={addSymptom}
                      className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                    >
                      + {t('addSymptom')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.symptoms.map((symptom, index) => (
                      <div key={symptom.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {t('symptomType')}
                            </label>
                            <select
                              value={symptom.type}
                              onChange={(e) => updateSymptom(index, 'type', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            >
                              {SYMPTOM_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                  {getSymptomLabel(type.label)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {t('severity')}
                            </label>
                            <select
                              value={symptom.severity}
                              onChange={(e) => updateSymptom(index, 'severity', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            >
                              {SEVERITY_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>
                                  {t(level.label as keyof typeof t)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={t('notes') + ' (optional)'}
                            value={symptom.notes || ''}
                            onChange={(e) => updateSymptom(index, 'notes', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeSymptom(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    rows={3}
                    placeholder={t('additionalNotes')}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={formData.symptoms.length === 0}
                    className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {editingEntry ? t('save') : t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sick Entries List */}
        <div className="space-y-4">
          {uniqueSickEntries.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">{t('noSickData')}</p>
              <p className="text-gray-400 text-sm">{t('noSickPeriodsRecorded')}</p>
            </div>
          ) : (
            uniqueSickEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {entry.symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {getSymptomLabel(symptom.type)}
                      </span>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getSeverityColor(symptom.severity)
                      )}>
                        {t(symptom.severity as keyof typeof t)}
                      </span>
                      {symptom.notes && (
                        <span className="text-xs text-gray-500">- {symptom.notes}</span>
                      )}
                    </div>
                  ))}
                </div>

                {entry.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
