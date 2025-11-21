// src/utils/mood.js
// Derives simple “mood” messages for a pet based on low stats.

import { Brand } from './brandText';

// Thresholds for when a stat is considered “low”.
const THRESH = {
  fullness: 30,
  happiness: 30,
  energy: 30,
};

/**
 * Compute mood messages for a pet based on its stats.
 *
 * @param {Object} pet - Pet object with numeric stats.
 * @param {number} pet.fullness - 0–100 fullness.
 * @param {number} pet.happiness - 0–100 happiness.
 * @param {number} pet.energy - 0–100 energy.
 * @returns {string[]} Array of mood strings, e.g.
 *   ["Hungry! Needs a snack 🍖", "Sleepy… let them rest 😴"]
 */
export function moodFor(pet) {
  if (!pet) return [];

  const messages = [];

  if (typeof pet.fullness === 'number' && pet.fullness <= THRESH.fullness) {
    messages.push(Brand.statuses.lowFood);
  }
  if (typeof pet.happiness === 'number' && pet.happiness <= THRESH.happiness) {
    messages.push(Brand.statuses.lowHappy);
  }
  if (typeof pet.energy === 'number' && pet.energy <= THRESH.energy) {
    messages.push(Brand.statuses.lowEnergy);
  }

  return messages;
}
