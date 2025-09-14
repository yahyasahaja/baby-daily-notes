import React from 'react';
import { Metadata } from 'next';
import ClientApp from '@/components/ClientApp';

export const metadata: Metadata = {
  title: 'Baby Daily Notes - Track Your Baby\'s Health',
  description: 'Track your baby\'s weight, diaper changes, and health with detailed analytics and insights. Monitor growth patterns, feeding schedules, and health trends.',
  keywords: ['baby tracker', 'baby health', 'weight tracking', 'diaper tracker', 'baby growth', 'infant care', 'baby monitoring', 'health analytics'],
  openGraph: {
    title: 'Baby Daily Notes - Track Your Baby\'s Health',
    description: 'Track your baby\'s weight, diaper changes, and health with detailed analytics and insights.',
    type: 'website',
    images: [
      {
        url: '/assets/images/screenshot-mobile.png',
        width: 375,
        height: 812,
        alt: 'Baby Daily Notes Mobile App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baby Daily Notes - Track Your Baby\'s Health',
    description: 'Track your baby\'s weight, diaper changes, and health with detailed analytics and insights.',
    images: ['/assets/images/screenshot-mobile.png'],
  },
};

export default function HomePage() {
  return <ClientApp />;
}