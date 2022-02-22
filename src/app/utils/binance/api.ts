import { ErrorCallback, HistoryCallback, LibrarySymbolInfo, PeriodParams, ResolutionString } from "src/assets/charting_library/datafeed-api";
import { SocketClient } from "./socketClient";

export class BinanceAPI {

    binanceHost: any;
    debug: any;
    ws: any;
    totalKlines: any;
    symbols: any;
    currentSymbol: any;
    quoteAsset: any;
    coin: any;
    address: any;
    network: any;
    lastBarsCache = new Map();
    data: any = [];


    // constructor(base_url, path) {
    constructor(options: any) {
        this.binanceHost = 'https://api.binance.com'
        this.debug = options.debug || false
        this.ws = new SocketClient();
        this.currentSymbol = options.symbol;
        this.quoteAsset = options.quoteAsset;
        this.coin = options.coin;
        this.network = options.network;

        console.log('this.currentSymbol', this.currentSymbol);
        console.log('this.quoteAsset', this.currentSymbol);
        console.log('this.network', options.network);
        for (let index = 0; index < this.coin.address.length; index++) {
            const item = this.coin.address[index];
            if (this.coin.address[index].name == options.network) {
                this.coin.address = [
                    item
                ]
            }
        }
        console.log('this.coin', this.coin);
        this.address = this.coin.address[0].address;
        console.log('this.address', this.address);


    }

    binanceSymbols() {
        return fetch(this.binanceHost + '/api/v1/exchangeInfo').then(res => {
            return res.json()
        }).then(json => {
            console.log('binanceSymbols', json.symbols);
            return json.symbols
        })
    }

    binanceKlines(symbol: any, interval: any, startTime: any, endTime: any, limit: any) {
        let url = `${this.binanceHost}/api/v1/klines?symbol=${symbol}&interval=${interval}${startTime ? `&startTime=${startTime}` : ''}${endTime ? `&endTime=${endTime}` : ''}${limit ? `&limit=${limit}` : ''}`
        url = 'https://cavecoin.app:3011/tokens/getOHLCVHistoricalFake';
        url = `https://api.coingecko.com/api/v3/coins/${this.coin.identifier}/ohlc?vs_currency=usd&days=5`;
        console.log('--------------binanceKlines');

        return fetch(url).then(res => {
            return res.json()
        }).then(json => {
            console.log('datafeed', json);
            // return json.data;

            let sub_url = `https://api.coingecko.com/api/v3/coins/${this.coin.identifier}/ohlc?vs_currency=usd&days=1`;
            fetch(sub_url).then(sub_res => {
                sub_res.json()
            }).then(sub_json => {
                console.log('resultado', sub_json);
                // return json.data;
                sub_json;
            });

            return json;
        })
    }

