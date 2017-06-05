'use strict';

const _ = require('lodash');
const should = require('chai').should();
const NiceHashClient = require('../NiceHashClient');
const nock = require('nock');

let nh = new NiceHashClient({apiId: 12345, apiKey: 123456});;

context('NiceHashClient', () => {
    beforeEach(() => {
        nock('https://api.nicehash.com')
            .get('/api')
            .query(true)
            .reply(200, function(uri, requestBody) {
                return {ok: true, uri};
            })
    });

    after(() => {
        nock.restore();
    });

    describe('hasAuthTokens', () => {
        it('should correctly determine if we have auth variables', () => {
            nh = new NiceHashClient({apiId: 12345});
            nh.hasAuthTokens().should.eql(false);
            nh.apiKey = 'test';
            nh.hasAuthTokens().should.eql(true);
        });
    });

    context('Public API Methods', () => {
        describe('getApiVersion', () => {
            it('should correctly get the API version', function() {
                NiceHashClient.getApiVersion().then((response) => {
                    response.body.uri.should.eql('/api');
                });
            });
        });

        describe('getNiceHashAlgorithmNumberByName', () => {
            const daggerhashimoto = NiceHashClient.getNiceHashAlgorithmNumberByName('daggerhashimoto');
            daggerhashimoto.should.eql('20');

            const notFound = NiceHashClient.getNiceHashAlgorithmNumberByName(123);
            should.not.exist(notFound);
        });

        describe('getAlgorithmNameByNiceHashNumber', () => {
            const daggerhashimoto = NiceHashClient.getAlgorithmNameByNiceHashNumber(20);
            daggerhashimoto.should.eql('daggerhashimoto');

            const notFound = NiceHashClient.getAlgorithmNameByNiceHashNumber(123);
            should.not.exist(notFound);
        });


        describe('getGlobalCurrentStats', () => {
            it('should correctly get global current stats', function() {
                return nh.getGlobalCurrentStats().then((response) => {
                    response.body.uri.should.eql('/api?method=stats.global.current');
                });
            });
        });

        describe('getGlobal24hStats', () => {
            it('should correctly get global current stats', function() {
                return nh.getGlobal24hStats().then((response) => {
                    response.body.uri.should.eql('/api?method=stats.global.24h');
                });
            });
        });

        describe('getProviderStats', () => {
            it('should get provider stats', function() {
                const testAddress = `1P5PNW6Wd53QiZLdCs9EXNHmuPTX3rD6hW`;
                return nh.getProviderStats(testAddress).then((response) => {
                    response.body.uri.should.eql('/api?method=stats.global.24h&addr=1P5PNW6Wd53QiZLdCs9EXNHmuPTX3rD6hW');
                });
            });
        });

        describe('getDetailedProviderStats', () => {
            it('should get detailed provider stats', function() {
                const testAddress = `1P5PNW6Wd53QiZLdCs9EXNHmuPTX3rD6hW`;
                return nh.getDetailedProviderStats(testAddress).then((response) => {
                    response.body.uri.should.eql('/api?method=stats.provider.ex&addr=1P5PNW6Wd53QiZLdCs9EXNHmuPTX3rD6hW&from=0');
                });
            });
        });

        describe('getProviderWorkersStats', () => {
            it('should get provider workers stats', function() {
                const testAddress = `17a212wdrvEXWuipCV5gcfxdALfMdhMoqh`;
                const testAlgo = 3;
                return nh.getProviderWorkersStats(testAddress, testAlgo).then((response) => {
                    response.body.uri.should.eql('/api?method=stats.provider.workers&addr=17a212wdrvEXWuipCV5gcfxdALfMdhMoqh&algo=3');
                });
            });
        });

        describe('getOrders', () => {
            it('should get all orders', function() {
                const testLocation = 1;
                const testAlgo = 3;
                return nh.getOrders(testLocation, testAlgo).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.get&location=1&algo=3');
                });
            });
        });

        describe('getMultiAlgorithmMiningInfo', () => {
            it('should get multi algo stats', function() {
                return nh.getMultiAlgorithmMiningInfo().then((response) => {
                    response.body.uri.should.eql('/api?method=multialgo.info');
                });
            });
        });

        describe('getSimpleMultiAlgorithmMiningInfo', () => {
            it('should correctly return simple multi algo info', function() {
                return nh.getSimpleMultiAlgorithmMiningInfo().then((response) => {
                    response.body.uri.should.eql('/api?method=simplemultialgo.info');
                });
            });
        });

        describe('getNeededBuyingInfo', () => {
            it('should correct returning buying power info', function() {
                return nh.getNeededBuyingInfo().then((response) => {
                    response.body.uri.should.eql('/api?method=buy.info');
                });
            });
        });
    });

    context('Private API Methods', () => {
        before(() => {
            nh.apiId = 'testApiId';
            nh.apiKey = 'testApiKey';
        });

        describe('getMyOrders', () => {
            it(`should correctly get a user's orders`, function() {
                return nh.getMyOrders(1, 3).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.get&location=1&algo=3&my=&id=testApiId&key=testApiKey');
                });
            });
        });

        describe('getMyBalance', () => {
            it(`should correctly get a user's orders`, function() {
                return nh.getMyBalance().then((response) => {
                    response.body.uri.should.eql('/api?method=balance&id=testApiId&key=testApiKey');
                });
            });
        });

        describe('createOrder', () => {
            it(`should correctly create an order`, function() {
                const testOptions = {
                    location: 1,
                    algo: 3,
                    amount: 10,
                    price: 0.0001,
                    limit: 0.30,
                    pool_host: 'eth.nanopool.org',
                    pool_port: '4444',
                    pool_user: '12838237918273981273981237129387/nhwork1/alexgandy@gmail.com',
                    pool_pass: 'x'
                };

                return nh.createOrder(testOptions).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.create&location=1&algo=3&amount=10&price=0.0001&limit=0.3&pool_host=eth.nanopool.org&pool_port=4444&pool_user=12838237918273981273981237129387%2Fnhwork1%2Falexgandy%40gmail.com&pool_pass=x&id=testApiId&key=testApiKey');
                });
            });
        });

        describe('refillOrder', () => {
            it(`should correctly create an order`, function() {
                const testOptions = {
                    location: 1,
                    algo: 3,
                    order: 1234,
                    amount: 10
                };

                return nh.refillOrder(testOptions).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.refill&location=1&algo=3&order=1234&amount=10&id=testApiId&key=testApiKey');
                });
            });
        });

        describe('removeOrder', () => {
            it(`should correctly create an order`, function() {
                const testOptions = {
                    location: 1,
                    algo: 3,
                    order: 1234
                };

                return nh.removeOrder(testOptions).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.remove&location=1&algo=3&order=1234&id=testApiId&key=testApiKey');
                });
            });
        });

        describe('setOrderPrice', () => {
            it(`should correctly create an order`, function() {
                const testOptions = {
                    location: 1,
                    algo: 3,
                    order: 1234,
                    price: 100
                };

                return nh.setOrderPrice(testOptions).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.set.price&location=1&algo=3&order=1234&price=100&id=testApiId&key=testApiKey');
                });
            });
        });

        describe('decreaseOrderPrice', () => {
            it(`should correctly create an order`, function() {
                const testOptions = {
                    location: 1,
                    algo: 3,
                    order: 1234
                };

                return nh.decreaseOrderPrice(testOptions).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.set.price.decrease&location=1&algo=3&order=1234&id=testApiId&key=testApiKey');
                });
            });
        });

        describe('setOrderLimit', () => {
            it(`should correctly create an order`, function() {
                const testOptions = {
                    location: 1,
                    algo: 3,
                    order: 1234,
                    limit: 0.20
                };

                return nh.setOrderLimit(testOptions).then((response) => {
                    response.body.uri.should.eql('/api?method=orders.set.limit&location=1&algo=3&order=1234&limit=0.2&id=testApiId&key=testApiKey');
                });
            });
        });
    });
});