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
      return `You adopted ${name} the ${type || 'mystery pet'}! 🎉🐾`;
  }
}

function feedMessage(name, type) {
  const key = String(type || '').toLowerCase();

  switch (key) {
    case 'dog':
      return `${name} the Dog devours their snack with a happy tail wag! 🐶🍖`;
    case 'cat':
      return `${name} the Cat nibbles delicately and pretends they weren’t hungry. 🐱🍗`;
    case 'dragon':
      return `${name} the Dragon gulps down a spicy snack and sparks flicker. 🐉🔥`;
    case 'bunny':
      return `${name} the Bunny munches in rapid little bites. 🐰🥕`;
    case 'blob':
      return `${name} the Blob absorbs the snack and wiggles contentedly. 🟢🍽️`;
    default:
      return `${name} enjoys a tasty snack! 🐾🍽️`;
  }
}

function playMessage(name, type) {
  const key = String(type || '').toLowerCase();

  switch (key) {
    case 'dog':
      return `${name} the Dog zooms around chasing invisible tennis balls. 🐶🎾`;
    case 'cat':
      return `${name} the Cat bats at toys, then pretends it was all on purpose. 🐱🧶`;
    case 'dragon':
      return `${name} the Dragon does tiny practice flights and shows off baby firebursts. 🐉✨`;
    case 'bunny':
      return `${name} the Bunny does zoomies and tiny binkies across the screen. 🐰💨`;
    case 'blob':
      return `${name} the Blob wobbles, bounces, and does surprisingly athletic oozes. 🟢🎮`;
    default:
      return `${name} has a great time playing! 🐾🎮`;
  }
}

function restMessage(name, type) {
  const key = String(type || '').toLowerCase();

  switch (key) {
    case 'dog':
      return `${name} the Dog curls up for a cozy nap. 🐶💤`;
    case 'cat':
      return `${name} the Cat becomes a perfect loaf and powers down. 🐱🍞💤`;
    case 'dragon':
      return `${name} the Dragon curls around a tiny hoard of pixels and drifts off. 🐉💤`;
    case 'bunny':
      return `${name} the Bunny flops over into maximum comfy mode. 🐰💤`;
    case 'blob':
      return `${name} the Blob settles into a slow, gentle pulse. 🟢💤`;
    default:
      return `${name} takes a well-earned rest. 🐾💤`;
  }
}

function releaseMessage(name, type) {
  const key = String(type || '').toLowerCase();

  switch (key) {
    case 'dog':
      return `${name} the Dog trots off to chase new adventures. 🐶✨`;
    case 'cat':
      return `${name} the Cat saunters away to rule another cozy corner. 🐱👑`;
    case 'dragon':
      return `${name} the Dragon soars off to guard a distant pixel kingdom. 🐉🏰`;
    case 'bunny':
      return `${name} the Bunny hops away into a field of endless snacks. 🐰🌱`;
    case 'blob':
      return `${name} the Blob oozes off to discover new, squishy horizons. 🟢🌈`;
    default:
      return `${name} wanders off to new adventures. 🐾✨`;
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

    fed: feedMessage,
    feedError: 'Feeding failed — your pet is still hungry. 😿',

    played: playMessage,
    playError: 'Playtime fizzled — try again in a moment. 😿',

    rest: restMessage,
    restError: 'Couldn’t tuck them in — rest failed. 😿',

    released: releaseMessage,
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

  // More detailed inline messages
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
