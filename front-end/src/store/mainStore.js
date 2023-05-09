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
    }),
    actions: {
        saveIntraDayData(data) {
            if (!data.success) {
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
        saveTopGainers(data) {
            if (!data.success) {
                return;
            }
            this.topGainers.value = data.data;
        },

        saveApiDataToState(data, stateName) {
            if (!data.success) {
                return;
            }
            this[stateName] = data.data;
        }


    },
    getters: {

    }
});