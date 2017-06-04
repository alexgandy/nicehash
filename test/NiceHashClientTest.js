'use strict';

const _ = require('lodash');
const should = require('chai').should();
const NiceHashClient = require('../NiceHashClient');

let nh = null;

context('NiceHashClient', () => {
    describe('hasAuthTokens', () => {
        it('should correctly determine if we have auth variables', () => {
            nh = new NiceHashClient({apiId: 12345});
            nh.hasAuthTokens().should.eql(false);
            nh.apiKey = 'test';
            nh.hasAuthTokens().should.eql(true);
        });
    });

    context('Public API Methods', () => {
        before(() => {
            nh = new NiceHashClient({apiId: 12345, apiKey: 123456});
        });

        describe('getApiVersion', () => {
            it('should correctly get the API version', function(done) {
                NiceHashClient.getApiVersion().then((response) => {
                    response.body.result.api_version.should.eql('1.2.6');
                    done();
                });
            });
        });

        describe('getGlobalCurrentStats', () => {
            it('should correctly get global current stats', function(done) {
                nh.getGlobalCurrentStats().then((response) => {
                    _.isArray(response.body.result.stats).should.be.true;
                    done();
                });
            });
        });

        describe('getGlobal24hStats', () => {
            it('should correctly get global current stats', function(done) {
                nh.getGlobal24hStats().then((response) => {
                    _.isArray(response.body.result.stats).should.be.true;
                    done();
                });
            });
        });

        describe('getProviderStats', () => {
            it('should get provider stats', function(done) {
                const testAddress = `1P5PNW6Wd53QiZLdCs9EXNHmuPTX3rD6hW`;
                nh.getProviderStats(testAddress).then((response) => {
                    const result = response.body.result || {};
                    _.isArray(result.stats).should.be.true;
                    done();
                });
            });
        });

        describe('getDetailedProviderStats', () => {
            it('should get detailed provider stats', function(done) {
                const testAddress = `1P5PNW6Wd53QiZLdCs9EXNHmuPTX3rD6hW`;
                nh.getDetailedProviderStats(testAddress).then((response) => {
                    const result = response.body.result || {};
                    _.isArray(result.current).should.be.true;
                    response.body.result.addr.should.eql(testAddress);
                    done();
                });
            });
        });

        describe('getProviderWorkersStats', () => {
            it('should get provider workers stats', function(done) {
                const testAddress = `17a212wdrvEXWuipCV5gcfxdALfMdhMoqh`;
                const testAlgo = 3;
                nh.getProviderWorkersStats(testAddress, testAlgo).then((response) => {
                    const result = response.body.result || {};
                    result.addr.should.eql(testAddress);
                    result.algo.should.eql(testAlgo);
                    _.isArray(result.workers).should.be.true;
                    done();
                });
            });
        });

        describe('getOrders', () => {
            it('should get all orders', function(done) {
                const testLocation = 1;
                const testAlgo = 3;
                nh.getOrders(testLocation, testAlgo).then((response) => {
                    const result = response.body.result || {};
                    _.isArray(result.orders).should.be.true;
                    should.exist(result.timestamp);
                    done();
                });
            });
        });

        describe('getMultiAlgorithmMiningInfo', () => {
            it('should get multi algo stats', function(done) {
                nh.getMultiAlgorithmMiningInfo().then((response) => {
                    const result = response.body.result || {};
                    _.isArray(result.multialgo).should.be.true;
                    done();
                });
            });
        });

        describe('getSimpleMultiAlgorithmMiningInfo', () => {
            it('should correctly return simple multi algo info', function(done) {
                nh.getSimpleMultiAlgorithmMiningInfo().then((response) => {
                    const result = response.body.result || {};
                    _.isArray(result.simplemultialgo).should.be.true;
                    done();
                });
            });
        });

        describe('getNeededBuyingInfo', () => {
            it('should correct returning buying power info', function(done) {
                nh.getNeededBuyingInfo().then((response) => {
                    const result = response.body.result || {};
                    _.isArray(result.algorithms).should.be.true;
                    should.exist('down_time');
                    should.exist('static_fee');
                    should.exist('min_amount');
                    should.exist('dynamic_fee');
                    done();
                });
            });
        });
    });

    context('Private API Methods', () => {
        before(() => {
           nh = new NiceHashClient({});
        });

        describe('getMyOrders', () => {
            it(`should correctly get a user's orders`, function(done) {
                nh.getMyOrders(1, 3).then((response) => {
                    const result = response.body.result || {};
                    _.isArray(result.orders).should.be.true;
                    done();
                });
            });
        });

        describe('getMyBalance', () => {
            it(`should correctly get a user's orders`, function(done) {
                nh.getMyBalance().then((response) => {
                    const result = response.body.result || {};
                    should.exist(result.balance_pending);
                    should.exist(result.balance_confirmed);
                    done();
                });
            });
        });
    });
});