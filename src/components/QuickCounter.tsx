'use client';

import React, { useState } from 'react';
import { DiaperEntry } from '@/types';
import { Plus, Droplets, Baby } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuickCounterProps {
  type: 'pee' | 'poop';
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
}

export default function QuickCounter({ type, count, onIncrement, onDecrement, onEdit }: QuickCounterProps) {
  const isPee = type === 'pee';
  const Icon = isPee ? Droplets : Baby;
  const color = isPee ? 'blue' : 'amber';
  const label = isPee ? 'Pee' : 'Poop';

  return (
    <div className={cn(
      'bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200',
      isPee ? 'bg-gradient-to-br from-blue-50 to-blue-100' : 'bg-gradient-to-br from-amber-50 to-amber-100'
    )}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            isPee ? 'bg-blue-500' : 'bg-amber-500'
          )}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className={cn(
          'text-lg font-bold mb-2',
          isPee ? 'text-blue-800' : 'text-amber-800'
        )}>
          {label} Today
        </h3>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={onDecrement}
            disabled={count <= 0}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl transition-colors',
              isPee 
                ? 'bg-blue-200 text-blue-800 hover:bg-blue-300 disabled:opacity-50' 
                : 'bg-amber-200 text-amber-800 hover:bg-amber-300 disabled:opacity-50'
            )}
          >
            −
          </button>
          
          <div className="min-w-[80px] text-center">
            <div className={cn(
              'text-4xl font-bold',
              isPee ? 'text-blue-800' : 'text-amber-800'
            )}>
              {count}
            </div>
            <div className={cn(
              'text-sm font-medium',
              isPee ? 'text-blue-600' : 'text-amber-600'
            )}>
              times
            </div>
          </div>
          
          <button
            onClick={onIncrement}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl transition-colors',
              isPee 
                ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
            )}
          >
            +
          </button>
        </div>
        
        <button
          onClick={onEdit}
          className={cn(
            'text-sm font-medium px-4 py-2 rounded-lg border-2 transition-colors',
            isPee 
              ? 'border-blue-300 text-blue-700 hover:bg-blue-100' 
              : 'border-amber-300 text-amber-700 hover:bg-amber-100'
          )}
        >
          Add Details
        </button>
      </div>
    </div>
  );
}
