// src/utils/mood.js
import { Brand } from './brandText';

// Tweak thresholds anytime
const THRESH = {
  fullness: 30,
  happiness: 30,
  energy: 30,
};

/**
 * Returns an array of mood strings based on low stats.
 * Example: ["Hungry! Needs a snack 🍖", "Sleepy… let them rest 😴"]
 */
export function moodFor(pet) {
  if (!pet) return [];
  const msgs = [];
  if (typeof pet.fullness === 'number' && pet.fullness <= THRESH.fullness) {
    msgs.push(Brand.statuses.lowFood);
  }
  if (typeof pet.happiness === 'number' && pet.happiness <= THRESH.happiness) {
    msgs.push(Brand.statuses.lowHappy);
  }
  if (typeof pet.energy === 'number' && pet.energy <= THRESH.energy) {
    msgs.push(Brand.statuses.lowEnergy);
  }
  return msgs;
}
