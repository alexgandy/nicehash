'use strict';

const _ = require('lodash');
const got = require('got');
const pkg = require('./package.json');

const gotOptions = {
    json: true,
    headers: {
        'user-agent': `node-nicehash/${pkg.version} (https://github.com/alexgandy/nicehash)`
    }
};

const API_BASE_URL = 'https://api.nicehash.com/api';

const LOCATIONS = {
    0: 'europe', // NiceHash
    1: 'usa'     // WestHash
};

const ALGORITHMS = {
    0: 'scrypt',
    1: 'sha256',
    2: 'scryptnf',
    3: 'x11',
    4: 'x13',
    5: 'keccak',
    6: 'x15',
    7: 'nist5',
    8: 'neoscrypt',
    9: 'lyra2re',
    10: 'whirlpoolx',
    11: 'qubit',
    12: 'quark',
    13: 'axiom',
    14: 'lyra2rev2',
    15: 'scryptjanenf16',
    16: 'blake256r8',
    17: 'blake256r14',
    18: 'blake256r8vnl',
    19: 'hodl',
    20: 'daggerhashimoto',
    21: 'decred',
    22: 'cryptonight',
    23: 'lbry',
    24: 'equihash',
    25: 'pascal',
    26: 'x11gost',
    27: 'sia',
    28: 'blake2s',
    29: 'skunk',
    30: 'cryptonightv7'
};

const ORDER_TYPES = {
    0: 'standard',
    1: 'fixed'
};

class NiceHashClient {
    /**
     * Creates a new client
     * @param options Object
     * @param options.apiId String - API ID
     * @param options.apiKey String - API Key (note: Do not use read-only)
     */
    constructor(options) {
        this.apiId = _.get(options, 'apiId');
        this.apiKey = _.get(options, 'apiKey');
    }

    hasAuthTokens() {
        return !!this.apiId && !!this.apiKey;;
    }

    getAuthParams() {
        return { id: this.apiId, key: this.apiKey };
    }

    getRequestPromise(methodName, queryParams) {
        const methodObj = { method: methodName };
        const payload = _.merge({}, gotOptions, {query: _.merge(methodObj, queryParams || {})});

        return got(`${API_BASE_URL}`, payload);
    }

    // AUTHENTICATED API ENDPOINTS

    /**
     * Get all orders for certain algorithm owned by the customer. Refreshed every 30 seconds.
     * @param location - 0 for Europe (NiceHash), 1 for USA (WestHash).
     * @param algo - Algorithm marked with ID
     */
    getMyOrders(location, algo) {
        const params = _.merge({location, algo, my: ''}, this.getAuthParams());
        return this.getRequestPromise('orders.get', params);
    }

    /**
     * Create new order. Only standard orders can be created with use of API.
     * @param orderOptions Object
     * @param orderOptions.location Number - 0 for Europe (NiceHash), 1 for USA (WestHash).
     * @param orderOptions.algo Number - Algorithm marked with ID.
     * @param orderOptions.amount Number - Pay amount in BTC.
     * @param orderOptions.price Number - Price in BTC/GH/Day or BTC/TH/Day.
     * @param orderOptions.limit Number - Speed limit in GH/s or TH/s (0 for no limit).
     * @param orderOptions.code - Required code if 2FA is enabled
     * @param orderOptions.pool_host String - Pool hostname or IP.
     * @param orderOptions.pool_port String - Pool port.
     * @param orderOptions.pool_user String - Pool username.
     * @param orderOptions.pool_pass String - Pool password.
     */
    createOrder(orderOptions) {
        const params = _.merge(orderOptions, this.getAuthParams());

        return this.getRequestPromise('orders.create', params);
    }

    /**
     * Refill order with extra Bitcoins.
     * @param orderOptions Object
     * @param orderOptions.location Number - 0 for Europe (NiceHash), 1 for USA (WestHash).
     * @param orderOptions.algo Number - Algorithm marked with ID.
     * @param orderOptions.order Number - Existing orderId.
     * @param orderOptions.amount Number - Pay amount in BTC.
     */
    refillOrder(orderOptions) {
        const params = _.merge(orderOptions, this.getAuthParams());

        return this.getRequestPromise('orders.refill', params);
    }

    /**
     * Remove existing order.
     * @param orderOptions Object
     * @param orderOptions.location Number - 0 for Europe (NiceHash), 1 for USA (WestHash).
     * @param orderOptions.algo Number - Algorithm marked with ID.
     * @param orderOptions.order Number - Existing orderId.
     */
    removeOrder(orderOptions) {
        const params = _.merge(orderOptions, this.getAuthParams());

        return this.getRequestPromise('orders.remove', params);
    }

