// src/utils/brandText.js
/**
 * Centralized brand copy + small helper text snippets for Pixel Pets.
 * - Keeps UI text consistent across pages/components
 * - Safe to import anywhere in the frontend
 */
export const Brand = {
  app: 'Pixel Pets',

  // Taglines / descriptions
  taglines: {
    short: 'Because every pixel deserves a little love.',
    long: 'Adopt, feed, play, and keep your retro pixel pals happy.',
    powered: 'Powered by caffeine and nostalgia.',
  },

  // Layout defaults (nav/header/footer, etc.)
  layout: {
    headerTitle: 'PIXEL PETS',
    headerSubtitle: '✨ Because every pixel deserves a little love. 🐾',
    footerTagline: 'Because every pixel deserves a little love. 🐾',
    footerCredit: 'Made with 💛 by Sarah',
  },

  // Toast copy for NoticeProvider / screens
  toasts: {
    profilePatched: 'Profile patched! 🩹',
    passwordPatched: 'Password patched! 🔐🩹',
    adopted: (name, type) => `Adopted ${name} the ${type}! 🎉🐾`,
    fed: 'Nom nom! 🍖',
    played: 'So much fun! 🎮',
    rest: 'Zzz… 😴',
    released: 'Pet released. 🐾',
    welcome: 'Welcome back! 🐾',
    accountCreated: 'Account created! Welcome to Pixel Pets.',

    konami: 'Konami unlocked! 🕹️ Theme toggle + confetti!',
  },

  // Auth-related UI text
  auth: {
    loginTitle: 'Log In',
    registerTitle: 'Create Account',
    newHere: 'New to Pixel Pets?',
    hasAccount: 'Already have an account?',
    loginCta: 'Log In',
    registerCta: 'Register',
    createAccountCta: 'Create Account',
  },

  // Validation helpers
  validation: {
    usernameAndPasswordRequired: 'Username and password are required.',
    allFieldsRequired: 'All fields are required.',
    usernameLength: 'Username must be 3–30 characters.',
    emailInvalid: 'Please enter a valid email address.',
    passwordMin: 'Password must be at least 8 characters.',
  },

  // Generic error fallbacks
  errors: {
    loginFailed: 'Login failed.',
    registrationFailed: 'Registration failed.',
  },

  // Empty-state filler text
  emptyStates: {
    pets: 'No pets yet. Adopt your first pixel pal!',
  },

  // Small helper hints / tips
  hints: {
    dashboard: 'Tip: keep stats green for happy pixels.',
    notFound: 'Tip: use the navigation above to find your way.',
  },

  // Status messages for pet mood
  statuses: {
    lowFood: 'Hungry! Needs a snack 🍖',
    lowHappy: 'Bored! Time to play 🎮',
    lowEnergy: 'Sleepy… let them rest 😴',
  },

  // Misc copy
  copy: {
    jsRequired: 'Pixel Pets needs JavaScript enabled.',
  },
};
