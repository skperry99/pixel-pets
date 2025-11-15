/**
 * Centralized brand copy + small helper text snippets for Pixel Pets.
 * - Keeps UI text consistent across pages/components
 * - Safe to import anywhere in the frontend
 */
export const Brand = {
  app: 'Pixel Pets',

  // Toast copy for NoticeProvider
  toasts: {
    profilePatched: 'Profile patched! 🩹',
    passwordPatched: 'Password patched! 🔐🩹',
    adopted: (name, type) => `Adopted ${name} the ${type}! 🎉🐾`,
    fed: 'Nom nom! 🍖',
    played: 'So much fun! 🎮',
    rest: 'Zzz… 😴',
    released: 'Pet released. 🐾',
    welcome: 'Welcome back! 🐾',
  },

  // Empty-state filler text
  emptyStates: {
    pets: 'No pets yet. Adopt your first pixel pal!',
  },

  // Small helper hints / tips
  hints: {
    dashboard: 'Tip: keep stats green for happy pixels.',
  },

  // Status messages for pet mood
  statuses: {
    lowFood: 'Hungry! Needs a snack 🍖',
    lowHappy: 'Bored! Time to play 🎮',
    lowEnergy: 'Sleepy… let them rest 😴',
  },
};
