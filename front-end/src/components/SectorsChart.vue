<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted} from "vue";
import {useApiArray} from "@/composables/api.js";
import {etfList} from "@/config/constants.js";
import EChartLine from "@/components/EChartLine.vue";

const mainStore = useMainStore();
const symbols = Object.keys(etfList);

const params = {
    symbols,
    numberOfDays: 120,
    timeFrame: '1Day',
};

const apiArray = [
    apiGet(apiRoutes.getBarsMultipleSymbols, params),
];

const {
    isFetchingArray,
    errorArray,
    dataArray,
    isLoading,
    execute,
} = useApiArray(apiArray, () => {
    const {data} = dataArray[0].value;
    symbols.forEach((symbol) => {
        mainStore.sectorEtfPrices[symbol] = data.filter(d => d['Symbol'] === symbol).sort((a, b) => a['Timestamp'] - b['Timestamp']).map((d) => [
            d['Timestamp'],
            d['ClosePrice']
        ]);
    });
});

// {
//     data: [[d,v], [d2,v2]]
//     type: 'line',
//     name: seriesName,
// },

const chartDataArray = computed(() => {
    return symbols.map((symbol) => {
        return {
            data: mainStore.sectorEtfPrices[symbol],
            type: 'line',
            name: `${symbol}(${etfList[symbol]})`,
        };
    });
});

const sectorEtfPriceChangesArray = computed(() => {
    return symbols.map((symbol) => {
        const percentChangeArray = mainStore.sectorEtfPriceChanges[symbol];
        return {
            name: `${symbol}(${etfList[symbol]})`,
            type: 'line',
            data: percentChangeArray,
            smooth: true,
        };
    });
});


onMounted(() => {
    execute();
});


</script>


<template>
    <e-chart-line
            chart-title=""
            :data="sectorEtfPriceChangesArray"
            :height-in-pixels="501"

    />
</template>


<style scoped>

</style>