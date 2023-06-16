import {defineStore} from 'pinia';
import {useLocalStorage} from "@vueuse/core";

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        indexSymbols: ['SPY', 'QQQ', 'IWM'],
        indexIntraDayData: useLocalStorage('indexIntraDayData', {}),
        topGainers: useLocalStorage('topGainers', []),
        topLosers: useLocalStorage('topLosers', []),
        sectorEtfPrices: useLocalStorage('sectorEtfPrices', {}),
        darkMode: useLocalStorage('darkMode', true),
    }),
    actions: {

        saveIntraDayData(data) {
            if (!data || !data.success) {
                return;
            }
            const symbol = data.data['Meta Data']['2. Symbol'];
            const timeSeries = data.data['Time Series (5min)'];
            this.indexIntraDayData[symbol] = Object.keys(timeSeries).map(key => ({
                symbol,
                time: key,
                ...timeSeries[key],
            }));
        },

        saveIntraDayDataArray(dataArray) {
            dataArray.forEach(data => this.saveIntraDayData(data.value));
        },

        saveApiDataToState(data, stateName) {
            if (!data || !data.success) {
                return;
            }
            this[stateName] = data.data;
        }


    },
    getters: {
        sectorEtfPriceChanges() {
            const sectorEtfPriceChanges = {};
            Object.keys(this.sectorEtfPrices).forEach(sector => {
                const sectorEtfPrice = this.sectorEtfPrices[sector];
                // sectorEtfPriceChanges will be the percentage change of value compared to the previous value
                // the sectorEtfPrice object is sorted by time, so the first value is the latest value
                // Each element of array is an array of [time, value]
                sectorEtfPriceChanges[sector] = sectorEtfPrice.map((value, index, array) => {
                        if (index === 0) {
                            return [value[0], 0];
                        }
                        const previousValue = array[index - 1][1];
                        return [value[0], (value[1] - previousValue) / previousValue];
                    }
                );
            });
            return sectorEtfPriceChanges;
        }
    }
});