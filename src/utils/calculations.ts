import { WeightEntry, DiaperEntry, DailyRecord, WeightGainAnalysis, DiaperAnalysis } from '@/types';
import { getWeightStatus, getExpectedWeightGain, calculateAgeInMonths } from '@/data/babyStandards';

export function calculateWeightGain(
  weightEntries: WeightEntry[],
  ageInMonths: number
): WeightGainAnalysis {
  if (weightEntries.length < 2) {
    return {
      daily: 0,
      weekly: 0,
      monthly: 0,
      status: 'needsAttention'
    };
  }

  // Sort by date
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latest = sortedEntries[sortedEntries.length - 1];
  const previous = sortedEntries[sortedEntries.length - 2];

  const daysDiff = Math.max(1, 
    (new Date(latest.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const weightDiff = latest.weight - previous.weight;
  const dailyGain = weightDiff / daysDiff;
  const weeklyGain = dailyGain * 7;
  const monthlyGain = dailyGain * 30;

  const expected = getExpectedWeightGain(ageInMonths);
  
  let status: 'excellent' | 'good' | 'needsAttention' = 'needsAttention';
  if (dailyGain >= expected.daily * 0.8) {
    status = dailyGain >= expected.daily * 1.2 ? 'excellent' : 'good';
  }

  return {
    daily: Math.round(dailyGain),
    weekly: Math.round(weeklyGain),
    monthly: Math.round(monthlyGain),
    status
  };
}

export function analyzeDiaperPatterns(diaperEntries: DiaperEntry[]): DiaperAnalysis {
  if (diaperEntries.length === 0) {
    return {
      peeFrequency: 'normal',
      poopFrequency: 'normal',
      dehydrationRisk: false,
      diarrheaRisk: false
    };
  }

  // Group by date
  const entriesByDate = diaperEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as { [date: string]: DiaperEntry[] });

  const dates = Object.keys(entriesByDate).sort();
  const recentDates = dates.slice(-7); // Last 7 days

  // Calculate average daily counts
  const avgPeePerDay = recentDates.reduce((sum, date) => {
    const dayEntries = entriesByDate[date];
    const dayPeeCount = dayEntries.reduce((count, entry) => count + entry.peeCount, 0);
    return sum + dayPeeCount;
  }, 0) / Math.max(1, recentDates.length);

  const avgPoopPerDay = recentDates.reduce((sum, date) => {
    const dayEntries = entriesByDate[date];
    const dayPoopCount = dayEntries.reduce((count, entry) => count + entry.poopCount, 0);
    return sum + dayPoopCount;
  }, 0) / Math.max(1, recentDates.length);

  // Analyze patterns
  const peeFrequency: 'normal' | 'low' | 'high' = 
    avgPeePerDay < 4 ? 'low' : avgPeePerDay > 12 ? 'high' : 'normal';

  const poopFrequency: 'normal' | 'diarrhea' | 'constipation' = 
    avgPoopPerDay < 1 ? 'constipation' : avgPoopPerDay > 5 ? 'diarrhea' : 'normal';

  // Check for diarrhea indicators
  const hasDiarrheaIndicators = recentDates.some(date => {
    const dayEntries = entriesByDate[date];
    return dayEntries.some(entry => 
      entry.poopConsistency === 'mucus' || 
      entry.poopConsistency === 'blood' ||
      entry.poopColor === 'red' ||
      entry.poopColor === 'white' ||
      entry.poopColor === 'black'
    );
  });

  const dehydrationRisk = peeFrequency === 'low' || avgPeePerDay < 3;
  const diarrheaRisk = poopFrequency === 'diarrhea' || hasDiarrheaIndicators;

  return {
    peeFrequency,
    poopFrequency,
    dehydrationRisk,
    diarrheaRisk
  };
}

export function getWeightTrend(weightEntries: WeightEntry[]): 'increasing' | 'decreasing' | 'stable' {
  if (weightEntries.length < 3) return 'stable';

  const recent = weightEntries.slice(-3);
  const first = recent[0].weight;
  const last = recent[recent.length - 1].weight;
  const diff = last - first;

  if (diff > 100) return 'increasing';
  if (diff < -100) return 'decreasing';
  return 'stable';
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDaysSince(date: string | Date): number {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getWeekNumber(date: string | Date): number {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

export function groupByWeek(records: DailyRecord[]): { [week: string]: DailyRecord[] } {
  return records.reduce((acc, record) => {
    const week = getWeekNumber(record.date);
    const year = new Date(record.date).getFullYear();
    const weekKey = `${year}-W${week}`;
    
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(record);
    return acc;
  }, {} as { [week: string]: DailyRecord[] });
}

export function groupByMonth(records: DailyRecord[]): { [month: string]: DailyRecord[] } {
  return records.reduce((acc, record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(record);
    return acc;
  }, {} as { [month: string]: DailyRecord[] });
}

export interface DetailedAge {
  months: number;
  days: number;
  totalDays: number;
}

export function calculateDetailedAge(dateOfBirth: Date): DetailedAge {
  const now = new Date();
  const birthDate = new Date(dateOfBirth);
  
  // Calculate total days
  const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate months and remaining days
  let months = 0;
  let days = 0;
  
  // Start from birth date and add months until we exceed current date
  let currentDate = new Date(birthDate);
  
  while (currentDate <= now) {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    if (nextMonth <= now) {
      months++;
      currentDate = nextMonth;
    } else {
      // Calculate remaining days
      days = Math.floor((now.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      break;
    }
  }
  
  return {
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays: Math.max(0, totalDays)
  };
}

export function formatDetailedAge(age: DetailedAge, t: (key: string) => string): string {
  const { months, days } = age;
  
  if (months === 0) {
    return `${t('age')}: ${days} ${days === 1 ? t('day') : t('days')}`;
  }
  
  if (days === 0) {
    return `${t('age')}: ${months} ${months === 1 ? t('month') : t('months')}`;
  }
  
  return `${t('age')}: ${months} ${months === 1 ? t('month') : t('months')} ${days} ${days === 1 ? t('day') : t('days')}`;
}
