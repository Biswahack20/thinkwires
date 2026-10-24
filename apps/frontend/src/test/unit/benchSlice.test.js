import { describe, it, expect } from 'vitest';
import benchReducer, {
  setActiveSpecialty,
  setActiveUrgency,
  setActiveNoticePeriod,
  setActiveExperience,
  setActiveLocation,
  setSortBy,
  setSearchQuery,
  fallbackBenchData,
} from '../../store/slices/benchSlice';

describe('benchSlice reducer & actions', () => {
  it('returns initial state with AI Assessment default sort and All Notice Periods filter', () => {
    const state = benchReducer(undefined, { type: 'unknown' });
    expect(state.sortBy).toBe('AI Assessment');
    expect(state.activeNoticePeriod).toBe('All Notice Periods');
    expect(state.filterOptions.noticePeriod).toContain('30 Days');
    expect(state.filterOptions.sortOptions).toContain('AI Assessment');
  });

  it('updates activeNoticePeriod when setActiveNoticePeriod is dispatched', () => {
    const initialState = benchReducer(undefined, { type: 'unknown' });
    const nextState = benchReducer(initialState, setActiveNoticePeriod('30 Days'));
    expect(nextState.activeNoticePeriod).toBe('30 Days');
  });

  it('updates sortBy when setSortBy is dispatched', () => {
    const initialState = benchReducer(undefined, { type: 'unknown' });
    const nextState = benchReducer(initialState, setSortBy('Highest Score'));
    expect(nextState.sortBy).toBe('Highest Score');
  });

  it('contains valid noticePeriod and assessmentScore across fallback talents', () => {
    expect(fallbackBenchData.talents.length).toBeGreaterThan(0);
    const thirtyDayCandidates = fallbackBenchData.talents.filter(
      (t) => t.noticePeriod === '30 Days'
    );
    expect(thirtyDayCandidates.length).toBeGreaterThan(0);
    thirtyDayCandidates.forEach((cand) => {
      expect(cand.assessmentScore).toBeDefined();
      expect(typeof cand.assessmentScore).toBe('number');
    });
  });
});
