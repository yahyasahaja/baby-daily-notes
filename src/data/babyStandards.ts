// WHO Growth Standards Data
// Based on WHO Child Growth Standards for weight-for-age percentiles
// Data for boys and girls 0-24 months
// All weights are in GRAMS

export interface WeightPercentile {
  ageInMonths: number;
  p3: number;  // 3rd percentile (in grams)
  p15: number; // 15th percentile (in grams)
  p50: number; // 50th percentile (in grams)
  p85: number; // 85th percentile (in grams)
  p97: number; // 97th percentile (in grams)
}

export const BOYS_WEIGHT_STANDARDS: WeightPercentile[] = [
  { ageInMonths: 0, p3: 2500, p15: 2900, p50: 3300, p85: 3900, p97: 4400 },
  { ageInMonths: 1, p3: 3400, p15: 3900, p50: 4500, p85: 5100, p97: 5800 },
  { ageInMonths: 2, p3: 4300, p15: 4900, p50: 5600, p85: 6300, p97: 7100 },
  { ageInMonths: 3, p3: 5100, p15: 5700, p50: 6400, p85: 7200, p97: 8000 },
  { ageInMonths: 4, p3: 5100, p15: 5700, p50: 6400, p85: 7200, p97: 7900 },
  { ageInMonths: 5, p3: 6000, p15: 6700, p50: 7500, p85: 8400, p97: 9300 },
  { ageInMonths: 6, p3: 6400, p15: 7100, p50: 7900, p85: 8800, p97: 9800 },
  { ageInMonths: 7, p3: 6700, p15: 7400, p50: 8300, p85: 9200, p97: 10300 },
  { ageInMonths: 8, p3: 6900, p15: 7700, p50: 8600, p85: 9600, p97: 10700 },
  { ageInMonths: 9, p3: 7100, p15: 7900, p50: 8900, p85: 9900, p97: 11000 },
  { ageInMonths: 10, p3: 7400, p15: 8100, p50: 9200, p85: 10200, p97: 11300 },
  { ageInMonths: 11, p3: 7600, p15: 8400, p50: 9400, p85: 10500, p97: 11500 },
  { ageInMonths: 12, p3: 7700, p15: 8600, p50: 9600, p85: 10800, p97: 11800 },
  { ageInMonths: 13, p3: 7900, p15: 8800, p50: 9900, p85: 11000, p97: 12000 },
  { ageInMonths: 14, p3: 8100, p15: 9000, p50: 10100, p85: 11300, p97: 12300 },
  { ageInMonths: 15, p3: 8300, p15: 9200, p50: 10300, p85: 11500, p97: 12500 },
  { ageInMonths: 16, p3: 8400, p15: 9400, p50: 10500, p85: 11700, p97: 12700 },
  { ageInMonths: 17, p3: 8600, p15: 9600, p50: 10700, p85: 11900, p97: 12900 },
  { ageInMonths: 18, p3: 8800, p15: 9800, p50: 10900, p85: 12100, p97: 13100 },
  { ageInMonths: 19, p3: 8900, p15: 9900, p50: 11100, p85: 12300, p97: 13300 },
  { ageInMonths: 20, p3: 9100, p15: 10100, p50: 11300, p85: 12500, p97: 13500 },
  { ageInMonths: 21, p3: 9200, p15: 10300, p50: 11500, p85: 12700, p97: 13700 },
  { ageInMonths: 22, p3: 9400, p15: 10500, p50: 11700, p85: 12900, p97: 13900 },
  { ageInMonths: 23, p3: 9500, p15: 10600, p50: 11800, p85: 13100, p97: 14100 },
  { ageInMonths: 24, p3: 9700, p15: 10800, p50: 12000, p85: 13300, p97: 14300 }
];

