'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/utils/cn';
import { getWeightStandards, Gender } from '@/data/babyStandards';
import { useI18n } from '@/context/I18nContext';

interface WHOGrowthChartProps {
  currentWeight: number;
  ageInMonths: number;
  gender: Gender;
  birthWeight?: number;
  weightHistory?: Array<{ date: string; weight: number; ageInMonths: number }>;
}

export default function WHOGrowthChart({ 
  currentWeight, 
  ageInMonths, 
  gender, 
  birthWeight,
  weightHistory = [] 
}: WHOGrowthChartProps) {
  const { t } = useI18n();
  const standards = getWeightStandards(gender);
  
  // Create chart data with WHO percentile lines
  const chartData = standards.map(standard => ({
    age: standard.ageInMonths,
    p3: standard.p3,
    p15: standard.p15,
    p50: standard.p50,
    p85: standard.p85,
    p97: standard.p97,
    current: ageInMonths === standard.ageInMonths ? currentWeight : null,
    birth: birthWeight && standard.ageInMonths === 0 ? birthWeight : null
  }));

  // Add weight history points
  const historyPoints = weightHistory.map(point => ({
    age: point.ageInMonths,
    weight: point.weight,
    isHistory: true
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{t('weight.age')}: {label} {t('weight.months')}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey === 'current') {
              return (
                <p key={index} className="text-pink-600 font-bold">
                  {t('weight.currentWeight')}: {entry.value}g
                </p>
              );
            }
            if (entry.dataKey === 'birth') {
              return (
                <p key={index} className="text-blue-600 font-bold">
                  {t('weight.birthWeight')}: {entry.value}g
                </p>
              );
            }
            if (entry.dataKey === 'weight' && entry.payload.isHistory) {
              return (
                <p key={index} className="text-gray-600">
                  {t('weight.history')}: {entry.value}g
                </p>
              );
            }
            return null;
          })}
          <div className="mt-2 text-xs text-gray-500">
            <p>3rd: {payload.find((p: any) => p.dataKey === 'p3')?.value}g</p>
            <p>15th: {payload.find((p: any) => p.dataKey === 'p15')?.value}g</p>
            <p>50th: {payload.find((p: any) => p.dataKey === 'p50')?.value}g</p>
            <p>85th: {payload.find((p: any) => p.dataKey === 'p85')?.value}g</p>
            <p>97th: {payload.find((p: any) => p.dataKey === 'p97')?.value}g</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
        {t('weight.whoGrowthChart')}
        <span className="text-sm text-gray-500 ml-2">
          ({gender === 'male' ? t('profile.gender.male') : t('profile.gender.female')})
        </span>
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="age" 
              domain={[0, 24]}
              tickCount={13}
              tick={{ fontSize: 12 }}
              label={{ value: t('weight.ageMonths'), position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              domain={[2000, 17000]}
              tick={{ fontSize: 12 }}
              label={{ value: t('weight.bodyWeight'), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* WHO Percentile Lines */}
            <Line
              type="monotone"
              dataKey="p3"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="3rd percentile"
            />
            <Line
              type="monotone"
              dataKey="p15"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="15th percentile"
            />
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              name="50th percentile (median)"
            />
            <Line
              type="monotone"
              dataKey="p85"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="85th percentile"
            />
            <Line
              type="monotone"
              dataKey="p97"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="97th percentile"
            />
            
            {/* Current weight point */}
            <Line
              type="monotone"
              dataKey="current"
              stroke="#ec4899"
              strokeWidth={0}
              dot={{ fill: '#ec4899', strokeWidth: 3, r: 6, stroke: '#fff' }}
              name={t('weight.currentWeight')}
            />
            
            {/* Birth weight point */}
            {birthWeight && (
              <Line
                type="monotone"
                dataKey="birth"
                stroke="#3b82f6"
                strokeWidth={0}
                dot={{ fill: '#3b82f6', strokeWidth: 3, r: 6, stroke: '#fff' }}
                name={t('weight.birthWeight')}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-red-500 mr-2"></div>
          <span className="text-gray-600">3rd & 97th percentile</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-yellow-500 mr-2"></div>
          <span className="text-gray-600">15th & 85th percentile</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
          <span className="text-gray-600">50th percentile (median)</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
          <span className="text-gray-600">{t('weight.currentWeight')}</span>
        </div>
        {birthWeight && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">{t('weight.birthWeight')}</span>
          </div>
        )}
      </div>
      
      {/* Interpretation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">{t('weight.interpretasiGrafik')}</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p><span className="font-medium text-green-700">{t('weight.normal')}:</span> {t('weight.normalZone')}</p>
          <p><span className="font-medium text-yellow-700">{t('weight.underweight')}:</span> {t('weight.kurangZone')}</p>
          <p><span className="font-medium text-red-700">{t('weight.belowStandard')}:</span> {t('weight.sangatKurangZone')}</p>
          <p><span className="font-medium text-orange-700">{t('weight.overweight')}:</span> {t('weight.risikoLebihZone')}</p>
        </div>
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <strong>Penjelasan:</strong> {t('weight.chartExplanation')}
        </div>
      </div>
    </div>
  );
}
