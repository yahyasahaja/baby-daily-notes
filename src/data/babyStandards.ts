// WHO Growth Standards Data
// Based on WHO Child Growth Standards for weight-for-age percentiles
// Data for boys and girls 0-24 months

export interface WeightPercentile {
  ageInMonths: number;
  p3: number;  // 3rd percentile
  p15: number; // 15th percentile
  p50: number; // 50th percentile (median)
  p85: number; // 85th percentile
  p97: number; // 97th percentile
}

export const BOYS_WEIGHT_STANDARDS: WeightPercentile[] = [
  { ageInMonths: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
  { ageInMonths: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.8 },
  { ageInMonths: 2, p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.1 },
  { ageInMonths: 3, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 8.0 },
  { ageInMonths: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.6 },
  { ageInMonths: 5, p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.3 },
  { ageInMonths: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
  { ageInMonths: 7, p3: 6.7, p15: 7.4, p50: 8.3, p85: 9.2, p97: 10.3 },
  { ageInMonths: 8, p3: 6.9, p15: 7.7, p50: 8.6, p85: 9.6, p97: 10.7 },
  { ageInMonths: 9, p3: 7.1, p15: 7.9, p50: 8.9, p85: 9.9, p97: 11.0 },
  { ageInMonths: 10, p3: 7.4, p15: 8.1, p50: 9.2, p85: 10.2, p97: 11.3 },
  { ageInMonths: 11, p3: 7.6, p15: 8.4, p50: 9.4, p85: 10.5, p97: 11.5 },
  { ageInMonths: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 11.8 },
  { ageInMonths: 13, p3: 7.9, p15: 8.8, p50: 9.9, p85: 11.0, p97: 12.0 },
  { ageInMonths: 14, p3: 8.1, p15: 9.0, p50: 10.1, p85: 11.3, p97: 12.3 },
  { ageInMonths: 15, p3: 8.3, p15: 9.2, p50: 10.3, p85: 11.5, p97: 12.5 },
  { ageInMonths: 16, p3: 8.4, p15: 9.4, p50: 10.5, p85: 11.7, p97: 12.7 },
  { ageInMonths: 17, p3: 8.6, p15: 9.6, p50: 10.7, p85: 11.9, p97: 12.9 },
  { ageInMonths: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.1, p97: 13.1 },
  { ageInMonths: 19, p3: 8.9, p15: 9.9, p50: 11.1, p85: 12.3, p97: 13.3 },
  { ageInMonths: 20, p3: 9.1, p15: 10.1, p50: 11.3, p85: 12.5, p97: 13.5 },
  { ageInMonths: 21, p3: 9.2, p15: 10.3, p50: 11.5, p85: 12.7, p97: 13.7 },
  { ageInMonths: 22, p3: 9.4, p15: 10.5, p50: 11.7, p85: 12.9, p97: 13.9 },
  { ageInMonths: 23, p3: 9.5, p15: 10.6, p50: 11.8, p85: 13.1, p97: 14.1 },
  { ageInMonths: 24, p3: 9.7, p15: 10.8, p50: 12.0, p85: 13.3, p97: 14.3 }
];

export const GIRLS_WEIGHT_STANDARDS: WeightPercentile[] = [
  { ageInMonths: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { ageInMonths: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.5 },
  { ageInMonths: 2, p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.6 },
  { ageInMonths: 3, p3: 4.5, p15: 5.2, p50: 5.8, p85: 6.6, p97: 7.5 },
  { ageInMonths: 4, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.3, p97: 8.2 },
  { ageInMonths: 5, p3: 5.4, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.8 },
  { ageInMonths: 6, p3: 5.7, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.3 },
  { ageInMonths: 7, p3: 6.0, p15: 6.8, p50: 7.6, p85: 8.6, p97: 9.8 },
  { ageInMonths: 8, p3: 6.3, p15: 7.0, p50: 7.9, p85: 8.9, p97: 10.1 },
  { ageInMonths: 9, p3: 6.5, p15: 7.3, p50: 8.2, p85: 9.3, p97: 10.5 },
  { ageInMonths: 10, p3: 6.7, p15: 7.5, p50: 8.5, p85: 9.6, p97: 10.8 },
  { ageInMonths: 11, p3: 6.9, p15: 7.7, p50: 8.7, p85: 9.9, p97: 11.0 },
  { ageInMonths: 12, p3: 7.0, p15: 7.8, p50: 8.9, p85: 10.1, p97: 11.3 },
  { ageInMonths: 13, p3: 7.2, p15: 8.0, p50: 9.0, p85: 10.2, p97: 11.5 },
  { ageInMonths: 14, p3: 7.3, p15: 8.2, p50: 9.2, p85: 10.4, p97: 11.7 },
  { ageInMonths: 15, p3: 7.5, p15: 8.4, p50: 9.4, p85: 10.6, p97: 11.9 },
  { ageInMonths: 16, p3: 7.6, p15: 8.5, p50: 9.6, p85: 10.8, p97: 12.1 },
  { ageInMonths: 17, p3: 7.8, p15: 8.7, p50: 9.8, p85: 11.0, p97: 12.3 },
  { ageInMonths: 18, p3: 7.9, p15: 8.8, p50: 9.9, p85: 11.2, p97: 12.5 },
  { ageInMonths: 19, p3: 8.1, p15: 9.0, p50: 10.1, p85: 11.4, p97: 12.7 },
  { ageInMonths: 20, p3: 8.2, p15: 9.1, p50: 10.2, p85: 11.5, p97: 12.9 },
  { ageInMonths: 21, p3: 8.4, p15: 9.3, p50: 10.4, p85: 11.7, p97: 13.1 },
  { ageInMonths: 22, p3: 8.5, p15: 9.4, p50: 10.5, p85: 11.8, p97: 13.3 },
  { ageInMonths: 23, p3: 8.6, p15: 9.6, p50: 10.7, p85: 12.0, p97: 13.5 },
  { ageInMonths: 24, p3: 8.8, p15: 9.7, p50: 10.8, p85: 12.1, p97: 13.7 }
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

export function getWeightStatus(weight: number, ageInMonths: number, gender: Gender): {
  status: 'normal' | 'underweight' | 'overweight' | 'belowStandard';
  percentile: number;
  message: string;
} {
  const percentile = getWeightPercentile(weight, ageInMonths, gender);
  
  if (percentile < 3) {
    return {
      status: 'belowStandard',
      percentile,
      message: 'Weight is significantly below standard. Please consult a pediatrician.'
    };
  } else if (percentile < 15) {
    return {
      status: 'underweight',
      percentile,
      message: 'Weight is below average but within acceptable range.'
    };
  } else if (percentile > 97) {
    return {
      status: 'overweight',
      percentile,
      message: 'Weight is above average. Please consult a pediatrician.'
    };
  } else {
    return {
      status: 'normal',
      percentile,
      message: 'Weight is within normal range.'
    };
  }
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
  // Typical weight gain patterns based on age
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
