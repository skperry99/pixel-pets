// src/test/jest.setup.js

// Extend Jest's assertions (toBeInTheDocument, etc.)
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for react-router / other deps in Jest
import { TextEncoder, TextDecoder } from 'util';

const g = globalThis;

// Only assign if they don't already exist
if (typeof g.TextEncoder === 'undefined') {
  g.TextEncoder = TextEncoder;
}

if (typeof g.TextDecoder === 'undefined') {
  // utf-8 is usually enough for tests
  g.TextDecoder = TextDecoder;
}

// Also mirror onto window for good measure (jsdom env)
if (typeof g.window !== 'undefined') {
  if (typeof g.window.TextEncoder === 'undefined') {
    g.window.TextEncoder = g.TextEncoder;
  }
  if (typeof g.window.TextDecoder === 'undefined') {
    g.window.TextDecoder = g.TextDecoder;
  }
}
