// jest.config.cjs
module.exports = {
  // Simulate a browser-like environment for React components
  testEnvironment: 'jsdom',

  // Global setup (Testing Library, custom matchers, etc.)
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.js'],

  // Where to look for tests
  // e.g. src/components/Foo.test.jsx or src/__tests__/Foo.test.jsx
  testMatch: ['<rootDir>/src/test/**/*.test.[jt]s?(x)'],

  // Tell Jest how to handle JS/JSX
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  // Make CSS imports “just work” in components
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // OPTIONAL: ignore built output so Jest doesn’t crawl it
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // OPTIONAL: avoids state leaking between tests
  clearMocks: true,
};
