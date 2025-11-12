import { useEffect, useRef } from 'react';
import { burstConfetti } from '../utils/confetti';

const SEQ = [
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

export function useKonami(onTrigger) {
  const buf = useRef([]);
  useEffect(() => {
    function onKey(e) {
      buf.current.push(e.key);
      if (buf.current.length > SEQ.length) buf.current.shift();
      if (SEQ.every((k, i) => buf.current[i] === k)) {
        onTrigger?.();
        // fun: toggle theme data-attr on <html>
        const html = document.documentElement;
        const next = html.getAttribute('data-theme') === 'gb' ? null : 'gb'; // GameBoy palette
        if (next) html.setAttribute('data-theme', next);
        else html.removeAttribute('data-theme');
        burstConfetti({ particleCount: 120, spread: 90 });
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onTrigger]);
}
