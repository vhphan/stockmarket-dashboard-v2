// echart bar chart component with sorted data in descending order from positive to negative values
<script setup>
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {BarChart} from "echarts/charts";
import {GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent,} from "echarts/components";
import 'echarts/theme/jazz';
import 'echarts/theme/red';
import 'echarts/theme/cool';
import "echarts/theme/dark-digerati";
import "echarts/theme/helianthus";
import "echarts/theme/dark";

import VChart from "vue-echarts";
import {computed, ref} from "vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/store/mainStore.js";

use([
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    BarChart,
]);

const props = defineProps({
    chartData: {
        type: Array,
        required: true,
        validator(val) {
            return val.every((item) => {
                return Object.keys(item).includes('name') && Object.keys(item).includes('value');
            });
        },
    },
    chartTitle: {
        type: String,
        default: '',
    },
    heightInPixels: {
        type: Number,
        default: 500,
    },
});

const labelRight = {
    position: 'right'
};

const labelLeft = {
    position: 'left'
};

const seriesData = computed(() => {
    return props.chartData
        .sort((a, b) => a.value - b.value)
        .map((item) => ({
            value: item.value,
            label: item.value >= 0 ? labelRight : labelLeft,
            itemStyle: {
                color: item.value >= 0 ? '#00b050' : '#ff0000'
            }
        }));
});

const xAxisData = computed(() => {
    return props.chartData
        .sort((a, b) => a.value - b.value)
        .map((item) => item.name);
});

const getOption = function (seriesData, xAxisData, chartTitle) {
    console.log(seriesData, xAxisData, chartTitle);
    return {
        title: {
            text: chartTitle
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: 80,
            bottom: 30
        },
        xAxis: {
            type: 'value',
            position: 'top',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            axisLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data: xAxisData
        },
        series: [
            {
                name: 'Cost',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    formatter: '{b}'
                },
                data: seriesData,
            }
        ]
    };
};
const chartOption = getOption(seriesData.value, xAxisData.value, props.chartTitle);

const mainStore = useMainStore();
const {darkMode} = storeToRefs(mainStore);
const computedTheme = computed(() => {
    if (darkMode.value) {
        return 'dark';
    }
    return 'light';
});

const chartRef = ref(null);


</script>

<template>
    <v-chart
            ref="chartRef"
            :option="chartOption"
            :theme="computedTheme"
            :autoresize="true"
            :style="`height: ${props.heightInPixels}px;`"
    />

</template>