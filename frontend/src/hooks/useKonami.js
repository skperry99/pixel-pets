import { useEffect, useRef } from 'react';
import { burstConfetti } from '../utils/confetti';

// Classic Konami sequence: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_KEYS = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * useKonami(onTrigger)
 *
 * Listens for the Konami code globally and then:
 * - Calls the optional onTrigger callback
 * - Toggles a "gb" theme via data-theme on <html>
 * - Fires a little confetti burst for fun
 */
export function useKonami(onTrigger) {
  const bufferRef = useRef([]);

  useEffect(() => {
    function handleKeyDown(event) {
      // Push the latest key and trim buffer length
      bufferRef.current.push(event.key);
      if (bufferRef.current.length > KONAMI_KEYS.length) {
        bufferRef.current.shift();
      }

      // Check for exact sequence match
      const isMatch = KONAMI_KEYS.every((key, index) => bufferRef.current[index] === key);
      if (!isMatch) return;

      // Fire callback if provided
      onTrigger?.();

      // Toggle "gb" (Game Boy) theme on <html>
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'gb' ? null : 'gb';

      if (next) {
        html.setAttribute('data-theme', next);
      } else {
        html.removeAttribute('data-theme');
      }

      // Retro celebration 🎉
      burstConfetti({ particleCount: 120, spread: 90 });
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger]);
}
