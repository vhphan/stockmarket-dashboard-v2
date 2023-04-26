<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet} from "@/api/apiCalls.js";
import {computed} from "vue";
import SimpleChart from "@/components/SimpleChart.vue";

const mainStore = useMainStore();
const {indexSymbols, indexIntraDayData} = storeToRefs(mainStore);

const apiArray = indexSymbols.value.map((symbol) => {
    return apiGet('getIntraDayPrices', {symbol});
});

const isFetchingArray = apiArray.map((api) => api.isFetching);
const errorArray = apiArray.map((api) => api.error);
const dataArray = apiArray.map((api) => api.data);

const isLoading = computed(() => {
    return isFetchingArray.some((isFetching) => isFetching.value);
});

const execute = async () => {
    const executePromisesArray = apiArray.map((api) => api.execute());
    await Promise.all(executePromisesArray);
    errorArray.forEach((error) => {
        if (error.value) {
            triggerNegative({message: error.value});
        }
    });
    if (dataArray.length > 0) {
        mainStore.saveIntraDayDataArray(dataArray);
    }
};

const spyData = computed(() => {
    return indexIntraDayData.value['SPY'].map(
        (data) => {
            return {
                time: new Date(data.time).getTime() / 1000,
                value: parseFloat(data['4. close']),
            };
        }
    ).sort((a, b) => a.time - b.time);
});

const spyTitle = 'SPY';


</script>

<template>

    <q-btn
            :loading="isLoading"
            :disabled="isLoading"
            @click="execute"
            color="primary"
    >
        Execute
    </q-btn>

    <simple-chart :data="spyData" :title="spyTitle"></simple-chart>

</template>


<style scoped>

</style>