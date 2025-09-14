'use client';

import React from 'react';
import { X, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useI18n } from '@/context/I18nContext';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export default function InfoModal({ isOpen, onClose, title, content }: InfoModalProps) {
  const { t } = useI18n();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-700 space-y-3">
          {content}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

interface InfoIconProps {
  onClick: () => void;
  className?: string;
}

export function InfoIcon({ onClick, className }: InfoIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-1 text-gray-400 hover:text-blue-500 transition-colors",
        className
      )}
      title="Klik untuk informasi lebih detail"
    >
      <Info className="w-4 h-4" />
    </button>
  );
}

// Function to get category info based on language
export const getCategoryInfo = (category: string, t: (key: string) => string) => {
  const categoryMap: { [key: string]: React.ReactNode } = {
    ideal: (
      <div>
        <h3 className="font-semibold text-green-700 mb-2">{t('weight.ideal')}</h3>
        <p className="mb-2">{t('modal.babyWeightNormalHealthy')}</p>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-medium text-green-800 mb-1">{t('modal.range')}:</h4>
          <p className="text-green-700">15th - 85th percentile</p>
          <h4 className="font-medium text-green-800 mb-1 mt-2">{t('modal.meaning')}:</h4>
          <p className="text-green-700">{t('modal.babyWeightNormalHealthy')}</p>
        </div>
      </div>
    ),
    batas_bawah: (
      <div>
        <h3 className="font-semibold text-yellow-700 mb-2">{t('weight.batasBawah')}</h3>
        <p className="mb-2">{t('modal.babyWeightSlightlyBelow')}</p>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-1">{t('modal.range')}:</h4>
          <p className="text-yellow-700">3rd - 15th percentile</p>
          <h4 className="font-medium text-yellow-800 mb-1 mt-2">{t('modal.meaning')}:</h4>
          <p className="text-yellow-700">{t('modal.weightLessThanAverage')}</p>
        </div>
      </div>
    ),
    batas_atas: (
      <div>
        <h3 className="font-semibold text-blue-700 mb-2">{t('weight.batasAtas')}</h3>
        <p className="mb-2">{t('modal.babyWeightAboveAverage')}</p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1">{t('modal.range')}:</h4>
          <p className="text-blue-700">85th - 97th percentile</p>
          <h4 className="font-medium text-blue-800 mb-1 mt-2">{t('modal.meaning')}:</h4>
          <p className="text-blue-700">{t('modal.weightAboveAverage')}</p>
        </div>
      </div>
    ),
    overweight: (
      <div>
        <h3 className="font-semibold text-orange-700 mb-2">{t('weight.overweight')}</h3>
        <p className="mb-2">{t('modal.babyWeightExceedsStandard')}</p>
        <div className="bg-orange-50 p-3 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-1">{t('modal.range')}:</h4>
          <p className="text-orange-700">&gt; 97th percentile</p>
          <h4 className="font-medium text-orange-800 mb-1 mt-2">{t('modal.meaning')}:</h4>
          <p className="text-orange-700">{t('modal.weightFarAboveAverage')}</p>
        </div>
      </div>
    ),
    kurang_gizi: (
      <div>
        <h3 className="font-semibold text-red-700 mb-2">{t('weight.kurangGizi')}</h3>
        <p className="mb-2">{t('modal.babyWeightVeryLow')}</p>
        <div className="bg-red-50 p-3 rounded-lg">
          <h4 className="font-medium text-red-800 mb-1">{t('modal.range')}:</h4>
          <p className="text-red-700">&lt; 3rd percentile</p>
          <h4 className="font-medium text-red-800 mb-1 mt-2">{t('modal.meaning')}:</h4>
          <p className="text-red-700">{t('modal.weightVeryFarBelowAverage')}</p>
        </div>
      </div>
    )
  };
  
  return categoryMap[category] || <div>Category not found</div>;
};

