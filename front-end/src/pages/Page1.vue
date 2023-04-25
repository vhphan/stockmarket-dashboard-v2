<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet} from "@/api/apiCalls.js";
import {computed} from "vue";

const mainStore = useMainStore();
const {indexSymbols} = storeToRefs(mainStore);

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
};

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
</template>


<style scoped>

</style>