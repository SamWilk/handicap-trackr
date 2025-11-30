/**
 * LocalStorage service for persisting golf rounds data
 * Provides encapsulated access to browser storage with type safety
 */

import { Round } from "../types";

const STORAGE_KEY = "golf_handicap_rounds";

export class StorageService {
  /**
   * Retrieve all rounds from localStorage
   */
  static getRounds(): Round[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const rounds = JSON.parse(data) as Round[];
      return rounds;
    } catch (error) {
      console.error("Error reading rounds from storage:", error);
      return [];
    }
  }

  /**
   * Save all rounds to localStorage
   */
  static saveRounds(rounds: Round[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
    } catch (error) {
      console.error("Error saving rounds to storage:", error);
      throw new Error("Failed to save rounds");
    }
  }

  /**
   * Add a new round to storage
   */
  static addRound(round: Round): void {
    const rounds = this.getRounds();
    rounds.push(round);
    this.saveRounds(rounds);
  }

  /**
   * Delete a round by ID
   */
  static deleteRound(id: string): void {
    const rounds = this.getRounds();
    const filtered = rounds.filter((round) => round.id !== id);
    this.saveRounds(filtered);
  }

  /**
   * Clear all rounds from storage
   */
  static clearAllRounds(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
