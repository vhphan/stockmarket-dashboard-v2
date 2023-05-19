<script setup>
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {useApiArray} from "@/composables/api.js";
import {computed, onMounted, ref} from "vue";

const symbols = [
    'SPY',
    'QQQ',
    'IWM',
    'DIA',
];
const apiArray = [
    apiGet(apiRoutes.getNews, {symbols})
];

const marketNews = ref([]);
const {
    isFetchingArray,
    errorArray,
    dataArray,
    isLoading,
    execute,
} = useApiArray(apiArray, () => {
    console.log('executing');
    marketNews.value = dataArray[0].value.data;
});

const columns = computed(() => {
    // if (marketNews.value.length === 0) {
    //     return [];
    // }
    return [
        'CreatedAt',
        'Headline',
        'Symbols',
        'URL',
    ]
        .map((key) => {
                let label = key;
                if (key === 'CreatedAt') {
                    label = 'Time';
                }
                if (key === 'Headline') {
                    label = 'News';
                }
                if (key === 'Symbols') {
                    return {
                        name: key,
                        field: key,
                        label: key,
                        align: 'left',
                        sortable: true,
                        format: (val) => {
                            return val.join(', ');
                        }
                    };
                }

                return {
                    name: key,
                    field: key,
                    label: label,
                    align: 'left',
                    sortable: true,
                };
            }
        );


});

onMounted(() => {
    execute().then(() => {
        console.log('executed market news');
    });
});

</script>


<template>
    <q-table
            :rows="marketNews"
            :columns="columns"
            row-key="ID"
            :loading="isLoading"
            wrap-cells
            title="Latest market news related to market indices SPY, DIA, QQQ, and IWM."
    >
        <template v-slot:body-cell-URL="props">
            <q-td>
                <q-btn
                        :href="props.value"
                        target="_blank"
                        icon="open_in_new"
                        round
                        dense
                        flat
                        color="primary"
                />
            </q-td>
        </template>


    </q-table>
</template>

<style scoped>

</style>