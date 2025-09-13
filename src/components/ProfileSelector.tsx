'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Profile } from '@/types';
import { addProfile, selectProfile } from '@/store/slices/appSlice';
import { Plus, User, Calendar, Camera } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input, RadioGroup } from '@/components/ui/Input';

interface ProfileSelectorProps {
  onProfileSelect: (profileId: string) => void;
}

export default function ProfileSelector({ onProfileSelect }: ProfileSelectorProps) {
  const dispatch = useAppDispatch();
  const { profiles } = useAppSelector(state => state.app);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newProfile, setNewProfile] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    picture: ''
  });

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.name || !newProfile.dateOfBirth) return;

    const profile: Profile = {
      id: Date.now().toString(),
      name: newProfile.name,
      dateOfBirth: newProfile.dateOfBirth,
      gender: newProfile.gender,
      picture: newProfile.picture || undefined,
      createdAt: new Date().toISOString()
    };

    dispatch(addProfile(profile));
    setNewProfile({ name: '', dateOfBirth: '', gender: 'male', picture: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Baby Daily Notes
          </h1>
          <p className="text-gray-600">Choose a profile to continue</p>
        </div>

        {profiles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Profile</h2>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onProfileSelect(profile.id)}
                  className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center">
                      {profile.picture ? (
                        <img
                          src={profile.picture}
                          alt={profile.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                      <p className="text-sm text-gray-500">
                        Born {new Date(profile.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Profile</span>
          </button>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Profile</h2>
            <form onSubmit={handleAddProfile} className="space-y-4">
              <Input
                label="Baby Name"
                type="text"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                placeholder="Enter baby's name"
                required
              />

              <Input
                label="Date of Birth"
                type="date"
                value={newProfile.dateOfBirth}
                onChange={(e) => setNewProfile({ ...newProfile, dateOfBirth: e.target.value })}
                required
              />

              <RadioGroup
                label="Gender"
                name="gender"
                value={newProfile.gender}
                onChange={(value) => setNewProfile({ ...newProfile, gender: value as 'male' | 'female' })}
                options={[
                  { value: 'male', label: 'Boy' },
                  { value: 'female', label: 'Girl' }
                ]}
              />

              <Input
                label="Profile Picture (Optional)"
                type="url"
                value={newProfile.picture}
                onChange={(e) => setNewProfile({ ...newProfile, picture: e.target.value })}
                placeholder="Image URL"
              />

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  Add Profile
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
