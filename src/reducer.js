import * as types from './actionTypes';

export const DEFAULT_KEY_STATE = {
  fetching: false,
  fetched: false,
  error: false,
  timestamp: null,
  successPayload: null,
  errorPayload: null,
};

const DEFAULT_STATE = {};

export default (state = DEFAULT_STATE, { type, payload, meta }) => {
  switch (type) {
    case types.FETCH_START: {
      const key = meta.cache.key;
      return {
        ...state,
        [key]: {
          ...(state[key] || DEFAULT_KEY_STATE),
          fetching: true,
        },
      };
    }

    case types.FETCH_SUCCESS: {
      const key = meta.cache.key;
      if (key in state) {
        return {
          ...state,
          [key]: {
            ...state[key],
            fetching: false,
            fetched: true,
            error: false,
            timestamp: new Date().getTime(),
            successPayload: payload,
          },
        };
      }
      return state;
    }

    case types.FETCH_ERROR: {
      const key = meta.cache.key;
      if (key in state) {
        return {
          ...state,
          [key]: {
            ...state[key],
            fetching: false,
            fetched: true,
            error: true,
            timestamp: new Date().getTime(),
            errorPayload: payload,
          },
        };
      }
      return state;
    }

    default:
      return state;
  }
};