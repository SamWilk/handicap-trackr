# Golf Handicap Tracker

A modern, polished React application for tracking your golf rounds and calculating your handicap index using the World Handicap System (WHS).

## Features

- **Track Golf Rounds**: Enter round details including course name, date, course rating, slope rating, and score
- **Automatic Handicap Calculation**: Calculates your handicap index automatically using the official USGA/WHS formula
- **Round History**: View all your rounds with detailed information and score differentials
- **Local Data Persistence**: All data is stored locally in your browser using localStorage
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Material-UI**: Modern, polished UI with Material Design components

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **Material-UI v7** - Modern component library
- **LocalStorage** - Client-side data persistence

## Project Structure

```
src/
├── components/          # React components
│   ├── HandicapDisplay/ # Shows current handicap index
│   ├── RoundForm/       # Form for adding new rounds
│   ├── RoundList/       # List of all rounds
│   └── Layout/          # Main app layout with navigation
├── hooks/               # Custom React hooks
│   ├── useRounds.ts     # Manages round data and CRUD operations
│   └── useHandicap.ts   # Calculates handicap from rounds
├── services/            # Business logic services
│   └── storageService.ts # LocalStorage abstraction
├── types/               # TypeScript type definitions
│   └── index.ts         # Round, Course, HandicapData types
├── utils/               # Utility functions
│   └── handicapCalculator.ts # USGA handicap calculation logic
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Use

1. **Add a Round**: Fill in the form with your course details and score
   - **Course Name**: The name of the golf course
   - **Date**: When you played
   - **Course Rating**: The difficulty rating (e.g., 72.5)
   - **Slope Rating**: The slope rating (55-155, typically around 113-130)
   - **Score**: Your total score for the round

2. **View Your Handicap**: Your handicap index is calculated automatically once you have at least 3 rounds

3. **Track Progress**: View your round history and see how your handicap changes over time

4. **Delete Rounds**: Click the delete icon on any round to remove it from your history

## Handicap Calculation

This app follows the World Handicap System (WHS) formula:

- Uses the best differentials from your most recent rounds
- **Differential** = (Score - Course Rating) × (113 / Slope Rating)
- Number of rounds used varies based on total rounds played:
  - 3-5 rounds: uses 1 best
  - 6 rounds: uses 2 best
  - 7-8 rounds: uses 2 best
  - 9-11 rounds: uses 3 best
  - 12-14 rounds: uses 4 best
  - 15-16 rounds: uses 5 best
  - 17-18 rounds: uses 6 best
  - 19 rounds: uses 7 best
  - 20+ rounds: uses 8 best

The final **Handicap Index** is the average of the selected best differentials multiplied by 0.96.

## Best Practices Implemented

- ✅ **Encapsulation**: Services and utilities are separated from components
- ✅ **Separation of Concerns**: Clear division between UI, business logic, and data persistence
- ✅ **Type Safety**: Full TypeScript coverage with proper interfaces
- ✅ **Custom Hooks**: Reusable hooks for state management
- ✅ **Component Composition**: Small, focused components with clear responsibilities
- ✅ **Responsive Design**: Mobile-first approach with Material-UI responsive utilities
- ✅ **Clean Code**: Well-documented, maintainable code structure

## License

MIT
