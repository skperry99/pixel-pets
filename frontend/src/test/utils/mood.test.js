// src/utils/mood.test.js
import { moodFor } from '../../utils/mood';
import { Brand } from '../../utils/brandText';

describe('moodFor', () => {
  it('returns empty array when pet is null/undefined', () => {
    expect(moodFor(null)).toEqual([]);
    expect(moodFor(undefined)).toEqual([]);
  });

  it('returns no messages when stats are above thresholds', () => {
    const pet = { fullness: 80, happiness: 80, energy: 80 };
    expect(moodFor(pet)).toEqual([]);
  });

  it('returns branded messages when stats are low', () => {
    const pet = { fullness: 10, happiness: 20, energy: 15 };
    const result = moodFor(pet);

    expect(result).toContain(Brand.statuses.lowFood);
    expect(result).toContain(Brand.statuses.lowHappy);
    expect(result).toContain(Brand.statuses.lowEnergy);
  });
});
