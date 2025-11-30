/**
 * Custom hook for handicap calculations
 * Automatically recalculates handicap when rounds change
 */

import { useMemo } from "react";
import { Round, HandicapData } from "../types";
import { calculateHandicapIndex } from "../utils/handicapCalculator";

export const useHandicap = (rounds: Round[]): HandicapData | null => {
  const handicapData = useMemo(() => {
    return calculateHandicapIndex(rounds);
  }, [rounds]);

  return handicapData;
};
