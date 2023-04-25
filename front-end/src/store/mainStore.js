import {defineStore} from 'pinia';

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        indexSymbols: ['SPY', 'QQQ', 'IWM'],
        indexIntraDayData: [],
    }),
    actions: {
        saveIntraDayData(data) {
            if (!data.success) {
                return;
            }
            const symbol = data.data['Meta Data']['2. Symbol'];
            const timeSeries = data.data['Time Series (5min)'];
            const timeSeriesDataRecords = Object.keys(timeSeries).map(key => ({
                symbol,
                time: key,
                ...timeSeries[key],
            }));
            this.indexIntraDayData = [...this.indexIntraDayData.filter(d=> d.symbol !== symbol), ...timeSeriesDataRecords];
        }

    },
    getters: {

    }
});