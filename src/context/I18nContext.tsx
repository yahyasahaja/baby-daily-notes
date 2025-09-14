'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Common
    'app.title': 'Baby Daily Notes',
    'app.description': 'Track your baby\'s daily weight, diaper changes, and health patterns',
    
    // Navigation
    'nav.home': 'Home',
    'nav.weight': 'Weight',
    'nav.pee': 'Pee',
    'nav.poop': 'Poop',
    'nav.summary': 'Summary',
    'nav.settings': 'Settings',
    
    // Profile
    'profile.create': 'Create Profile',
    'profile.name': 'Name',
    'profile.dateOfBirth': 'Date of Birth',
    'profile.gender': 'Gender',
    'profile.gender.male': 'Male',
    'profile.gender.female': 'Female',
    'profile.picture': 'Picture URL (Optional)',
    'profile.save': 'Save Profile',
    'profile.select': 'Select Profile',
    'profile.edit': 'Edit Profile',
    'profile.delete': 'Delete Profile',
    
    // Weight
    'weight.today': 'Today\'s Weight',
    'weight.enter': 'Enter Weight',
    'weight.kg': 'kg',
    'weight.status': 'Weight Status',
    'weight.notRecorded': 'Not recorded',
    'weight.normal': 'Normal',
    'weight.underweight': 'Underweight',
    'weight.overweight': 'Overweight',
    'weight.belowStandard': 'Below Standard',
    
    // Diaper
    'diaper.pee': 'Pee',
    'diaper.poop': 'Poop',
    'diaper.count': 'Count',
    'diaper.add': 'Add',
    'diaper.details': 'Details',
    'diaper.color': 'Color',
    'diaper.consistency': 'Consistency',
    'diaper.notes': 'Notes',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.currentProfile': 'Current Profile',
    'settings.manageProfiles': 'Manage Profiles',
    'settings.logout': 'Logout',
    
    // Health
    'health.hydration': 'Hydration',
    'health.digestive': 'Digestive Health',
    'health.normal': 'Normal',
    'health.dehydration': 'Dehydration Risk',
    'health.diarrhea': 'Diarrhea',
    
    // Sick Tracking
    'sickTracking': 'Sick Tracking',
    'sickHistory': 'Sick History',
    'addSickEntry': 'Add Sick Entry',
    'noSickData': 'No sick data available',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'symptoms': 'Symptoms',
    'addSymptom': 'Add Symptom',
    'symptomType': 'Symptom Type',
    'severity': 'Severity',
    'mild': 'Mild',
    'moderate': 'Moderate',
    'severe': 'Severe',
    'fever': 'Fever',
    'vomit': 'Vomit',
    'weak': 'Weak',
    'dizzy': 'Dizzy',
    'cough': 'Cough',
    'runnyNose': 'Runny Nose',
    'rash': 'Rash',
    'diarrhea': 'Diarrhea',
    'constipation': 'Constipation',
    'other': 'Other',
    'sickDuration': 'Sick Duration',
    'daysSick': 'days sick',
    'sickPeriods': 'Sick Periods',
    
    // Common translations
    'home': 'Home',
    'weight': 'Weight',
    'diaper': 'Diaper',
    'sick': 'Sick',
    'summary': 'Summary',
    'settings': 'Settings',
    'pee': 'Pee',
    'poop': 'Poop',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'notes': 'Notes',
    'additionalNotes': 'Additional notes...',
    'editSickEntry': 'Edit Sick Entry',
    'noSickPeriodsRecorded': 'No sick periods recorded yet',
  },
  id: {
    // Common
    'app.title': 'Catatan Harian Bayi',
    'app.description': 'Pantau berat badan, popok, dan pola kesehatan bayi Anda',
    
    // Navigation
    'nav.home': 'Beranda',
    'nav.weight': 'Berat Badan',
    'nav.pee': 'Pipis',
    'nav.poop': 'BAB',
    'nav.summary': 'Ringkasan',
    'nav.settings': 'Pengaturan',
    
    // Profile
    'profile.create': 'Buat Profil',
    'profile.name': 'Nama',
    'profile.dateOfBirth': 'Tanggal Lahir',
    'profile.gender': 'Jenis Kelamin',
    'profile.gender.male': 'Laki-laki',
    'profile.gender.female': 'Perempuan',
    'profile.picture': 'URL Foto (Opsional)',
    'profile.save': 'Simpan Profil',
    'profile.select': 'Pilih Profil',
    'profile.edit': 'Edit Profil',
    'profile.delete': 'Hapus Profil',
    
    // Weight
    'weight.today': 'Berat Badan Hari Ini',
    'weight.enter': 'Masukkan Berat Badan',
    'weight.kg': 'kg',
    'weight.status': 'Status Berat Badan',
    'weight.notRecorded': 'Belum dicatat',
    'weight.normal': 'Normal',
    'weight.underweight': 'Kurang berat',
    'weight.overweight': 'Berlebih',
    'weight.belowStandard': 'Di bawah standar',
    
    // Diaper
    'diaper.pee': 'Pipis',
    'diaper.poop': 'BAB',
    'diaper.count': 'Jumlah',
    'diaper.add': 'Tambah',
    'diaper.details': 'Detail',
    'diaper.color': 'Warna',
    'diaper.consistency': 'Konsistensi',
    'diaper.notes': 'Catatan',
    
    // Settings
    'settings.title': 'Pengaturan',
    'settings.language': 'Bahasa',
    'settings.currentProfile': 'Profil Saat Ini',
    'settings.manageProfiles': 'Kelola Profil',
    'settings.logout': 'Keluar',
    
    // Health
    'health.hydration': 'Hidrasi',
    'health.digestive': 'Kesehatan Pencernaan',
    'health.normal': 'Normal',
    'health.dehydration': 'Risiko Dehidrasi',
    'health.diarrhea': 'Diare',
    
    // Sick Tracking
    'sickTracking': 'Pelacakan Sakit',
    'sickHistory': 'Riwayat Sakit',
    'addSickEntry': 'Tambah Entri Sakit',
    'noSickData': 'Tidak ada data sakit tersedia',
    'startDate': 'Tanggal Mulai',
    'endDate': 'Tanggal Selesai',
    'symptoms': 'Gejala',
    'addSymptom': 'Tambah Gejala',
    'symptomType': 'Jenis Gejala',
    'severity': 'Tingkat Keparahan',
    'mild': 'Ringan',
    'moderate': 'Sedang',
    'severe': 'Berat',
    'fever': 'Demam',
    'vomit': 'Muntah',
    'weak': 'Lemah',
    'dizzy': 'Pusing',
    'cough': 'Batuk',
    'runnyNose': 'Hidung Meler',
    'rash': 'Ruam',
    'diarrhea': 'Diare',
    'constipation': 'Sembelit',
    'other': 'Lainnya',
    'sickDuration': 'Durasi Sakit',
    'daysSick': 'hari sakit',
    'sickPeriods': 'Periode Sakit',
    
    // Common translations
    'home': 'Beranda',
    'weight': 'Berat Badan',
    'diaper': 'Popok',
    'sick': 'Sakit',
    'summary': 'Ringkasan',
    'settings': 'Pengaturan',
    'pee': 'Kencing',
    'poop': 'BAB',
    'save': 'Simpan',
    'cancel': 'Batal',
    'edit': 'Edit',
    'delete': 'Hapus',
    'notes': 'Catatan',
    'additionalNotes': 'Catatan tambahan...',
    'editSickEntry': 'Edit Entri Sakit',
    'noSickPeriodsRecorded': 'Belum ada periode sakit yang dicatat',
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('baby-daily-notes-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('baby-daily-notes-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
