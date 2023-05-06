<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted} from "vue";
import {useApiArray} from "@/composables/api.js";

const mainStore = useMainStore();

const apiArray = [
    apiGet(apiRoutes.getTopGainers),
    apiGet(apiRoutes.getTopLosers),
];

const {topGainers, topLosers} = storeToRefs(mainStore);
const columnsToExclude = ['52 Week Range'];
const columns = computed(() => {

    try {

        return Object.keys(topGainers.value[0])
            .filter((key) => !columnsToExclude.includes(key))
            .map((key) => {


                return {
                    name: key,
                    label: key,
                    field: key,
                    classes: (row)=> {
                        if (row[key].startsWith('+')) {
                            return 'text-positive text-bold';
                        }
                        if (row[key].startsWith('-')) {
                            return 'text-pink-4 text-bold';
                        }
                    },
                };
            });
    } catch (e) {
        console.log(e);
        return [];
    }

});


const {
    isFetchingArray,
    errorArray,
    dataArray,
    isLoading,
    execute,
} = useApiArray(apiArray, () => {
    mainStore.saveApiDataToState(dataArray[0].value, 'topGainers');
    mainStore.saveApiDataToState(dataArray[1].value, 'topLosers');
    console.log('top movers and losers data saved to state');
});

onMounted(() => execute());

const pagination = {
    rowsPerPage: 10,
    options: [10, 20, 30, 40, 50],
};

</script>


<template>
    <div class="row">
        <div class="col-6 q-pr-xs">
            <q-table
                    title="Top Gainers"
                    dense
                    :rows="topGainers"
                    row-key="Symbol"
                    :columns="columns"
                    bordered
                    dark
                    :pagination="pagination"
            />
        </div>

        <div class="col-6 ">
            <q-table
                    class="col-6"
                    title="Top Losers"
                    dense
                    :rows="topLosers"
                    row-key="Symbol"
                    :columns="columns"
                    bordered
                    dark
                    :pagination="pagination"
                    style="margin-left: 1px;"
            />
        </div>
    </div>

</template>


<style scoped>

</style>