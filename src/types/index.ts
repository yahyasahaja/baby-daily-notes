export interface Profile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  picture?: string;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  createdAt: string;
}

export interface DiaperEntry {
  id: string;
  date: string;
  type: 'pee' | 'poop' | 'both';
  peeCount: number;
  poopCount: number;
  poopColor?: 'yellow' | 'green' | 'brown' | 'red' | 'white' | 'black';
  poopConsistency?: 'normal' | 'mucus' | 'blood';
  notes?: string;
  createdAt: string;
}

export interface DailyRecord {
  date: string;
  weight?: WeightEntry;
  diaperEntries: DiaperEntry[];
  peeCount: number;
  poopCount: number;
}

export interface AppState {
  profiles: Profile[];
  selectedProfileId: string | null;
  dailyRecords: { [profileId: string]: DailyRecord[] };
  language: 'en' | 'id';
}

export interface WeightStatus {
  status: 'normal' | 'underweight' | 'overweight' | 'belowStandard';
  percentile: number;
  message: string;
}

export interface WeightGainAnalysis {
  daily: number;
  weekly: number;
  monthly: number;
  status: 'excellent' | 'good' | 'needsAttention';
}

export interface DiaperAnalysis {
  peeFrequency: 'normal' | 'low' | 'high';
  poopFrequency: 'normal' | 'diarrhea' | 'constipation';
  dehydrationRisk: boolean;
  diarrheaRisk: boolean;
}

export type NavigationTab = 'home' | 'weight' | 'pee' | 'poop' | 'summary' | 'settings';
