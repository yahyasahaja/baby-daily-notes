import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, Profile, WeightEntry, DiaperEntry, DailyRecord } from '@/types';

const initialState: AppState = {
  profiles: [],
  selectedProfileId: null,
  dailyRecords: {},
  language: 'en',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
    
    addProfile: (state, action: PayloadAction<Profile>) => {
      state.profiles.push(action.payload);
    },
    
    updateProfile: (state, action: PayloadAction<Profile>) => {
      const index = state.profiles.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
    },
    
    deleteProfile: (state, action: PayloadAction<string>) => {
      const profileId = action.payload;
      state.profiles = state.profiles.filter(p => p.id !== profileId);
      delete state.dailyRecords[profileId];
      if (state.selectedProfileId === profileId) {
        state.selectedProfileId = null;
      }
    },
    
    selectProfile: (state, action: PayloadAction<string>) => {
      state.selectedProfileId = action.payload;
    },
    
    setDailyRecords: (state, action: PayloadAction<{ profileId: string; records: DailyRecord[] }>) => {
      const { profileId, records } = action.payload;
      state.dailyRecords[profileId] = records;
    },
    
    addWeightEntry: (state, action: PayloadAction<{ profileId: string; entry: WeightEntry }>) => {
      const { profileId, entry } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      const recordIndex = existingRecords.findIndex(r => r.date === entry.date);
      
      if (recordIndex >= 0) {
        // Update existing record
        state.dailyRecords[profileId][recordIndex].weight = entry;
      } else {
        // Create new record
        if (!state.dailyRecords[profileId]) {
          state.dailyRecords[profileId] = [];
        }
        state.dailyRecords[profileId].push({
          date: entry.date,
          weight: entry,
          diaperEntries: [],
          peeCount: 0,
          poopCount: 0
        });
      }
    },
    
    addDiaperEntry: (state, action: PayloadAction<{ profileId: string; entry: DiaperEntry }>) => {
      const { profileId, entry } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      const recordIndex = existingRecords.findIndex(r => r.date === entry.date);
      
      if (recordIndex >= 0) {
        // Update existing record
        const record = state.dailyRecords[profileId][recordIndex];
        record.diaperEntries.push(entry);
        record.peeCount = record.diaperEntries.reduce((sum, e) => sum + e.peeCount, 0);
        record.poopCount = record.diaperEntries.reduce((sum, e) => sum + e.poopCount, 0);
      } else {
        // Create new record
        if (!state.dailyRecords[profileId]) {
          state.dailyRecords[profileId] = [];
        }
        state.dailyRecords[profileId].push({
          date: entry.date,
          diaperEntries: [entry],
          peeCount: entry.peeCount,
          poopCount: entry.poopCount
        });
      }
    },
    
    updateDiaperEntry: (state, action: PayloadAction<{ profileId: string; entry: DiaperEntry }>) => {
      const { profileId, entry } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      
      existingRecords.forEach(record => {
        const entryIndex = record.diaperEntries.findIndex(e => e.id === entry.id);
        if (entryIndex !== -1) {
          record.diaperEntries[entryIndex] = entry;
          record.peeCount = record.diaperEntries.reduce((sum, e) => sum + e.peeCount, 0);
          record.poopCount = record.diaperEntries.reduce((sum, e) => sum + e.poopCount, 0);
        }
      });
    },
    
    removeDiaperEntry: (state, action: PayloadAction<{ profileId: string; entryId: string }>) => {
      const { profileId, entryId } = action.payload;
      const existingRecords = state.dailyRecords[profileId] || [];
      
      existingRecords.forEach(record => {
        record.diaperEntries = record.diaperEntries.filter(entry => entry.id !== entryId);
        record.peeCount = record.diaperEntries.reduce((sum, e) => sum + e.peeCount, 0);
        record.poopCount = record.diaperEntries.reduce((sum, e) => sum + e.poopCount, 0);
      });
      
      // Remove empty records
      state.dailyRecords[profileId] = existingRecords.filter(record => record.diaperEntries.length > 0);
    },
    
    setLanguage: (state, action: PayloadAction<'en' | 'id'>) => {
      state.language = action.payload;
    },
  },
});

export const {
  setProfiles,
  addProfile,
  updateProfile,
  deleteProfile,
  selectProfile,
  setDailyRecords,
  addWeightEntry,
  addDiaperEntry,
  updateDiaperEntry,
  removeDiaperEntry,
  setLanguage,
} = appSlice.actions;

export default appSlice.reducer;
