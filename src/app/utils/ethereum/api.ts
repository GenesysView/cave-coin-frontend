import { ErrorCallback, HistoryCallback, LibrarySymbolInfo, PeriodParams, ResolutionString } from "src/assets/charting_library/datafeed-api";
import { SocketClient } from "./socketClient";

export class EthereumAPI {

    binanceHost: any;
    debug: any;
    ws: any;
    totalKlines: any;
    symbols: any;
    // constructor(base_url, path) {
    constructor(options: any) {
        this.binanceHost = 'https://api.binance.com'
        this.debug = options.debug || false
        this.ws = new SocketClient()
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
        const url = `${this.binanceHost}/api/v1/klines?symbol=${symbol}&interval=${interval}${startTime ? `&startTime=${startTime}` : ''}${endTime ? `&endTime=${endTime}` : ''}${limit ? `&limit=${limit}` : ''}`

        return fetch(url).then(res => {
            return res.json()
        }).then(json => {
            return json
        })
    }

    // chart specific functions below, impt that their function names stay same
    onReady(callback: any) {
        this.binanceSymbols().then((symbols) => {
            this.symbols = symbols
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
                    exchange: 'Ethereum',
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
                        exchange: 'Ethereum',
                        listed_exchange: 'Ethereum',
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

    getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParams, onResult: HistoryCallback, onError: ErrorCallback) {
        console.log('----symbolInfo', symbolInfo);
        console.log('----resolution', resolution);
        console.log('----from', periodParams.from);
        console.log('----to', periodParams.to);
        console.log('----onHistoryCallback', onResult);
        console.log('----onErrorCallback', onError);
        console.log('----firstDataRequest', periodParams.firstDataRequest);

        const interval = this.ws.tvIntervals[resolution]
        if (!interval) {
            onError('Invalid interval')
        }

        let totalKlines: any = []
        const kLinesLimit = 500
        const finishKlines = () => {
            console.log('finishKlines');

            if (totalKlines.length === 0) {
                console.log('finishKlines true');
                onResult([], { noData: true })
            } else {
                console.log('finishKlines else', totalKlines);
                let historyCBArray: any = totalKlines.map((kline: any) => ({
                    time: kline[0],
                    open: parseFloat(kline[1]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    close: parseFloat(kline[4]),
                    volume: parseFloat(kline[5])
                }));
                console.log('finishKlines historyCBArray', historyCBArray);
                onResult(historyCBArray, { noData: false });
            }
        }

        const getKlines = async (from: any, to: any) => {
            try {
                const data = await this.binanceKlines(symbolInfo.name, interval, from, to, kLinesLimit);
                console.log('getKlines data', data);
                console.log('getKlines pre totalKlines', totalKlines);
                totalKlines = totalKlines.concat(data);
                console.log('getKlines post totalKlines', totalKlines);
                if (data.length === kLinesLimit) {
                    from = data[data.length - 1][0] + 1
                    getKlines(from, to)
                } else {
                    finishKlines()
                }
            }
            catch (e) {
                console.error('getKlines error', e);
                onError(`Error in 'getKlines' func`)
            }
        }

        periodParams.from *= 1000
        periodParams.to *= 1000
        getKlines(periodParams.from, periodParams.to)
    }

    subscribeBars(symbolInfo: any, resolution: any, onRealtimeCallback: any, subscriberUID: any, onResetCacheNeededCallback: any) {
        this.ws.subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)
    }

    unsubscribeBars(subscriberUID: any) {
        this.ws.unsubscribeFromStream(subscriberUID)
    }
}