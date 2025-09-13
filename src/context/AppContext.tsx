'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Profile, WeightEntry, DiaperEntry, DailyRecord, NavigationTab } from '@/types';

type AppAction =
  | { type: 'SET_PROFILES'; payload: Profile[] }
  | { type: 'ADD_PROFILE'; payload: Profile }
  | { type: 'UPDATE_PROFILE'; payload: Profile }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'SELECT_PROFILE'; payload: string }
  | { type: 'SET_DAILY_RECORDS'; payload: { profileId: string; records: DailyRecord[] } }
  | { type: 'ADD_WEIGHT_ENTRY'; payload: { profileId: string; entry: WeightEntry } }
  | { type: 'ADD_DIAPER_ENTRY'; payload: { profileId: string; entry: DiaperEntry } }
  | { type: 'UPDATE_DIAPER_ENTRY'; payload: { profileId: string; entry: DiaperEntry } }
  | { type: 'REMOVE_DIAPER_ENTRY'; payload: { profileId: string; entryId: string } }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'id' }
  | { type: 'LOAD_FROM_STORAGE' };

const initialState: AppState = {
  profiles: [],
  selectedProfileId: null,
  dailyRecords: {},
  language: 'en',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROFILES':
      return { ...state, profiles: action.payload };
    
    case 'ADD_PROFILE':
      return { ...state, profiles: [...state.profiles, action.payload] };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p => p.id === action.payload.id ? action.payload : p)
      };
    
    case 'DELETE_PROFILE':
      const { [action.payload]: removed, ...remainingRecords } = state.dailyRecords;
      return {
        ...state,
        profiles: state.profiles.filter(p => p.id !== action.payload),
        dailyRecords: remainingRecords,
        selectedProfileId: state.selectedProfileId === action.payload ? null : state.selectedProfileId
      };
    
    case 'SELECT_PROFILE':
      return { ...state, selectedProfileId: action.payload };
    
    case 'SET_DAILY_RECORDS':
      return {
        ...state,
        dailyRecords: {
          ...state.dailyRecords,
          [action.payload.profileId]: action.payload.records
        }
      };
    
    case 'ADD_WEIGHT_ENTRY': {
      const { profileId, entry } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      const recordIndex = existingRecords.findIndex(r => r.date === entry.date);
      
      let updatedRecords;
      if (recordIndex >= 0) {
        updatedRecords = existingRecords.map((record, index) =>
          index === recordIndex
            ? { ...record, weight: entry }
            : record
        );
      } else {
        updatedRecords = [
          ...existingRecords,
          {
            date: entry.date,
            weight: entry,
            diaperEntries: [],
            peeCount: 0,
            poopCount: 0
          }
        ];
      }
      
      return {
        ...state,
        dailyRecords: {
          ...state.dailyRecords,
          [profileId]: updatedRecords
        }
      };
    }
    
    case 'ADD_DIAPER_ENTRY': {
      const { profileId, entry } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      const recordIndex = existingRecords.findIndex(r => r.date === entry.date);
      
      let updatedRecords;
      if (recordIndex >= 0) {
        const existingRecord = existingRecords[recordIndex];
        const updatedDiaperEntries = [...existingRecord.diaperEntries, entry];
        const peeCount = updatedDiaperEntries.reduce((sum, e) => sum + e.peeCount, 0);
        const poopCount = updatedDiaperEntries.reduce((sum, e) => sum + e.poopCount, 0);
        
        updatedRecords = existingRecords.map((record, index) =>
          index === recordIndex
            ? { ...record, diaperEntries: updatedDiaperEntries, peeCount, poopCount }
            : record
        );
      } else {
        updatedRecords = [
          ...existingRecords,
          {
            date: entry.date,
            diaperEntries: [entry],
            peeCount: entry.peeCount,
            poopCount: entry.poopCount
          }
        ];
      }
      
      return {
        ...state,
        dailyRecords: {
          ...state.dailyRecords,
          [profileId]: updatedRecords
        }
      };
    }
    
    case 'UPDATE_DIAPER_ENTRY': {
      const { profileId, entry } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      
      const updatedRecords = existingRecords.map(record => {
        const updatedDiaperEntries = record.diaperEntries.map(e => 
          e.id === entry.id ? entry : e
        );
        const peeCount = updatedDiaperEntries.reduce((sum, e) => sum + e.peeCount, 0);
        const poopCount = updatedDiaperEntries.reduce((sum, e) => sum + e.poopCount, 0);
        
        return {
          ...record,
          diaperEntries: updatedDiaperEntries,
          peeCount,
          poopCount
        };
      });
      
      return {
        ...state,
        dailyRecords: {
          ...state.dailyRecords,
          [profileId]: updatedRecords
        }
      };
    }
    
    case 'REMOVE_DIAPER_ENTRY': {
      const { profileId, entryId } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      
      const updatedRecords = existingRecords.map(record => {
        const updatedDiaperEntries = record.diaperEntries.filter(entry => entry.id !== entryId);
        const peeCount = updatedDiaperEntries.reduce((sum, e) => sum + e.peeCount, 0);
        const poopCount = updatedDiaperEntries.reduce((sum, e) => sum + e.poopCount, 0);
        
        return {
          ...record,
          diaperEntries: updatedDiaperEntries,
          peeCount,
          poopCount
        };
      }).filter(record => record.diaperEntries.length > 0); // Remove empty records
      
      return {
        ...state,
        dailyRecords: {
          ...state.dailyRecords,
          [profileId]: updatedRecords
        }
      };
    }
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'LOAD_FROM_STORAGE':
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('baby-daily-notes');
        if (stored) {
          return JSON.parse(stored);
        }
      }
      return state;
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_FROM_STORAGE' });
  }, []);

  // Save to localStorage whenever state changes (but not on initial load)
  useEffect(() => {
    if (typeof window !== 'undefined' && state.profiles.length > 0) {
      try {
        localStorage.setItem('baby-daily-notes', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
