/**
 * Custom hook for managing golf rounds
 * Provides CRUD operations and state management for rounds
 */

import { useState, useEffect } from "react";
import { Round } from "../types";
import { StorageService } from "../services/storageService";

export const useRounds = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  // Load rounds on mount
  useEffect(() => {
    const loadRounds = () => {
      try {
        const storedRounds = StorageService.getRounds();
        // Sort by date descending (newest first)
        const sorted = storedRounds.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRounds(sorted);
      } catch (error) {
        console.error("Failed to load rounds:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRounds();
  }, []);

  const addRound = (round: Round) => {
    try {
      StorageService.addRound(round);
      setRounds((prev) => {
        const updated = [...prev, round];
        return updated.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });
    } catch (error) {
      console.error("Failed to add round:", error);
      throw error;
    }
  };

  const deleteRound = (id: string) => {
    try {
      StorageService.deleteRound(id);
      setRounds((prev) => prev.filter((round) => round.id !== id));
    } catch (error) {
      console.error("Failed to delete round:", error);
      throw error;
    }
  };

  const clearAllRounds = () => {
    try {
      StorageService.clearAllRounds();
      setRounds([]);
    } catch (error) {
      console.error("Failed to clear rounds:", error);
      throw error;
    }
  };

  return {
    rounds,
    loading,
    addRound,
    deleteRound,
    clearAllRounds,
  };
};