    // chart specific functions below, impt that their function names stay same
    async onReady(callback: any) {
        console.log('-----this.datathis.datathis.data', this.data.length);
        let sub_url = `https://cavecoin.app:3011/tokens/getOHLCVHistorical`;
        let misdatos: any = await fetch(sub_url, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.address,
                network: this.network
            })
        })

        misdatos = await misdatos.json();

        console.log('misdatos', misdatos);

        this.data = misdatos.response;


        this.binanceSymbols().then((symbols) => {
            // this.symbols = symbols;
            symbols = [];
            console.log('symbolo actual', this.currentSymbol);

            symbols.push(
                {
                    "symbol": this.currentSymbol + this.quoteAsset,
                    "status": "TRADING",
                    "baseAsset": this.currentSymbol,
                    "baseAssetPrecision": 8,
                    "quoteAsset": this.quoteAsset,
                    "quotePrecision": 8,
                    "quoteAssetPrecision": 8,
                    "baseCommissionPrecision": 8,
                    "quoteCommissionPrecision": 8,
                    "orderTypes": [
                        "LIMIT",
                        "LIMIT_MAKER",
                        "MARKET",
                        "STOP_LOSS_LIMIT",
                        "TAKE_PROFIT_LIMIT"
                    ],
                    "icebergAllowed": true,
                    "ocoAllowed": true,
                    "quoteOrderQtyMarketAllowed": true,
                    "isSpotTradingAllowed": true,
                    "isMarginTradingAllowed": true,
                    "filters": [
                        {
                            "filterType": "PRICE_FILTER",
                            "minPrice": "0.00000100",
                            "maxPrice": "922327.00000000",
                            "tickSize": "0.00000100"
                        },
                        {
                            "filterType": "PERCENT_PRICE",
                            "multiplierUp": "5",
                            "multiplierDown": "0.2",
                            "avgPriceMins": 5
                        },
                        {
                            "filterType": "LOT_SIZE",
                            "minQty": "0.00010000",
                            "maxQty": "100000.00000000",
                            "stepSize": "0.00010000"
                        },
                        {
                            "filterType": "MIN_NOTIONAL",
                            "minNotional": "0.00010000",
                            "applyToMarket": true,
                            "avgPriceMins": 5
                        },
                        {
                            "filterType": "ICEBERG_PARTS",
                            "limit": 10
                        },
                        {
                            "filterType": "MARKET_LOT_SIZE",
                            "minQty": "0.00000000",
                            "maxQty": "978.71657746",
                            "stepSize": "0.00000000"
                        },
                        {
                            "filterType": "MAX_NUM_ORDERS",
                            "maxNumOrders": 200
                        },
                        {
                            "filterType": "MAX_NUM_ALGO_ORDERS",
                            "maxNumAlgoOrders": 5
                        }
                    ],
                    "permissions": [
                        "SPOT",
                        "MARGIN"
                    ]
                }
            );
            this.symbols = symbols;

            console.log('---lista de simbolos', symbols);

            callback({
                supports_marks: false,
                supports_timescale_marks: false,
                supports_time: true,
                supported_resolutions: [
                    '1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', '1D', '3D', '1W', '1M'
                ]
            })
        }).catch(err => {
            console.error('onReady', err)
        })
    }

    searchSymbols(userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) {
        userInput = userInput.toUpperCase();
        console.log('searchSymbols userInput', userInput);

        onResultReadyCallback(
            this.symbols.filter((symbol: any) => {
                return symbol.symbol.indexOf(userInput) >= 0
            }).map((symbol: any) => {
                console.log('searchSymbols symbol', symbol);

                return {
                    symbol: symbol.symbol,
                    full_name: symbol.symbol,
                    description: symbol.baseAsset + ' / ' + symbol.quoteAsset,
                    ticker: symbol.symbol,
                    exchange: 'Binance',
                    type: 'crypto'
                }
            })
        )
    }

    resolveSymbol(symbolName: any, onSymbolResolvedCallback: any, onResolveErrorCallback: any) {
        this.debug && console.log('👉 resolveSymbol:', symbolName)

        const comps = symbolName.split(':')
        symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase()

        function pricescale(symbol: any) {
            for (let filter of symbol.filters) {
                if (filter.filterType == 'PRICE_FILTER') {
                    return Math.round(1 / parseFloat(filter.tickSize))
                }
            }
            return 1
        }

        for (let symbol of this.symbols) {
            if (symbol.symbol == symbolName) {
                setTimeout(() => {
                    onSymbolResolvedCallback({
                        name: symbol.symbol,
                        description: symbol.baseAsset + ' / ' + symbol.quoteAsset,
                        ticker: symbol.symbol,
                        exchange: 'Binance',
                        listed_exchange: 'Binance',
                        type: 'crypto',
                        session: '24x7',
                        minmov: 1,
                        pricescale: pricescale(symbol),
                        // timezone: 'UTC',
                        has_intraday: true,
                        has_daily: true,
                        has_weekly_and_monthly: true,
                        currency_code: symbol.quoteAsset
                    })
                }, 0)
                return
            }
        }
        // minmov/pricescale will give the value of decimal places that will be shown on y-axis of the chart
        //
        onResolveErrorCallback('not found')
    }



    async getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParams, onResult: HistoryCallback, onError: ErrorCallback) {
        const { from, to, firstDataRequest } = periodParams;
        let bars: any = [];

        for (let index = 0; index < this.data.length; index++) {
            let tuple = this.data[index];
            bars = [...bars, {
                time: tuple[0],
                low: tuple[3],
                high: tuple[2],
                open: tuple[1],
                close: tuple[4],
                volume: tuple[5]
            }]
            await this.sleep(31);
        }
        this.data = [];
        onResult(bars, { noData: false });
    }

    parseFullSymbol(fullSymbol: any): any {
        // console.log('fullSymbol', fullSymbol);

        const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
        if (!match) {
            // return null;
        }

        return { exchange: 'Binance', fromSymbol: 'ADA', toSymbol: 'BNB' };
    }

    subscribeBars(symbolInfo: any, resolution: any, onRealtimeCallback: any, subscriberUID: any, onResetCacheNeededCallback: any) {
        this.ws.subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)
    }

    unsubscribeBars(subscriberUID: any) {
        this.ws.unsubscribeFromStream(subscriberUID)
    }

    sleep(ms: any) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}