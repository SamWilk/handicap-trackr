/**
 * Handicap calculation utilities following USGA handicap system
 * Implements the World Handicap System (WHS) calculation method
 */

import { Round, HandicapData } from "../types";

/**
 * Calculate differential for a single round
 * Formula: (Adjusted Gross Score - Course Rating) × (113 / Slope Rating)
 */
export const calculateDifferential = (
  score: number,
  courseRating: number,
  slopeRating: number
): number => {
  return ((score - courseRating) * 113) / slopeRating;
};

/**
 * Determine how many rounds to use based on total rounds played
 */
const getNumberOfRoundsToUse = (totalRounds: number): number => {
  if (totalRounds < 3) return 0; // Need at least 3 rounds
  if (totalRounds <= 5) return 1;
  if (totalRounds === 6) return 2;
  if (totalRounds <= 8) return 2;
  if (totalRounds <= 11) return 3;
  if (totalRounds <= 14) return 4;
  if (totalRounds <= 16) return 5;
  if (totalRounds <= 18) return 6;
  if (totalRounds === 19) return 7;
  return 8; // 20+ rounds, use best 8
};

/**
 * Calculate handicap index from an array of rounds
 * Returns null if insufficient rounds are available
 */
export const calculateHandicapIndex = (
  rounds: Round[]
): HandicapData | null => {
  if (rounds.length < 3) {
    return null; // Need at least 3 rounds
  }

  // Calculate differentials for all rounds
  const differentials = rounds.map((round) => ({
    differential: calculateDifferential(
      round.score,
      round.course.rating,
      round.course.slope
    ),
    date: round.date,
  }));

  // Sort by differential (lowest to highest)
  differentials.sort((a, b) => a.differential - b.differential);

  // Determine how many of the best differentials to use
  const roundsToUse = getNumberOfRoundsToUse(rounds.length);

  if (roundsToUse === 0) {
    return null;
  }

  // Take the average of the best differentials
  const bestDifferentials = differentials.slice(0, roundsToUse);
  const average =
    bestDifferentials.reduce((sum, d) => sum + d.differential, 0) / roundsToUse;

  // Handicap Index is the average multiplied by 0.96
  const handicapIndex = average * 0.96;

  return {
    handicapIndex: Math.round(handicapIndex * 10) / 10, // Round to 1 decimal
    roundsUsed: roundsToUse,
    totalRounds: rounds.length,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Format handicap index for display
 */
export const formatHandicapIndex = (handicapIndex: number | null): string => {
  if (handicapIndex === null) return "N/A";
  return handicapIndex >= 0
    ? `+${handicapIndex.toFixed(1)}`
    : handicapIndex.toFixed(1);
};
