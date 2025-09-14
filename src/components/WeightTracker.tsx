'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addWeightEntry, updateWeightEntry, deleteWeightEntry } from '@/store/slices/appSlice';
import { WeightEntry } from '@/types';
import { Plus, TrendingUp, Calendar, Scale, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateWeightGain, formatDate, calculateDetailedAge, formatDetailedAge } from '@/utils/calculations';
import { getWeightStatus, calculateAgeInMonths } from '@/data/babyStandards';
import { Input } from '@/components/ui/Input';
import WHOGrowthChart from './WHOGrowthChart';
import InfoModal, { InfoIcon, getCategoryInfo, getGrowthStatusInfo } from './InfoModal';
import { useI18n } from '@/context/I18nContext';

export default function WeightTracker() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, profiles, dailyRecords } = useAppSelector((state) => state.app);
  const { t } = useI18n();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<React.ReactNode>(null);
  const [infoModalTitle, setInfoModalTitle] = useState('');

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
      id: editingEntry ? editingEntry.id : Date.now().toString(),
      date,
      weight: parseFloat(weight),
      createdAt: editingEntry ? editingEntry.createdAt : new Date().toISOString()
    };

    if (editingEntry) {
      dispatch(updateWeightEntry({ profileId: selectedProfile.id, entry: weightEntry }));
    } else {
      dispatch(addWeightEntry({ profileId: selectedProfile.id, entry: weightEntry }));
    }

    setWeight('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
    setEditingEntry(null);
  };

  const handleEditWeight = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setWeight(entry.weight.toString());
    setDate(entry.date);
    setShowAddForm(true);
  };

  const handleDeleteWeight = (entryId: string) => {
    if (!selectedProfile) return;
    if (confirm('Are you sure you want to delete this weight entry?')) {
      dispatch(deleteWeightEntry({ profileId: selectedProfile.id, entryId }));
    }
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setWeight('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  const handleShowCategoryInfo = (category: string) => {
    const info = getCategoryInfo(category, t);
    setInfoModalTitle(t('weight.category'));
    setInfoModalContent(info);
    setShowInfoModal(true);
  };

  const handleShowGrowthStatusInfo = (status: string) => {
    const info = getGrowthStatusInfo(status, t);
    setInfoModalTitle(t('weight.growthStatus'));
    setInfoModalContent(info);
    setShowInfoModal(true);
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'ideal': t('weight.ideal'),
      'batas_bawah': t('weight.batasBawah'),
      'batas_atas': t('weight.batasAtas'),
      'overweight': t('weight.overweight'),
      'kurang_gizi': t('weight.kurangGizi')
    };
    return categoryMap[category] || category;
  };

  const getGrowthStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'excellent': t('weight.sangatBaik'),
      'good': t('weight.baik'),
      'needsAttention': t('weight.perluPerhatian'),
      'concerning': t('weight.mengkhawatirkan')
    };
    return statusMap[status] || status;
  };

  const getTodayWeight = () => {
    const today = new Date().toISOString().split('T')[0];
    return weightEntries.find(entry => entry.date === today);
  };

  const getWeightAnalysis = () => {
    if (!selectedProfile || weightEntries.length === 0) return null;

    const ageInMonths = calculateAgeInMonths(new Date(selectedProfile.dateOfBirth));
    const latestWeight = weightEntries[weightEntries.length - 1];
    const weightStatus = getWeightStatus(latestWeight.weight, ageInMonths, selectedProfile.gender, selectedProfile.birthWeight, t);
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
          <h1 className="text-2xl font-bold text-gray-800">{t('weight.status')}</h1>
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
                <p className="text-pink-100 text-sm">{t('weight.today')}</p>
                <p className="text-3xl font-bold">{todayWeight.weight}g</p>
                <p className="text-pink-100 text-sm">
                  {formatDate(todayWeight.date)}
                </p>
                {selectedProfile && (
                  <div className="mt-2 text-xs text-pink-200">
                    <p>{formatDetailedAge(calculateDetailedAge(new Date(selectedProfile.dateOfBirth)), t)}</p>
                    <p>{t('weight.birthWeight')}: {selectedProfile.birthWeight}g</p>
                  </div>
                )}
              </div>
              <Scale className="w-12 h-12 text-pink-200" />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center mb-6">
            <Scale className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">{t('noData')}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-pink-600 font-medium hover:text-pink-700"
            >
              {t('addFirstWeight')}
            </button>
          </div>
        )}

        {/* Weight Analysis */}
        {analysis && (
          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pink-500" />
                {t('weight.status')}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('weight.category')}:</span>
                  <div className="flex items-center">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      analysis.weightStatus.category === 'ideal' && 'bg-green-100 text-green-800',
                      analysis.weightStatus.category === 'batas_bawah' && 'bg-yellow-100 text-yellow-800',
                      analysis.weightStatus.category === 'batas_atas' && 'bg-blue-100 text-blue-800',
                      analysis.weightStatus.category === 'overweight' && 'bg-orange-100 text-orange-800',
                      analysis.weightStatus.category === 'kurang_gizi' && 'bg-red-100 text-red-800',
                      !analysis.weightStatus && 'bg-gray-200 text-gray-800'
                    )}>
                      {analysis.weightStatus ? getCategoryLabel(analysis.weightStatus.category) : t('weight.notRecorded')}
                    </span>
                    <InfoIcon 
                      onClick={() => handleShowCategoryInfo(analysis.weightStatus.category)}
                      className="ml-2"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('weight.percentile')}:</span>
                  <span className="font-bold text-gray-800">{analysis.weightStatus.percentile}th</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{analysis.weightStatus.message}</p>
                
                {/* Growth Status and Recommendations */}
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('weight.growthStatus')}:</span>
                    <div className="flex items-center">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        analysis.weightStatus.growthStatus === 'excellent' && 'bg-green-100 text-green-800',
                        analysis.weightStatus.growthStatus === 'good' && 'bg-blue-100 text-blue-800',
                        analysis.weightStatus.growthStatus === 'needsAttention' && 'bg-yellow-100 text-yellow-800',
                        analysis.weightStatus.growthStatus === 'concerning' && 'bg-red-100 text-red-800'
                      )}>
                        {getGrowthStatusLabel(analysis.weightStatus.growthStatus)}
                      </span>
                      <InfoIcon 
                        onClick={() => handleShowGrowthStatusInfo(analysis.weightStatus.growthStatus)}
                        className="ml-2"
                      />
                    </div>
                  </div>
                  
                  {analysis.weightStatus.weeklyTarget && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-medium text-blue-800 mb-2">{t('weight.targetMingguDepan')}</h4>
                      <p className="text-sm text-blue-700">
                        Target: <span className="font-bold">{(analysis.latestWeight.weight + analysis.weightStatus.weeklyTarget).toFixed(0)}g</span>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {t('weight.requiredIncrease')}: {analysis.weightStatus.weeklyTarget.toFixed(0)}g/{t('weight.perWeek')}
                      </p>
                    </div>
                  )}
                  
                  {analysis.weightStatus.timeToTarget && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-medium text-green-800 mb-2">{t('weight.proyeksiPertumbuhan')}</h4>
                      <p className="text-sm text-green-700">{analysis.weightStatus.timeToTarget}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-2">{t('weight.rekomendasi')}</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {analysis.weightStatus.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* WHO Growth Chart */}
            {analysis.weightStatus && selectedProfile && (
              <WHOGrowthChart
                currentWeight={analysis.latestWeight.weight}
                ageInMonths={calculateAgeInMonths(new Date(selectedProfile.dateOfBirth))}
                gender={selectedProfile.gender}
                birthWeight={selectedProfile.birthWeight}
                weightHistory={weightEntries.map(entry => ({
                  date: entry.date,
                  weight: entry.weight,
                  ageInMonths: calculateAgeInMonths(new Date(entry.date))
                }))}
              />
            )}

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
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{entry.weight}g</p>
                    <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {entry.date === new Date().toISOString().split('T')[0] && (
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                        Today
                      </span>
                    )}
                    <button
                      onClick={() => handleEditWeight(entry)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWeight(entry.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Weight Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {editingEntry ? 'Edit Weight Entry' : 'Add Weight Entry'}
              </h2>
              <form onSubmit={handleAddWeight} className="space-y-4">
                <Input
                  label="Weight (grams)"
                  type="number"
                  step="10"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight in grams"
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
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    {editingEntry ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Info Modal */}
        <InfoModal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title={infoModalTitle}
          content={infoModalContent}
        />
      </div>
    </div>
  );
}
