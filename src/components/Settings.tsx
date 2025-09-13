'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateProfile, deleteProfile, selectProfile, setLanguage } from '@/store/slices/appSlice';
import { Profile } from '@/types';
import { User, Trash2, Edit, Globe, LogOut } from 'lucide-react';
import { Input, RadioGroup } from '@/components/ui/Input';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '@/context/I18nContext';

export default function Settings() {
  const dispatch = useAppDispatch();
  const { selectedProfileId, profiles } = useAppSelector((state) => state.app);
  const { t } = useI18n();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    picture: ''
  });

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setEditForm({
      name: profile.name,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      picture: profile.picture || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    const updatedProfile: Profile = {
      ...editingProfile,
      name: editForm.name,
      dateOfBirth: editForm.dateOfBirth,
      gender: editForm.gender,
      picture: editForm.picture || undefined
    };

    dispatch(updateProfile(updatedProfile));
    setShowEditForm(false);
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      dispatch(deleteProfile(profileId));
    }
  };

  const handleLogout = () => {
    dispatch(selectProfile(''));
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('settings.title')}</h1>

        {/* Current Profile */}
        {selectedProfile && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">{t('settings.currentProfile')}</h2>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center">
                {selectedProfile.picture ? (
                  <img
                    src={selectedProfile.picture}
                    alt={selectedProfile.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{selectedProfile.name}</h3>
                <p className="text-sm text-gray-600">
                  Born {new Date(selectedProfile.dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 capitalize">{selectedProfile.gender}</p>
              </div>
            </div>
          </div>
        )}

        {/* Language Settings */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t('settings.language')}
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{t('settings.language')}</span>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Profile Management */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">{t('settings.manageProfiles')}</h2>
          <div className="space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center">
                    {profile.picture ? (
                      <img
                        src={profile.picture}
                        alt={profile.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{profile.name}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProfile(profile)}
                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProfile(profile.id)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Switch Profile</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Baby Name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                  required
                />

                <RadioGroup
                  label="Gender"
                  name="gender"
                  value={editForm.gender}
                  onChange={(value) => setEditForm({ ...editForm, gender: value as 'male' | 'female' })}
                  options={[
                    { value: 'male', label: 'Boy' },
                    { value: 'female', label: 'Girl' }
                  ]}
                />

                <Input
                  label="Profile Picture (Optional)"
                  type="url"
                  value={editForm.picture}
                  onChange={(e) => setEditForm({ ...editForm, picture: e.target.value })}
                  placeholder="Image URL"
                />

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
