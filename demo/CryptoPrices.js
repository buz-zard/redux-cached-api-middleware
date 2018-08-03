import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as cachedApi from 'redux-cached-api-middleware';

import CryptoCard from './CryptoCard';

class CryptoPrices extends React.Component {
  async componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  render() {
    const {
      data: { btc, eth, xrp, ltc },
    } = this.props;
    return (
      <div className="my-5 overflow-x-auto px-4">
        <h2 className="mx-2">Cryptocurrencies</h2>
        <div className="flex flex-wrap my-3">
          <CryptoCard data={btc} />
          <CryptoCard data={eth} />
          <CryptoCard data={xrp} />
          <CryptoCard data={ltc} />
        </div>
        <div className="mx-2 my-6">
          <b>Note:</b> Cryptocurrency values are powered by{' '}
          <a
            href="https://www.cryptonator.com/api/"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            cryptonator API
          </a>. Each request is cached for 10 minutes. Check{' '}
          <a
            href="https://github.com/buz-zard/redux-cached-api-middleware/tree/master/demo"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            source
          </a>{' '}
          for implementation details.
        </div>
      </div>
    );
  }
}

CryptoPrices.propTypes = {
  fetchData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    btc: PropTypes.shape({}).isRequired,
    eth: PropTypes.shape({}).isRequired,
    xrp: PropTypes.shape({}).isRequired,
    ltc: PropTypes.shape({}).isRequired,
  }).isRequired,
};

const API_BASE_URL = 'https://api.cryptonator.com/api/';
const BTC_URL = `${API_BASE_URL}ticker/btc-usd`;
const BTC_CACHE_KEY = 'GET/ticker/btc-usd';
const ETH_URL = `${API_BASE_URL}ticker/eth-usd`;
const ETH_CACHE_KEY = 'GET/ticker/eth-usd';
const XRP_URL = `${API_BASE_URL}ticker/xrp-usd`;
const XRP_CACHE_KEY = 'GET/xrp-usd';
const LTC_URL = `${API_BASE_URL}ticker/ltc-usd`;
const LTC_CACHE_KEY = 'GET/ltc-usd';

const enhance = connect(
  state => ({
    data: {
      btc: cachedApi.selectors.getResult(state, BTC_CACHE_KEY),
      eth: cachedApi.selectors.getResult(state, ETH_CACHE_KEY),
      xrp: cachedApi.selectors.getResult(state, XRP_CACHE_KEY),
      ltc: cachedApi.selectors.getResult(state, LTC_CACHE_KEY),
    },
  }),
  dispatch => ({
    dispatch,
    fetchData: () => {
      const baseOptions = {
        method: 'GET',
        headers: { Accept: 'application/json' },
      };
      const makeCache = key => ({
        key,
        strategy: cachedApi.cache
          .get(cachedApi.constants.CACHE_TYPES.TTL_SUCCESS)
          .buildStrategy({ ttl: 10 * 60 * 1000 }), // 10 minutes
      });

      dispatch(
        cachedApi.actions.callAPI({
          ...baseOptions,
          endpoint: BTC_URL,
          cache: makeCache(BTC_CACHE_KEY),
        })
      );
      dispatch(
        cachedApi.actions.callAPI({
          ...baseOptions,
          endpoint: ETH_URL,
          cache: makeCache(ETH_CACHE_KEY),
        })
      );
      dispatch(
        cachedApi.actions.callAPI({
          ...baseOptions,
          endpoint: XRP_URL,
          cache: makeCache(XRP_CACHE_KEY),
        })
      );
      dispatch(
        cachedApi.actions.callAPI({
          ...baseOptions,
          endpoint: LTC_URL,
          cache: makeCache(LTC_CACHE_KEY),
        })
      );
    },
  })
);

export default enhance(CryptoPrices);