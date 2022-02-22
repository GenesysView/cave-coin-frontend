import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BinanceAPI } from 'src/app/utils/binance/api';
import { EthereumAPI } from 'src/app/utils/ethereum/api';
import { PolygonAPI } from 'src/app/utils/polygon/api';
import { widget, IChartingLibraryWidget, ChartingLibraryWidgetOptions, LanguageCode, ResolutionString } from '../../../assets/charting_library';

@Component({
    selector: 'tradingview-charting',
    templateUrl: './tv-chart-container.component.html',
    styleUrls: ['./tv-chart-container.component.scss']
})
export class TvChartContainerComponent implements OnInit, OnDestroy {


    private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'BabyDogeBNB';
    private _interval: ChartingLibraryWidgetOptions['interval'] = 'D' as ResolutionString;
    // BEWARE: no trailing slash is expected in feed URL
    private _datafeedUrl = 'https://api.binance.com';
    private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
    private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
    private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
    private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
    private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
    private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
    private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
    private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container_0';
    private _tvWidget: IChartingLibraryWidget | null = null;
    private _network: any;
    private _coin: any;
    private _quoteAsset: any;
    @Input() public content: any = 0;

    @Input()
    set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
        console.log('++++++++++++++++++++++++++symbol', symbol);

        this._symbol = symbol || this._symbol;
    }

    @Input()
    set interval(interval: ChartingLibraryWidgetOptions['interval']) {
        this._interval = interval;
    }

    @Input()
    set datafeedUrl(datafeedUrl: string) {
        this._datafeedUrl = datafeedUrl || this._datafeedUrl;
    }

    @Input()
    set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
        this._libraryPath = libraryPath || this._libraryPath;
    }

    @Input()
    set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
        this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
    }

    @Input()
    set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
        this._chartsStorageApiVersion = chartsStorageApiVersion || this._chartsStorageApiVersion;
    }

    @Input()
    set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
        this._clientId = clientId || this._clientId;
    }

    @Input()
    set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
        this._userId = userId || this._userId;
    }

    @Input()
    set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
        this._fullscreen = fullscreen || this._fullscreen;
    }

    @Input()
    set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
        this._autosize = autosize || this._autosize;
    }

    @Input()
    set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
        this._containerId = containerId || this._containerId;
    }
    @Input()
    set network(_network: any) {
        this._network = _network;
    }
    @Input()
    set coin(_coin: any) {
        console.log('++_coin', _coin);

        this._coin = _coin;
    }

    @Input()
    set quoteAsset(_quoteAsset: any) {
        console.log('++_quoteAsset', _quoteAsset);

        this._quoteAsset = _quoteAsset;
    }






    ngOnInit() {

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.start();
        }, 2000);
    }

    ngOnDestroy() {
        if (this._tvWidget !== null) {
            this._tvWidget.remove();
            this._tvWidget = null;
        }
    }

    start() {
        console.log('ngAfterViewInit trading view');

        function getLanguageFromURL(): LanguageCode | null {
            const regex = new RegExp('[\\?&]lang=([^&#]*)');
            const results = regex.exec(location.search);

            return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
        }

        let datafeed: any = new BinanceAPI({ debug: false, symbol: this._symbol, coin: this._coin, quoteAsset: this._quoteAsset, network: this._network });
        if (this._network == 'binance-smart-chain') {
            datafeed = new BinanceAPI({ debug: false, symbol: this._symbol, coin: this._coin, quoteAsset: this._quoteAsset, network: this._network });
        } else if (this._network == 'ethereum') {
            datafeed = new BinanceAPI({ debug: false, symbol: this._symbol, coin: this._coin, quoteAsset: this._quoteAsset, network: this._network });
        } else if (this._network == 'polygon-pos') {
            datafeed = new BinanceAPI({ debug: false, symbol: this._symbol, coin: this._coin, quoteAsset: this._quoteAsset, network: this._network });
            // datafeed = new PolygonAPI({
            //     apikey: 'qwnIbJtVMwfGXFzU8fZ1IVPM3PXQGvfb',
            //     realtimeEnabled: true 	// True(default) = Use websockets for updates. False = use polling for new data.
            // })
        }
        // let datafeed = new BinanceAPI({ debug: false });
        // this._symbol = 'ADABNB';

        // let datafeed = new PolygonAPI({
        //     apikey: 'qwnIbJtVMwfGXFzU8fZ1IVPM3PXQGvfb',
        //     realtimeEnabled: true 	// True(default) = Use websockets for updates. False = use polling for new data.
        // })
        // this._symbol = 'MATPADETH';
        let panelGrafica = this._containerId;
        if (this.content != null) {
            panelGrafica = 'tv_chart_container_' + this.content;
        }
        console.log('panelGrafica', panelGrafica);
        console.log('---coin', this._coin);
        console.log('---_quoteAsset', this._quoteAsset);
        console.log('---_symbol', this._symbol);

        const widgetOptions: any = {
            symbol: this._symbol + this._quoteAsset,
            datafeed: datafeed,
            interval: '1D',
            container_id: panelGrafica,
            library_path: this._libraryPath,
            locale: getLanguageFromURL() || 'en',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: this._chartsStorageUrl,
            charts_storage_api_version: this._chartsStorageApiVersion,
            client_id: this._clientId,
            user_id: this._userId,
            fullscreen: this._fullscreen,
            autosize: this._autosize,
            container: panelGrafica
        };

        const tvWidget = new widget(widgetOptions);
        this._tvWidget = tvWidget;

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute('title', 'Click to show a notification popup');
                button.classList.add('apply-common-tooltip');
                button.addEventListener('click', () => tvWidget.showNoticeDialog({
                    title: 'Notification',
                    body: 'TradingView Charting Library API works correctly',
                    callback: () => {
                        console.log('Noticed!');
                    },
                }));
                button.innerHTML = 'Check API';
            });
        });
    }
}