    /**
     * Set new price for the existing order. Only increase is possible.
     * @param orderOptions Object
     * @param orderOptions.location Number - 0 for Europe (NiceHash), 1 for USA (WestHash).
     * @param orderOptions.algo Number - Algorithm marked with ID.
     * @param orderOptions.order Number - Existing orderId.
     * @param orderOptions.price Number - Price in BTC/GH/Day or BTC/TH/Day
     */
    setOrderPrice(orderOptions) {
        const params = _.merge(orderOptions, this.getAuthParams());

        return this.getRequestPromise('orders.set.price', params);
    }

    /**
     * Decrease price for the existing order. Price decrease possible every 10 minutes.
     * @param orderOptions Object
     * @param orderOptions.location Number - 0 for Europe (NiceHash), 1 for USA (WestHash).
     * @param orderOptions.algo Number - Algorithm marked with ID.
     * @param orderOptions.order Number - Existing orderId.
     */
    decreaseOrderPrice(orderOptions) {
        const params = _.merge(orderOptions, this.getAuthParams());

        return this.getRequestPromise('orders.set.price.decrease', params);
    }

    /**
     * Set new limit for existing order
     * @param orderOptions Object
     * @param orderOptions.location Number - 0 for Europe (NiceHash), 1 for USA (WestHash).
     * @param orderOptions.algo Number - Algorithm marked with ID.
     * @param orderOptions.order Number - Existing orderId.
     * @param orderOptions.limit Number - Speed limit in GH/s or TH/s (0 for no limit).
     */
    setOrderLimit(orderOptions) {
        const params = _.merge(orderOptions, this.getAuthParams());

        return this.getRequestPromise('orders.set.limit', params);
    }

    getMyBalance() {
        return this.getRequestPromise('balance', this.getAuthParams());
    }

    // PUBLIC API ENDPOINTS

    static getApiVersion() {
        return got(API_BASE_URL, gotOptions);
    }

    static getNiceHashAlgorithmNumberByName(algoName) {
        return _.findKey(ALGORITHMS, (i) => { return i === algoName }) || null;
    }

    static getAlgorithmNameByNiceHashNumber(number) {
        return ALGORITHMS[number] || null;
    }

    /**
     * Get current profitability (price) and hashing speed for all algorithms. Refreshed every 30 seconds
     * @param location {Number} - Location, 0 for Europe, 1 for USA. Optional
     * @return {*}
     */
    getGlobalCurrentStats(location) {
        return this.getRequestPromise('stats.global.current', location ? {location} : null);
    }

    /**
     * Get average profitability (price) and hashing speed for all algorithms in past 24 hours.
     * @return {*}
     */
    getGlobal24hStats() {
        return this.getRequestPromise('stats.global.24h');
    }

    /**
     * Get current stats for provider for all algorithms. Refreshed every 30 seconds. It also returns past 56 payments.
     * @param addr
     * @return {*}
     */
    getProviderStats(addr) {
        return this.getRequestPromise('stats.global.24h', { addr });
    }

    /**
     * Get details stats for provider for all algorithms including history data and past 56 payments
     * @param addr String - Providers BTC address
     * @param from String['0'] - Get history from this time (Unix timestamp)
     * @return {*}
     */
    getDetailedProviderStats(addr, from) {
        if (!from) {
            from = '0';
        }

        return this.getRequestPromise('stats.provider.ex', { addr, from });
    }

    /**
     * Get detailed stats for provider's workers (rigs).
     * @param addr String - Provider's BTC Address
     * @param algo Number - Algorithm marked with ID
     * @return {*}
     */
    getProviderWorkersStats(addr, algo) {
        return this.getRequestPromise('stats.provider.workers', { addr, algo });
    }
    
    /**
     * Get detailed stats for provider's workers (rigs).
     * @param addr String - Provider's BTC Address
     * @param algo Number - Algorithm marked with ID
     * @return {*}
     */
    getAllProviderWorkersStats(addr) {
        return this.getRequestPromise('stats.provider.workers', { addr });
    }

    /**
     * Get all orders for certain algorithm. Refreshed every 30 seconds.
     * @param location Number - 0 for Europe (NiceHash), 1 for USA (WestHash)
     * @param algo Number - Algorithm marked with ID
     * @return {*}
     */
    getOrders(location, algo) {
        return this.getRequestPromise('orders.get', { location, algo });
    }

    /**
     * Get information about Multi-Algorithm Mining.
     * @return {*}
     */
    getMultiAlgorithmMiningInfo() {
        return this.getRequestPromise('multialgo.info');
    }

    /**
     * Get information about Simple Multi-Algorithm Mining.
     * More here: https://www.nicehash.com/?p=simplemultialgo
     * @return {*}
     */
    getSimpleMultiAlgorithmMiningInfo() {
        return this.getRequestPromise('simplemultialgo.info');
    }

    /**
     * Get needed information for buying hashing power using NiceHashBot.
     * https://github.com/nicehash/NiceHashBot
     * @return {*}
     */
    getNeededBuyingInfo() {
        return this.getRequestPromise('buy.info');
    }
}

module.exports = NiceHashClient;
