// src/utils/brandText.js
/**
 * Centralized brand copy + small helper text snippets for Pixel Pets.
 * - Keeps UI text consistent across pages/components
 * - Safe to import anywhere in the frontend
 */

function adoptionMessage(name, type) {
  const key = String(type || '').toLowerCase();

  switch (key) {
    case 'dog':
      return `You adopted ${name} the Dog — loyal, wiggly, and ready for fetch! 🐶🎾`;
    case 'cat':
      return `You adopted ${name} the Cat — dignified, curious, and a little bit bossy. 🐱✨`;
    case 'dragon':
      return `You adopted ${name} the Dragon — tiny but mighty, with a spark of chaos. 🐉🔥`;
    case 'bunny':
      return `You adopted ${name} the Bunny — a bouncy bundle of floof and zoomies. 🐰🥕`;
    case 'blob':
      return `You adopted ${name} the Blob — soft, squishy, and surprisingly expressive. 🟢✨`;
    default:
      // generic fallback for any future pet types
      return `You adopted ${name} the ${type || 'mystery pet'}! 🎉🐾`;
  }
}

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
    footerTagline: 'Because every pixel deserves a little love.',
    footerCredit: 'Made with 💛 by Sarah',
  },

  // Toast copy for NoticeProvider / screens
  // FUN, QUIRKY, ON-BRAND
  toasts: {
    profilePatched: 'Profile patched! 🩹',
    passwordPatched: 'Password patched! 🔐🩹',

    adopted: adoptionMessage,

    fed: 'Nom nom! 🍖',
    feedError: 'Feeding failed — your pet is still hungry. 😿',

    played: 'So much fun! 🎮',
    playError: 'Playtime fizzled — try again in a moment. 😿',

    rest: 'Zzz… 😴',
    restError: 'Couldn’t tuck them in — rest failed. 😿',

    released: 'Pet released. 🐾',
    releaseError: 'Could not release this pet. 😿',

    welcome: 'Welcome back! 🐾',
    accountCreated: 'Account created! Welcome to Pixel Pets.',

    konami: 'Konami unlocked! 🕹️ Theme toggle + confetti!',

    // Load failures (used with more detailed inline text)
    petLoadFailed: 'Couldn’t load that pet. 😿',
    petsLoadFailed: 'Couldn’t load your pets. 😿',
    profileLoadFailed: 'Couldn’t load your profile. 😿',
    profileError: 'Couldn’t save profile. 😿',
    passwordError: 'Couldn’t change password. 😿',
    accountDeleteError: 'Account deletion failed. 😿',
  },

  // More detailed, business-y inline messages
  inline: {
    profileLoadFailed:
      'Failed to load your profile. Please refresh the page or try again in a few minutes.',
    petsLoadFailed: 'Failed to load your pets. Please refresh the page or try again later.',
    petLoadFailed: 'Failed to load this pet. It may have been released or a server error occurred.',
    profileUpdateFailed: 'Profile update failed. Please review the fields below and try again.',
    passwordChangeFailed: 'Password change failed. Please check your password and try again.',
    accountDeleteFailed:
      'Account deletion failed. Please try again. If this continues, contact support.',
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
