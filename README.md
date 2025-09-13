# Baby Daily Notes

A comprehensive mobile-friendly web application for tracking your baby's daily health metrics, built with Next.js and TypeScript.

## Features

### 👶 Profile Management
- Create and manage multiple baby profiles
- Store profile information including name, date of birth, gender, and optional profile picture
- Switch between profiles easily
- All data stored locally in browser storage

### ⚖️ Weight Tracking
- Record daily weight entries (once per day)
- Quick and simple weight input
- Visual weight trend charts (daily, weekly, monthly)
- Weight gain analysis with daily, weekly, and monthly calculations
- WHO growth standards integration for health status assessment
- Automatic percentile calculation and health status evaluation

### 🍼 Diaper Tracking
- Simple counter interface for pee and poop frequency
- Optional detailed notes including:
  - Poop color (yellow, green, brown, red, white, black)
  - Poop consistency (normal, mucus present, blood present)
- Real-time pattern analysis
- Dehydration and diarrhea risk detection
- Visual charts showing diaper change patterns

### 📊 Summary Dashboard
- Comprehensive health insights and analytics
- Weight trend visualization with interactive charts
- Diaper pattern analysis
- Health status alerts and recommendations
- Weekly and monthly pattern summaries
- WHO growth standards comparison

### 🌍 Internationalization
- English and Indonesian language support
- Easy language switching in settings
- All UI text translated for both languages

### 📱 Mobile-First Design
- Optimized for smartphone use
- Touch-friendly interface
- Responsive design that works on all screen sizes
- Bottom navigation for easy thumb access
- Safe area support for modern mobile devices

## Health Insights

The application provides intelligent health monitoring based on WHO growth standards and medical best practices:

### Weight Analysis
- Compares baby's weight against WHO growth percentiles
- Provides status indicators: Normal, Underweight, Overweight, Below Standard
- Calculates expected weight gain based on age
- Tracks actual vs. expected weight gain patterns

### Diaper Analysis
- Monitors hydration levels through urine frequency
- Detects potential dehydration risks
- Analyzes stool patterns for digestive health
- Identifies diarrhea and constipation patterns
- Provides color-based health indicators

### Alerts and Warnings
- Dehydration warnings when urine output is low
- Diarrhea alerts for frequent loose stools
- Weight status alerts for concerning patterns
- Visual indicators for immediate attention

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Storage**: LocalStorage
- **Internationalization**: next-i18next

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd baby-daily-notes
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your mobile browser or browser with mobile view.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **First Time Setup**: Create a baby profile with name, date of birth, and gender
2. **Daily Tracking**: Use the weight and diaper tabs to record daily entries
3. **Monitor Progress**: Check the summary dashboard for health insights and trends
4. **Settings**: Manage profiles, change language, or switch between babies

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Data persists between browser sessions
- You can export/import data through browser developer tools if needed

## WHO Growth Standards

The application uses official WHO Child Growth Standards for:
- Weight-for-age percentiles (0-24 months)
- Separate standards for boys and girls
- 3rd, 15th, 50th, 85th, and 97th percentile references
- Age-appropriate weight gain expectations

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - feel free to use this project for your own baby tracking needs.

---

**Note**: This application is designed to assist with tracking and should not replace professional medical advice. Always consult with your pediatrician for health concerns.