# nicehash
Node NiceHash API Wrapper

A simple API wrapper for the cloud mining site NiceHash.

## Installation

If you want to place or modify orders you need a NiceHash account. Under Account > General, you'll find your API ID and Key. You cannot use your read-only API Key.

```
npm install nicehash --save
```

## Initialization

First, import the module:

```
const NiceHashClient = require('nicehash');
```

Next, initialize a new NiceHash client object with your API ID and Key:

```
const nh = new NiceHashClient({apiId: '123456', apiKey: '66666666-6666-6666-6666-666666666666'});
```

*Note:* If you aren't purchasing or modifying orders, you do not need to include API Id or Key.

## Methods

All of the methods correspond to [NiceHash's API documentation](https://www.nicehash.com/index.jsp?p=api).

### Public API Methods

#### `nh.getGlobalCurrentStats(location)`

| param      | type    | description                                             |
| ---------- | ------- | ------------------------------------------------------- |
| location   | Number  | (Optional)  Location, 0 for Europe, 1 for USA. Optional |

#### `getGlobal24hStats()`

Get average profitability (price) and hashing speed for all algorithms in past 24 hours.

#### `nh.getProviderStats(addr)`

Get current stats for provider for all algorithms. Refreshed every 30 seconds. It also returns past 56 payments.

| param  | type    | description                                  |
| ------ | ------- | -------------------------------------------- |
| addr   | String  | Providers BTC address                        |


#### `nh.getDetailedProviderStats(addr, from)`

Get details stats for provider for all algorithms including history data and past 56 payments

| param  | type    | description                                  |
| ------ | ------- | -------------------------------------------- |
| addr   | String  | Providers BTC address                        |
| from   | String  | Get history from this time (Unix timestamp)  |

#### `nh.getProviderWorkersStats(addr, algo)`

Get detailed stats for provider's workers (rigs).

| param  | type    | description                                  |
| ------ | ------- | -------------------------------------------- |
| addr   | String  | Providers BTC address                        |
| algo   | Number  | Algorithm marked with ID                     |

#### `nh.getOrders(location, algo)`

Get all orders for certain algorithm. Refreshed every 30 seconds.

| param    | type    | description                                  |
| -------- | ------- | -------------------------------------------- |
| location | Number  | Location, 0 for Europe, 1 for USA.           |
| algo     | Number  | Algorithm marked with ID                     |

#### `nh.getMultiAlgorithmMiningInfo()`

Get information about Multi-Algorithm Mining.

#### `nh.getSimpleMultiAlgorithmMiningInfo()`

Get information about Simple Multi-Algorithm Mining. [More Here](https://www.nicehash.com/?p=simplemultialgo)

#### `nh.getNeededBuyingInfo()`

Get needed information for buying hashing power using NiceHashBot (https://github.com/nicehash/NiceHashBot)

