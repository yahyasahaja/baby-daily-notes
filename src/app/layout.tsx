import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from '@/context/I18nContext';
import BottomNavigation from '@/components/BottomNavigation';
import ReduxProvider from '@/components/ReduxProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Daily Notes",
  description: "Track your baby's daily weight, diaper changes, and health patterns",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <I18nProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
              <BottomNavigation />
            </div>
          </I18nProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
