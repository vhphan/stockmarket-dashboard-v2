<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted, ref} from "vue";
import {useApiArray} from "@/composables/api.js";
import {etfList} from "@/config/constants.js";
import EChartHBar from "@/components/EChartHBar.vue";

const mainStore = useMainStore();
const symbols = Object.keys(etfList);

const apiArray = symbols.map((symbol) => {
    return apiGet(apiRoutes.getStockQuote, {symbol});
});

const quoteData = ref([]);
const yAxisData = ref([]);

const {
    isFetchingArray,
    errorArray,
    dataArray,
    isLoading,
    execute,
} = useApiArray(apiArray, () => {

    quoteData.value = [];
    yAxisData.value = [];
    symbols.forEach((symbol, index) => {
        const data = dataArray[index].value.data;
        const pcChangeTillNow = (100 * (data.c - data.o) / data.o);
        quoteData.value = [
            ...quoteData.value,
            {
                name: `${symbol}(${etfList[symbol]})`,
                value: pcChangeTillNow,
            }
        ];
        yAxisData.value = [
            ...yAxisData.value,
            etfList[symbol],
        ];
    });
});

const executed = ref(false);
onMounted(() => {
    execute().then(() => {
        executed.value = true;
    })
});


// const isChartDataValid = computed(() => {
//     return quoteData.value && quoteData.value.length > 0 && !quoteData.value.some((d) => d.value === null);
// });

</script>

<template>
    <e-chart-h-bar
            v-if="executed"
            :chart-data="quoteData"
            :height-in-pixels="501"
            :y-axis-data="yAxisData"
    />
</template>

<style scoped>

</style>