export const GIRLS_WEIGHT_STANDARDS: WeightPercentile[] = [
  { ageInMonths: 0, p3: 2400, p15: 2800, p50: 3200, p85: 3700, p97: 4200 },
  { ageInMonths: 1, p3: 3200, p15: 3600, p50: 4200, p85: 4800, p97: 5500 },
  { ageInMonths: 2, p3: 3900, p15: 4500, p50: 5100, p85: 5800, p97: 6600 },
  { ageInMonths: 3, p3: 4500, p15: 5200, p50: 5800, p85: 6600, p97: 7500 },
  { ageInMonths: 4, p3: 4800, p15: 5500, p50: 6400, p85: 7200, p97: 8200 },
  { ageInMonths: 5, p3: 5400, p15: 6100, p50: 6900, p85: 7800, p97: 8800 },
  { ageInMonths: 6, p3: 5700, p15: 6500, p50: 7300, p85: 8200, p97: 9300 },
  { ageInMonths: 7, p3: 6000, p15: 6800, p50: 7600, p85: 8600, p97: 9800 },
  { ageInMonths: 8, p3: 6300, p15: 7000, p50: 7900, p85: 8900, p97: 10100 },
  { ageInMonths: 9, p3: 6500, p15: 7300, p50: 8200, p85: 9300, p97: 10500 },
  { ageInMonths: 10, p3: 6700, p15: 7500, p50: 8500, p85: 9600, p97: 10800 },
  { ageInMonths: 11, p3: 6900, p15: 7700, p50: 8700, p85: 9900, p97: 11000 },
  { ageInMonths: 12, p3: 7000, p15: 7800, p50: 8900, p85: 10100, p97: 11300 },
  { ageInMonths: 13, p3: 7200, p15: 8000, p50: 9000, p85: 10200, p97: 11500 },
  { ageInMonths: 14, p3: 7300, p15: 8200, p50: 9200, p85: 10400, p97: 11700 },
  { ageInMonths: 15, p3: 7500, p15: 8400, p50: 9400, p85: 10600, p97: 11900 },
  { ageInMonths: 16, p3: 7600, p15: 8500, p50: 9600, p85: 10800, p97: 12100 },
  { ageInMonths: 17, p3: 7800, p15: 8700, p50: 9800, p85: 11000, p97: 12300 },
  { ageInMonths: 18, p3: 7900, p15: 8800, p50: 9900, p85: 11200, p97: 12500 },
  { ageInMonths: 19, p3: 8100, p15: 9000, p50: 10100, p85: 11400, p97: 12700 },
  { ageInMonths: 20, p3: 8200, p15: 9100, p50: 10200, p85: 11500, p97: 12900 },
  { ageInMonths: 21, p3: 8400, p15: 9300, p50: 10400, p85: 11700, p97: 13100 },
  { ageInMonths: 22, p3: 8500, p15: 9400, p50: 10500, p85: 11800, p97: 13300 },
  { ageInMonths: 23, p3: 8600, p15: 9600, p50: 10700, p85: 12000, p97: 13500 },
  { ageInMonths: 24, p3: 8800, p15: 9700, p50: 10800, p85: 12100, p97: 13700 }
];

export type Gender = 'male' | 'female';

export function getWeightStandards(gender: Gender): WeightPercentile[] {
  return gender === 'male' ? BOYS_WEIGHT_STANDARDS : GIRLS_WEIGHT_STANDARDS;
}

export function getWeightPercentile(weight: number, ageInMonths: number, gender: Gender): number {
  const standards = getWeightStandards(gender);
  const ageData = standards.find(s => s.ageInMonths === ageInMonths);
  
  if (!ageData) return 50; // Default to median if age not found
  
  if (weight <= ageData.p3) return 3;
  if (weight <= ageData.p15) return 15;
  if (weight <= ageData.p50) return 50;
  if (weight <= ageData.p85) return 85;
  if (weight <= ageData.p97) return 97;
  return 97; // Above 97th percentile
}

