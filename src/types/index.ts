/**
 * Core types for the Golf Handicap Tracker application
 */

export interface Course {
  name: string;
  rating: number;
  slope: number;
}

export interface Round {
  id: string;
  date: string;
  course: Course;
  score: number;
  adjustedGrossScore?: number;
}

export interface HandicapData {
  handicapIndex: number;
  roundsUsed: number;
  totalRounds: number;
  lastUpdated: string;
}
