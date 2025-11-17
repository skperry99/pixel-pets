// src/utils/mood.test.js
import { moodFor } from '../../utils/mood';
import { Brand } from '../../utils/brandText';

describe('moodFor', () => {
  test('returns empty array for null/undefined pet', () => {
    expect(moodFor(null)).toEqual([]);
    expect(moodFor(undefined)).toEqual([]);
  });

  test('marks pet as hungry when fullness is low', () => {
    const pet = { fullness: 10, happiness: 80, energy: 80 };
    const mood = moodFor(pet);
    expect(mood).toContain(Brand.statuses.lowFood);
  });

  test('marks pet as bored when happiness is low', () => {
    const pet = { fullness: 80, happiness: 5, energy: 80 };
    const mood = moodFor(pet);
    expect(mood).toContain(Brand.statuses.lowHappy);
  });

  test('marks pet as sleepy when energy is low', () => {
    const pet = { fullness: 80, happiness: 80, energy: 5 };
    const mood = moodFor(pet);
    expect(mood).toContain(Brand.statuses.lowEnergy);
  });

  test('can return multiple mood strings when several stats are low', () => {
    const pet = { fullness: 5, happiness: 10, energy: 15 };
    const mood = moodFor(pet);

    expect(mood).toContain(Brand.statuses.lowFood);
    expect(mood).toContain(Brand.statuses.lowHappy);
    expect(mood).toContain(Brand.statuses.lowEnergy);
  });
});
