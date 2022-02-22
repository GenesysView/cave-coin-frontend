import { ErrorCallback, HistoryCallback, LibrarySymbolInfo, PeriodParams, ResolutionString, SubscribeBarsCallback } from "src/assets/charting_library/datafeed-api";
import { SocketClient } from "./socketClient";
import * as _ from 'lodash';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map } from "rxjs/operators";

export class PolygonAPI {

    BASE_URL = `https://api.polygon.io`
    POLL_INTERVAL = 15 // seconds

    SUPPORTED_RESOLUTIONS = ['1', '3', '5', '15', '30', '45', '60', '120', '180', '240', '1D', '1W', '1M', '12M']

    subscriptions: any;
    apikey: any;
    realtimeEnabled: any;
    ws: any;

    constructor(params: any, private http?: HttpClient) {
        this.subscriptions = []
        this.apikey = params.apikey
        this.realtimeEnabled = params.realtimeEnabled || true
        this.searchSymbols = _.debounce(this.searchSymbols, 250, { trailing: true });

        return this;
    }


    // chart specific functions below, impt that their function names stay same
    onReady(callback: any) {
        console.log('Polygon Adapter Ready')
        if (this.realtimeEnabled) {
            this.wsListeners()
        } else {
            setInterval(this.onInterval.bind(this), this.POLL_INTERVAL * 1000)
        }
        callback()
    }

    onInterval() {
        let now: number = Date.now();
        _.each(this.subscriptions, (sub: any) => {
            let periodParams: PeriodParams = {
                from: ((now - 120 * 1000) / 1000),
                to: (now / 1000),
                countBack: 0,
                firstDataRequest: true
            };

            this.getBars(sub.symbolInfo, sub.interval, periodParams, (ticks) => {
                if (ticks.length == 0) return
                sub.callback(ticks)
            }, (error) => {
            })
        })
    }

    searchSymbols(userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) {
        // axios({
        //     url: `${BASE_URL}/v2/reference/tickers?search=${userInput}&apikey=${this.apikey}`,
        // }).then((res: any) => {
        //     console.log('search results:', res)
        //     onResultReadyCallback(_.map(res.data.tickers, (item) => {
        //         return {
        //             symbol: item.ticker,
        //             ticker: item.ticker,
        //             full_name: item.name,
        //             description: `${item.name}`,
        //             exchange: item.primaryExch,
        //             type: item.market,
        //             locale: item.locale,
        //         }
        //     }))
        // }).catch((err: any) => {
        //     console.log('not found:', err)
        //     onResultReadyCallback([])
        // })

        this.http!.get(`${this.BASE_URL}/v2/reference/tickers?search=${userInput}&apikey=${this.apikey}`).pipe(
            map(
                (res: any) => {
                    console.log('search results:', res)
                    onResultReadyCallback(_.map(res.data.tickers, (item) => {
                        return {
                            symbol: item.ticker,
                            ticker: item.ticker,
                            full_name: item.name,
                            description: `${item.name}`,
                            exchange: item.primaryExch,
                            type: item.market,
                            locale: item.locale,
                        }
                    }))
                },
                (error: HttpErrorResponse) => {
                    console.log('not found:', error)
                    onResultReadyCallback([])
                }
            )
        );
    }

    resolveSymbol(symbolName: any, onSymbolResolvedCallback: any, onResolveErrorCallback: any) {
        console.log('resolve symbol:', symbolName)
        let TickerTypeMap = {
            'STOCKS': 'stock',
            'FX': 'forex',
            'CRYPTO': 'bitcoin',
        }
        // axios.get(`${this.BASE_URL}/v2/reference/tickers/${symbolName}?apiKey=${this.apikey}`).then((data: any) => {
        //     console.log('DATAAA', data)
        //     let c = Get(data, 'data.results', {})
        //     let intFirst = Get(c, 'aggs.intraday.first', false)
        //     let dayFirst = Get(c, 'aggs.daily.first', false)
        //     onSymbolResolvedCallback({
        //         name: c.ticker.ticker,
        //         ticker: c.ticker.ticker,
        //         type: TickerTypeMap[c.ticker.type] || 'stocks',
        //         exchange: c.ticker.exchange,
        //         timezone: 'America/New_York',
        //         first_intraday: intFirst,
        //         has_intraday: (intFirst != false),
        //         first_daily: dayFirst,
        //         has_daily: (dayFirst != false),
        //         supported_resolutions: this.SUPPORTED_RESOLUTIONS,
        //     })
        // })

        this.http!.get(`${this.BASE_URL}/v2/reference/tickers/${symbolName}?apiKey=${this.apikey}`).pipe(
            map(
                (data: any) => {
                    console.log('search results:', data)
                    console.log('DATAAA', data)
                    let c = _.get(data, 'data.results', {})
                    let intFirst = _.get(c, 'aggs.intraday.first', false)
                    let dayFirst = _.get(c, 'aggs.daily.first', false)
                    onSymbolResolvedCallback({
                        name: c.ticker.ticker,
                        ticker: c.ticker.ticker,
                        type: 'stocks',
                        exchange: c.ticker.exchange,
                        timezone: 'America/New_York',
                        first_intraday: intFirst,
                        has_intraday: (intFirst != false),
                        first_daily: dayFirst,
                        has_daily: (dayFirst != false),
                        supported_resolutions: this.SUPPORTED_RESOLUTIONS,
                    })
                }
            )
        );
    }

    getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParams, onResult: HistoryCallback, onError: ErrorCallback) {
        let multiplier = 1
        let timespan = 'minute'
        if (resolution == 'D' || resolution == '1D') timespan = 'day'
        if (_.includes(['1', '3', '5', '15', '30', '45'], resolution)) {
            multiplier = parseInt(resolution)
            timespan = 'minute'
        }
        if (_.includes(['60', '120', '180', '240'], resolution)) {
            timespan = 'hour'
            multiplier = parseInt(resolution) / 60
        }
        // axios({
        //     url: `${this.BASE_URL}/v2/aggs/ticker/${symbolInfo.ticker}/range/${multiplier}/${timespan}/${periodParams.from * 1000}/${periodParams.to * 1000}`,
        //     params: { apikey: this.apikey }
        // }).then((data: any) => {
        //     let bars = []
        //     bars = _.map(data.data.results, (t) => {
        //         return {
        //             time: t.t,
        //             close: t.c,
        //             open: t.o,
        //             high: t.h,
        //             low: t.l,
        //             volume: t.v,
        //         }
        //     })
        //     return onResult(bars, { noData: false /* ( bars.length == 0 && timespan != 'minute' ) */ })
        // }).catch(onError)


        this.http!.get(`${this.BASE_URL}/v2/aggs/ticker/${symbolInfo.ticker}/range/${multiplier}/${timespan}/${periodParams.from * 1000}/${periodParams.to * 1000}`).pipe(
            map(
                (data: any) => {
                    let bars = []
                    bars = _.map(data.data.results, (t) => {
                        return {
                            time: t.t,
                            close: t.c,
                            open: t.o,
                            high: t.h,
                            low: t.l,
                            volume: t.v,
                        }
                    })
                    return onResult(bars, { noData: false /* ( bars.length == 0 && timespan != 'minute' ) */ })
                },
                (error: HttpErrorResponse) => {
                    onError
                }
            )
        );

    }

    // subscribeBars(symbolInfo: any, resolution: any, onRealtimeCallback: any, subscriberUID: any, onResetCacheNeededCallback: any) {
    //     this.ws.subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)
    // }

    subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, key: string, onResetCacheNeededCallback: () => void) {
        let sub = {
            key: `${key}`,
            symbolInfo: symbolInfo,
            interval: resolution,
            callback: onTick,
        }
        // Currently only allow minute subscriptions:
        if (sub.interval != '1') return
        if (this.realtimeEnabled) this.ws.subscribe(`AM.${symbolInfo.ticker}`)
        this.subscriptions.push(sub)

    }

    // unsubscribeBars(subscriberUID: any) {
    //     this.ws.unsubscribeFromStream(subscriberUID)
    // }
    unsubscribeBars(key: any) {
        this.subscriptions = _.filter(this.subscriptions, (s: any) => s.key != key)
    }

    wsListeners() {
        if (!this.realtimeEnabled) return
        this.ws = new SocketClient({ apiKey: this.apikey })
        this.ws.on('AM', (aggMin: any) => {
            _.each(this.subscriptions, (sub: any) => {
                sub.callback({
                    open: aggMin.o,
                    close: aggMin.c,
                    high: aggMin.h,
                    low: aggMin.l,
                    volume: aggMin.v,
                    time: aggMin.s,
                })
            })
        })
    }
}