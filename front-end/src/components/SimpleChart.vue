<script setup>
import { ref } from 'vue';

import LWChart from './LWChart.vue';

// define props called data where data is list of object with keys time, value

const props = defineProps({
    data: Array,
    title: String,
    color: String,
})

const chartOptions = ref({

});
const seriesOptions = ref({
    color: props.color || 'rgb(45, 77, 205)',
    title: props.title,
});
const chartType = ref('line');
const lwChart = ref();

function randomShade() {
    return Math.round(Math.random() * 255);
}

const randomColor = (alpha = 1) => {
    return `rgba(${randomShade()}, ${randomShade()}, ${randomShade()}, ${alpha})`;
};

const colorsTypeMap = {
    area: [
        ['topColor', 0.4],
        ['bottomColor', 0],
        ['lineColor', 1],
    ],
    bar: [
        ['upColor', 1],
        ['downColor', 1],
    ],
    baseline: [
        ['topFillColor1', 0.28],
        ['topFillColor2', 0.05],
        ['topLineColor', 1],
        ['bottomFillColor1', 0.28],
        ['bottomFillColor2', 0.05],
        ['bottomLineColor', 1],
    ],
    candlestick: [
        ['upColor', 1],
        ['downColor', 1],
        ['borderUpColor', 1],
        ['borderDownColor', 1],
        ['wickUpColor', 1],
        ['wickDownColor', 1],
    ],
    histogram: [['color', 1]],
    line: [['color', 1]],
};

const changeColors = () => {
    const options = {};
    const colorsToSet = colorsTypeMap[chartType.value];
    colorsToSet.forEach((c) => {
        options[c[0]] = randomColor(c[1]);
    });
    seriesOptions.value = options;
};




</script>

<template>
    <div class="chart-container">
        <LWChart
                :type="chartType"
                :data="data"
                :autosize="true"
                :chart-options="chartOptions"
                :series-options="seriesOptions"
                ref="lwChart"
        />
    </div>
    <button type="button" @click="changeColors">Set Random Colors</button>
</template>
<style scoped>
.chart-container {
    /*height: calc(100% - 3.2em);*/
    height: 250px;
}
</style>
