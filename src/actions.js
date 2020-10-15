import { RSAA } from 'redux-api-middleware';

import cacheStrategies from './cache';
import config from './config';
import * as types from './actionTypes';
import * as selectors from './selectors';

export const invalidateCache = (payload) => ({
  type: types.INVALIDATE_CACHE,
  payload,
});

export const clearCache = (payload) => ({
  type: types.CLEAR_CACHE,
  payload,
});

export const invoke = ({ cache, ...restOptions }) => async (dispatch, getState) => {
  const action = {
    types: [],
    ...config.DEFAULT_INVOKE_OPTIONS,
    ...restOptions,
  };

  if (cache && cache.key) {
    const cacheStrategy = cache.strategy || config.DEFAULT_CACHE_STRATEGY;
    const result = selectors.getResult(getState(), cache.key);
    action.types = [
      { type: types.FETCH_START, meta: { cache } },
      { type: types.FETCH_SUCCESS, meta: { cache } },
      { type: types.FETCH_ERROR, meta: { cache } },
    ];

    if (cache.shouldFetch) {
      if (!cache.shouldFetch({ state: result })) {
        return undefined;
      }
    } else if (
      cacheStrategy &&
      !cacheStrategies
        .get(cacheStrategy.type)
        .shouldFetch({ state: result, strategy: cacheStrategy })
    ) {
      return undefined;
    }
  }

  return dispatch({ [RSAA]: action });
};
