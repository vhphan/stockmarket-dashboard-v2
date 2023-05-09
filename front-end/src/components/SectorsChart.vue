<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted} from "vue";
import {useApiArray} from "@/composables/api.js";
import {etfList} from "@/config/constants.js";

const mainStore = useMainStore();
const params = {
    symbols: Object.keys(etfList),
    numberOfDays: 30,
    timeFrame: '1Day',
}

const apiArray = [
    apiGet(apiRoutes.getBarsMultipleSymbols, params),
]

const {
    isFetchingArray,
    errorArray,
    dataArray,
    isLoading,
    execute,
} = useApiArray(apiArray);

onMounted(() => {
    execute();
});

</script>


<template>

</template>


<style scoped>

</style>