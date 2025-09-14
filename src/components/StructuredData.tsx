'use client';

import React from 'react';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Baby Daily Notes",
    "description": "Track your baby's weight, diaper changes, and health with detailed analytics and insights",
    "url": "https://baby-daily-notes.vercel.app",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Baby Daily Notes Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Baby Daily Notes Team"
    },
    "datePublished": "2024-01-15",
    "dateModified": "2024-01-15",
    "inLanguage": ["en", "id"],
    "isAccessibleForFree": true,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "featureList": [
      "Weight tracking and growth analysis",
      "Diaper change monitoring",
      "Health and sick period tracking",
      "Detailed analytics and insights",
      "Multi-language support",
      "Offline functionality",
      "Progressive Web App"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
