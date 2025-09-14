import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from '@/context/I18nContext';
import BottomNavigation from '@/components/BottomNavigation';
import ReduxProvider from '@/components/ReduxProvider';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import StructuredData from '@/components/StructuredData';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Baby Daily Notes - Track Your Baby's Health",
    template: "%s | Baby Daily Notes"
  },
  description: "Track your baby's weight, diaper changes, and health with detailed analytics and insights. Monitor growth patterns, feeding schedules, and health trends.",
  keywords: ["baby tracker", "baby health", "weight tracking", "diaper tracker", "baby growth", "infant care", "baby monitoring", "health analytics"],
  authors: [{ name: "Baby Daily Notes Team" }],
  creator: "Baby Daily Notes",
  publisher: "Baby Daily Notes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://baby-daily-notes.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'id-ID': '/id',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://baby-daily-notes.vercel.app',
    title: 'Baby Daily Notes - Track Your Baby\'s Health',
    description: 'Track your baby\'s weight, diaper changes, and health with detailed analytics and insights.',
    siteName: 'Baby Daily Notes',
    images: [
      {
        url: '/assets/images/screenshots/screenshot-desktop.png',
        width: 1280,
        height: 720,
        alt: 'Baby Daily Notes - Health Tracking App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baby Daily Notes - Track Your Baby\'s Health',
    description: 'Track your baby\'s weight, diaper changes, and health with detailed analytics and insights.',
    images: ['/assets/images/screenshots/screenshot-desktop.png'],
    creator: '@babydailynotes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'health',
  classification: 'Health & Fitness',
  referrer: 'origin-when-cross-origin',
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Baby Daily Notes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Baby Daily Notes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ec4899" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/assets/images/icons/ios/180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/icons/ios/152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/ios/180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/icons/ios/167.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/ios/32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/ios/16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <I18nProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
              <BottomNavigation />
              <ServiceWorkerRegistration />
              <PWAInstallPrompt />
            </div>
          </I18nProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