export function getWeightStatus(weight: number, ageInMonths: number, gender: Gender, birthWeight?: number, t?: (key: string) => string): {
  status: 'normal' | 'underweight' | 'overweight' | 'belowStandard';
  percentile: number;
  category: 'kurang_gizi' | 'batas_bawah' | 'ideal' | 'batas_atas' | 'overweight';
  categoryLabel: string;
  message: string;
  growthStatus: 'excellent' | 'good' | 'needsAttention' | 'concerning';
  weeklyTarget?: number;
  timeToTarget?: string;
  recommendations: string[];
} {
  const percentile = getWeightPercentile(weight, ageInMonths, gender);
  const standards = getWeightStandards(gender);
  const currentAgeData = standards.find(s => s.ageInMonths === ageInMonths);
  
  let status: 'normal' | 'underweight' | 'overweight' | 'belowStandard';
  let category: 'kurang_gizi' | 'batas_bawah' | 'ideal' | 'batas_atas' | 'overweight';
  let categoryLabel: string;
  let message: string;
  let growthStatus: 'excellent' | 'good' | 'needsAttention' | 'concerning';
  let weeklyTarget: number | undefined;
  let timeToTarget: string | undefined;
  let recommendations: string[] = [];

  if (percentile < 3) {
    status = 'belowStandard';
    category = 'kurang_gizi';
    categoryLabel = t ? t('weight.kurangGizi') : 'Kurang Gizi';
    message = t ? t('weight.message.severelyUnderweight') : 'Berat badan sangat kurang (severely underweight). Segera konsultasi ke dokter anak.';
    growthStatus = 'concerning';
    recommendations = t ? [
      t('weight.recommendation.consultPediatrician'),
      t('weight.recommendation.checkDietNutrition'),
      t('weight.recommendation.monitorGrowthStrictly')
    ] : [
      'Segera konsultasi ke dokter anak',
      'Periksa pola makan dan asupan nutrisi',
      'Monitor pertumbuhan lebih ketat'
    ];
  } else if (percentile < 15) {
    status = 'underweight';
    category = 'batas_bawah';
    categoryLabel = t ? t('weight.batasBawah') : 'Batas Bawah';
    message = t ? t('weight.message.underweight') : 'Berat badan kurang (underweight). Perlu perhatian khusus pada asupan nutrisi.';
    growthStatus = 'needsAttention';
    
    // Calculate target weight (15th percentile)
    const targetWeight = currentAgeData ? 
      currentAgeData.p15 + (currentAgeData.p50 - currentAgeData.p15) * 0.3 : weight * 1.1;
    const weightGap = targetWeight - weight;
    weeklyTarget = Math.max(100, weightGap / 4); // Target per week in grams
    timeToTarget = t ? 
      `${t('weight.timeToTarget.withIncrease')} ${weeklyTarget.toFixed(0)}g/${t('weight.timeToTarget.perWeek')}, ${t('weight.timeToTarget.willReachIdeal')} ${Math.ceil(weightGap / weeklyTarget)} ${t('weight.timeToTarget.weeks')}` :
      `Dengan kenaikan ${weeklyTarget.toFixed(0)}g/minggu, akan mencapai berat ideal dalam ${Math.ceil(weightGap / weeklyTarget)} minggu`;
    
    recommendations = t ? [
      t('weight.recommendation.increaseFeedingFrequency'),
      t('weight.recommendation.ensureAdequateNutrition'),
      t('weight.recommendation.monitorWeightWeekly'),
      `${t('weight.target.nextWeek')}: ${(weight + weeklyTarget).toFixed(0)}g`
    ] : [
      'Tingkatkan frekuensi menyusui/makan',
      'Pastikan asupan nutrisi yang cukup',
      'Monitor berat badan setiap minggu',
      `Target minggu depan: ${(weight + weeklyTarget).toFixed(0)}g`
    ];
  } else if (percentile > 97) {
    status = 'overweight';
    category = 'overweight';
    categoryLabel = t ? t('weight.overweight') : 'Overweight';
    message = t ? t('weight.message.overweight') : 'Risiko berat badan lebih (risk of overweight). Konsultasi ke dokter anak.';
    growthStatus = 'concerning';
    recommendations = t ? [
      t('weight.recommendation.consultPediatrician'),
      t('weight.recommendation.checkDietActivity'),
      t('weight.recommendation.monitorGrowthRegularly')
    ] : [
      'Konsultasi ke dokter anak',
      'Periksa pola makan dan aktivitas',
      'Monitor pertumbuhan secara teratur'
    ];
  } else if (percentile >= 15 && percentile <= 85) {
    status = 'normal';
    category = 'ideal';
    categoryLabel = t ? t('weight.ideal') : 'Ideal';
    message = t ? t('weight.message.normal') : 'Berat badan normal. Pertumbuhan baik!';
    growthStatus = percentile >= 50 ? 'excellent' : 'good';
    recommendations = t ? [
      t('weight.recommendation.maintainGoodDiet'),
      t('weight.recommendation.continueRoutineMonitoring'),
      t('weight.recommendation.provideAgeAppropriateStimulation')
    ] : [
      'Pertahankan pola makan yang baik',
      'Lanjutkan monitoring rutin',
      'Berikan stimulasi perkembangan sesuai usia'
    ];
  } else {
    status = 'normal';
    category = 'batas_atas';
    categoryLabel = t ? t('weight.batasAtas') : 'Batas Atas';
    message = t ? t('weight.message.upperLimit') : 'Berat badan normal tapi di batas atas. Perhatikan pola makan.';
    growthStatus = 'good';
    recommendations = t ? [
      t('weight.recommendation.maintainBalancedDiet'),
      t('weight.recommendation.monitorGrowthRegularly'),
      t('weight.recommendation.consultIfConcerned')
    ] : [
      'Pertahankan pola makan yang seimbang',
      'Monitor pertumbuhan secara teratur',
      'Konsultasi jika ada kekhawatiran'
    ];
  }

  // Add growth trajectory analysis if birth weight is available
  if (birthWeight && ageInMonths > 0) {
    const expectedWeight = birthWeight + (ageInMonths * 600); // Rough expected growth in grams
    const actualGrowth = weight - birthWeight;
    const expectedGrowth = expectedWeight - birthWeight;
    const growthRatio = actualGrowth / expectedGrowth;

    if (growthRatio < 0.8) {
      growthStatus = 'needsAttention';
      recommendations.unshift(t ? t('weight.growthVeryGood') : 'Pertumbuhan sangat baik!');
    } else if (growthRatio > 1.2) {
      growthStatus = 'excellent';
      recommendations.unshift(t ? t('weight.growthVeryGood') : 'Pertumbuhan sangat baik!');
    }
  }

  return {
    status,
    percentile,
    category,
    categoryLabel,
    message,
    growthStatus,
    weeklyTarget,
    timeToTarget,
    recommendations
  };
}

export function calculateAgeInMonths(dateOfBirth: Date): number {
  const now = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
  months += now.getMonth() - birthDate.getMonth();
  
  if (now.getDate() < birthDate.getDate()) {
    months--;
  }
  
  return Math.max(0, months);
}

export function getExpectedWeightGain(ageInMonths: number): {
  daily: number;
  weekly: number;
  monthly: number;
} {
  // Typical weight gain patterns based on age (already in grams)
  if (ageInMonths < 3) {
    return { daily: 20, weekly: 140, monthly: 600 }; // 0-3 months: ~20g/day
  } else if (ageInMonths < 6) {
    return { daily: 15, weekly: 105, monthly: 450 }; // 3-6 months: ~15g/day
  } else if (ageInMonths < 12) {
    return { daily: 10, weekly: 70, monthly: 300 }; // 6-12 months: ~10g/day
  } else {
    return { daily: 5, weekly: 35, monthly: 150 }; // 12+ months: ~5g/day
  }
}
