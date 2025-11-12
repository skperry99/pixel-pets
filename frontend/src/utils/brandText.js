export const Brand = {
  app: 'Pixel Pets',
  toasts: {
    profilePatched: 'Profile patched! 🩹',
    passwordPatched: 'Password patched! 🔐🩹',
    adopted: (n, t) => `Adopted ${n} the ${t}! 🎉🐾`,
    fed: 'Nom nom! 🍖',
    played: 'So much fun! 🎮',
    rest: 'Zzz… 😴',
    released: 'Pet released. 🐾',
    welcome: 'Welcome back! 🐾',
  },
  emptyStates: {
    pets: 'No pets yet. Adopt your first pixel pal!',
  },
  hints: {
    dashboard: 'Tip: keep stats green for happy pixels.',
  },
  statuses: {
    lowFood: 'Hungry! Needs a snack 🍖',
    lowHappy: 'Bored! Time to play 🎮',
    lowEnergy: 'Sleepy… let them rest 😴',
  },
};