export const getGrowthStatusInfo = (status: string, t: (key: string) => string) => {
  const statusMap: { [key: string]: React.ReactNode } = {
    excellent: (
      <div>
        <h3 className="font-semibold text-green-700 mb-2">{t('weight.growthStatus')}: {t('weight.sangatBaik')}</h3>
        <p className="mb-2">{t('modal.growthVeryGoodWho')}</p>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-medium text-green-800 mb-1">{t('modal.indicators')}:</h4>
          <ul className="text-green-700 space-y-1">
            <li>• {t('modal.weightInPercentile')}</li>
            <li>• {t('modal.weightGainOnTarget')}</li>
            <li>• {t('modal.growthConsistentStable')}</li>
          </ul>
          <h4 className="font-medium text-green-800 mb-1 mt-2">{t('modal.recommendations')}:</h4>
          <p className="text-green-700">{t('modal.maintainGoodEatingCare')}</p>
        </div>
      </div>
    ),
    good: (
      <div>
        <h3 className="font-semibold text-blue-700 mb-2">{t('weight.growthStatus')}: {t('weight.baik')}</h3>
        <p className="mb-2">{t('modal.growthGoodNormalRange')}</p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1">{t('modal.indicators')}:</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• {t('modal.weightInPercentile15_50')}</li>
            <li>• {t('modal.weightGainNearTarget')}</li>
            <li>• {t('modal.growthQuiteConsistent')}</li>
          </ul>
          <h4 className="font-medium text-blue-800 mb-1 mt-2">{t('modal.recommendations')}:</h4>
          <p className="text-blue-700">{t('modal.continueRoutineCare')}</p>
        </div>
      </div>
    ),
    needsAttention: (
      <div>
        <h3 className="font-semibold text-yellow-700 mb-2">{t('weight.growthStatus')}: {t('weight.perluPerhatian')}</h3>
        <p className="mb-2">{t('modal.growthNeedsSpecialAttention')}</p>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-1">{t('modal.indicators')}:</h4>
          <ul className="text-yellow-700 space-y-1">
            <li>• {t('modal.weightInPercentile3_15')}</li>
            <li>• {t('modal.weightGainBelowTarget')}</li>
            <li>• {t('modal.growthSlowInconsistent')}</li>
          </ul>
          <h4 className="font-medium text-yellow-800 mb-1 mt-2">{t('modal.recommendations')}:</h4>
          <ul className="text-yellow-700 space-y-1">
            <li>• {t('modal.increaseFeedingFrequency')}</li>
            <li>• {t('modal.ensureAdequateNutrition')}</li>
            <li>• {t('modal.monitorWeightWeekly')}</li>
            <li>• {t('modal.consultPediatricianIfNeeded')}</li>
          </ul>
        </div>
      </div>
    ),
    concerning: (
      <div>
        <h3 className="font-semibold text-red-700 mb-2">{t('weight.growthStatus')}: {t('weight.mengkhawatirkan')}</h3>
        <p className="mb-2">{t('modal.growthConcerningMedicalEvaluation')}</p>
        <div className="bg-red-50 p-3 rounded-lg">
          <h4 className="font-medium text-red-800 mb-1">{t('modal.indicators')}:</h4>
          <ul className="text-red-700 space-y-1">
            <li>• {t('modal.weightInPercentileExtreme')}</li>
            <li>• {t('modal.weightGainVerySlowExcessive')}</li>
            <li>• {t('modal.growthAbnormalDeclining')}</li>
          </ul>
          <h4 className="font-medium text-red-800 mb-1 mt-2">{t('modal.recommendations')}:</h4>
          <ul className="text-red-700 space-y-1">
            <li>• {t('modal.immediatelyConsultPediatrician')}</li>
            <li>• {t('modal.comprehensiveMedicalEvaluation')}</li>
            <li>• {t('modal.monitorGrowthDaily')}</li>
            <li>• {t('modal.followDoctorAdvice')}</li>
          </ul>
        </div>
      </div>
    )
  };
  
  return statusMap[status] || <div>Status not found</div>;
};
