import { validateCacheModule } from '../__tests__/utils';
import * as simple from './simple';

const { shouldFetch } = simple;

describe('shouldFetch', () => {
  it('should be a valid module', () => {
    validateCacheModule(simple);
  });

  it('should fetch if no state', () => {
    expect(shouldFetch({})).toBe(true);
    expect(shouldFetch({ state: {} })).toBe(true);
  });

  it('should not fetch if it is fetching', () => {
    expect(shouldFetch({ state: { fetching: true } })).toBe(false);
  });

  it('should not fetch if it has already fetched', () => {
    expect(shouldFetch({ state: { fetched: true } })).toBe(false);
  });
});
