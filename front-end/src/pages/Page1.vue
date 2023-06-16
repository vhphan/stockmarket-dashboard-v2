<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed} from "vue";
import SimpleChart from "@/components/SimpleChart.vue";
import {triggerNegative} from "@/utils/notifications.js";
import ScrollingTickers from "@/components/ScrollingTickers.vue";
import TopMovers from "@/components/TopMovers.vue";

const mainStore = useMainStore();
const {indexSymbols, indexIntraDayData} = storeToRefs(mainStore);

const apiArray = indexSymbols.value.map((symbol) => {
  return apiGet(apiRoutes.getIntraDayPrices, {symbol});
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
    if (error === null || error.value === null) {
      return;
    }
    if (error.value) {
      triggerNegative({message: error.value});
    }
  });
  if (dataArray.length > 0) {
    mainStore.saveIntraDayDataArray(dataArray);
  }
};

const indexDatas = computed(() => {
  const results = {};
  indexSymbols.value.forEach((symbol) => {
    results[symbol] = indexIntraDayData.value[symbol].map(
        (data) => {
          return {
            time: new Date(data.time).getTime() / 1000,
            value: parseFloat(data['4. close']),
          };
        }
    ).sort((a, b) => a.time - b.time);
  });
  return results;
});

const chartColors = [
  '#2196f3',
  '#4caf50',
  '#ff9800',
];


</script>

<template>
  <div class="full-width">
    <scrolling-tickers/>
  </div>


  <div class="row">

    <div class="col-4"
         v-for="(symbol, index) in indexSymbols"
    >

      <div>
        <div class="text-h6">
          <q-icon name="bar_chart"/>
          {{ symbol }} Index
        </div>
        <q-item-label>Intraday Price Chart For {{ symbol }}</q-item-label>
      </div>
      <simple-chart
          :key="symbol"
          :data="indexDatas[symbol]"
          :title="symbol"
          :color="chartColors[index]"
      />
    </div>

  </div>
  <!--    <q-btn-->
  <!--        :loading="isLoading"-->
  <!--        :disabled="isLoading"-->
  <!--        @click="execute"-->
  <!--        color="primary"-->
  <!--    >-->
  <!--        Execute-->
  <!--    </q-btn>-->
  <div>
    <top-movers/>
  </div>

</template>


<style scoped>


</style>