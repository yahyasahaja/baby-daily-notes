export interface Profile {
  id: string;
  name: string;
  dateOfBirth: string;
  birthWeight: number; // in grams
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

export interface SickEntry {
  id: string;
  startDate: string;
  endDate: string;
  symptoms: SickSymptom[];
  notes?: string;
  createdAt: string;
}

export interface SickSymptom {
  id: string;
  type: 'fever' | 'vomit' | 'weak' | 'dizzy' | 'cough' | 'runny_nose' | 'rash' | 'diarrhea' | 'constipation' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface DailyRecord {
  date: string;
  weight?: WeightEntry;
  diaperEntries: DiaperEntry[];
  peeCount: number;
  poopCount: number;
  sickEntries: SickEntry[];
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

export type NavigationTab = 'home' | 'weight' | 'diaper' | 'sick' | 'summary' | 'settings';
