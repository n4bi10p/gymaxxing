import { describe, expect, it } from 'vitest';
import {
  convertWeight,
  defaultIncrement,
  detectPRs,
  epley1RM,
  formatWeight,
  muscleSetCounts,
  previousPerformance,
  roundToIncrement,
  sessionVolume,
  setVolume,
  suggestProgression,
} from './index';

describe('setVolume', () => {
  it('multiplies weight by reps', () => {
    expect(setVolume({ weight: 100, reps: 5 })).toBe(500);
  });

  it('skips incomplete sets and warmups', () => {
    expect(setVolume({ weight: 100, reps: 5, completed: false })).toBe(0);
    expect(setVolume({ weight: 60, reps: 10, kind: 'warmup' })).toBe(0);
    expect(setVolume({ weight: 60, reps: 10, kind: 'warmup' }, { includeWarmup: true })).toBe(600);
  });

  it('rejects non-positive numbers', () => {
    expect(setVolume({ weight: 0, reps: 5 })).toBe(0);
    expect(setVolume({ weight: 40, reps: -1 })).toBe(0);
    expect(sessionVolume([{ weight: 80, reps: 8 }, { weight: 80, reps: 6, completed: false }])).toBe(640);
  });
});

describe('epley1RM', () => {
  it('returns the weight for a single', () => {
    expect(epley1RM(120, 1)).toBe(120);
  });

  it('estimates from reps', () => {
    expect(epley1RM(100, 5)).toBeCloseTo(116.666, 2);
  });

  it('returns 0 for invalid input', () => {
    expect(epley1RM(0, 5)).toBe(0);
    expect(epley1RM(100, 0)).toBe(0);
    expect(epley1RM(Number.NaN, 5)).toBe(0);
  });
});

describe('units', () => {
  it('converts kg and lb', () => {
    expect(convertWeight(100, 'kg', 'lb')).toBeCloseTo(220.462, 2);
    expect(convertWeight(220.46226218, 'lb', 'kg')).toBeCloseTo(100, 4);
    expect(convertWeight(60, 'kg', 'kg')).toBe(60);
  });

  it('rounds to the plate increment', () => {
    expect(roundToIncrement(82.4, 2.5)).toBe(82.5);
    expect(defaultIncrement('lb')).toBe(5);
    expect(formatWeight(72.5, 'kg')).toBe('72.5 kg');
  });
});

describe('detectPRs', () => {
  const history = [
    { weight: 100, reps: 5 },
    { weight: 100, reps: 3 },
  ];

  it('marks the first set as every kind of PR', () => {
    expect(detectPRs({ weight: 60, reps: 8 }, [])).toEqual({
      weight: true,
      reps: true,
      estimated1RM: true,
    });
  });

  it('detects a heavier weight and a rep PR at the same weight', () => {
    expect(detectPRs({ weight: 105, reps: 1 }, history).weight).toBe(true);
    expect(detectPRs({ weight: 100, reps: 6 }, history)).toMatchObject({
      weight: false,
      reps: true,
    });
  });

  it('detects an estimated 1RM PR without a weight PR', () => {
    const flags = detectPRs({ weight: 90, reps: 12 }, history);
    expect(flags.weight).toBe(false);
    expect(flags.estimated1RM).toBe(true);
  });

  it('ignores an empty candidate', () => {
    expect(detectPRs({ weight: 0, reps: 5 }, history)).toEqual({
      weight: false,
      reps: false,
      estimated1RM: false,
    });
  });
});

describe('suggestProgression', () => {
  const range = { min: 6, max: 8 };

  it('adds weight when every set hits the top of the range', () => {
    const result = suggestProgression({
      sets: [
        { weight: 80, reps: 8, completed: true },
        { weight: 80, reps: 8, completed: true },
      ],
      repRange: range,
      increment: 2.5,
    });
    expect(result).toMatchObject({ action: 'increase', nextWeight: 82.5 });
  });

  it('holds after the first miss', () => {
    const result = suggestProgression({
      sets: [{ weight: 80, reps: 4, completed: true }],
      repRange: range,
      increment: 2.5,
      consecutiveFailures: 0,
    });
    expect(result.action).toBe('hold');
    expect(result.nextWeight).toBe(80);
  });

  it('deloads after a second miss', () => {
    const result = suggestProgression({
      sets: [{ weight: 80, reps: 4, completed: true }],
      repRange: range,
      increment: 2.5,
      consecutiveFailures: 1,
    });
    expect(result.action).toBe('deload');
    expect(result.nextWeight).toBe(72.5);
  });

  it('holds when nothing was completed', () => {
    const result = suggestProgression({
      sets: [{ weight: 50, reps: 0, completed: false }],
      repRange: range,
      increment: 2.5,
    });
    expect(result.action).toBe('hold');
    expect(result.nextWeight).toBe(50);
  });
});

describe('history helpers', () => {
  it('returns the latest session that has completed work', () => {
    const latest = previousPerformance([
      { performedAt: '2026-09-01T00:00:00.000Z', sets: [{ weight: 40, reps: 8 }] },
      { performedAt: '2026-10-01T00:00:00.000Z', sets: [{ weight: 50, reps: 5 }] },
      { performedAt: '2026-10-02T00:00:00.000Z', sets: [{ weight: 50, reps: 0, completed: false }] },
    ]);
    expect(latest?.performedAt).toBe('2026-10-01T00:00:00.000Z');
  });

  it('counts primary sets fully and secondary sets by half', () => {
    const counts = muscleSetCounts([
      { muscles: ['chest'], secondary: ['triceps'], completedSets: 4 },
      { muscles: ['triceps'], completedSets: 2 },
    ]);
    expect(counts).toEqual([
      { muscle: 'chest', sets: 4 },
      { muscle: 'triceps', sets: 4 },
    ]);
  });
});
