<script setup>
import {connect, use} from "echarts/core";
import {CanvasRenderer, SVGRenderer} from "echarts/renderers";
import {LineChart} from "echarts/charts";
import {
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
} from "echarts/components";
import 'echarts/theme/jazz';
import 'echarts/theme/red';
import 'echarts/theme/cool';
import "echarts/theme/dark-digerati";
import "echarts/theme/helianthus";
import "echarts/theme/dark";

import VChart from "vue-echarts";
import {computed, defineComponent, onBeforeUnmount, ref, watch, watchEffect} from "vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/store/mainStore.js";


const props = defineProps({
    data: {
        type: Array,
        // {
        //     data: [[d,v], [d2,v2]]
        //     type: 'line',
        //     name: seriesName,
        // },
        validator(value) {
            return value.every((item) => {
                const condition1 = item.name && item.type && item.data && item.data.length > 0;
                const condition2 = item.data.every((d) => {
                    return d.length === 2 && typeof d[0] === 'string' && typeof d[1] === 'number';
                });
                console.log(condition1, condition2);
                return condition1 && condition2;
            });
        },
        required: true,
    },
    chartTitle: {
        type: String,
        required: true,
    },
    addOption: {
        type: Object,
        default: () => {
        }
    },
    showZoom: {
        type: Boolean,
        default: true,
    },
    timeUnit: {
        type: String,
        default: 'daily',
    },
    theme: {
        type: String,
        default: 'dark',
    },
    heightInPixels: {
        type: Number,
        default: 500,
        required: false
    },

});

const getOption = function (chartTitle, dataArray) {
    return {
        renderer: 'canvas',
        legend: {
            top: '11%',
            left: '10%',
            padding: [
                0,  // up
                0, // right
                0,  // down
                10, // left
            ],
            // selected: legendSelected.value || {},
        },
        dataZoom: [
            {
                type: 'slider',
                // ...dataZoomStartEnd,
                show: props.showZoom,
            }
        ],
        grid: {
            left: '11%',
            top: '20%',
            right: '11%',
            bottom: props.showZoom ? '25%' : '13%'
        },
        xAxis: {
            type: 'time',
            splitLine: {show: false},
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: (params) => {
                //Math.round(kpiValue * 100) / 100
                return `${Math.round(params[0].value[1] * 100) / 100}`;
            },
        },
        // toolbox: getToolBox(chartRef, kpiColumn, getPopUpOption),
        title: {
            text: chartTitle,
            textStyle: {
                fontSize: 15,
            },
            triggerEvent: true
        },
        yAxis: {
            splitLine: {show: false},
            type: 'value',
            scale: true,
            name: '',
            // nameLocation: 'middle',
            axisLabel: {
                inside: false,
                formatter: (value) => {
                    if (value >= 1000) {
                        // return `${(value / 1000).toFixed(1)}k`;
                        return value.toExponential(0);
                    }
                    return value;
                }
            },
        },
        series: dataArray,
        ...props.addOption,
    };
};

const chartOption = getOption(props.chartTitle, props.dataArray);

use([
    CanvasRenderer,
    SVGRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    ToolboxComponent,
    GridComponent,
    LineChart,
]);

const chartRef = ref(null);

watch(chartRef, (newVal) => {
    if (!chartRef.value) return;
    connect(props.timeUnit);
}, {immediate: true});

// method to set data
const refresh = () => {
    if (!chartRef.value) return;
    chartRef.value.setOption(getOption(props.kpiColumn, props.data, props.seriesName));
};

watch(() => props.data, () => {
    refresh();
}, {
    deep: true,
});

const mainStore = useMainStore();
const {darkMode} = storeToRefs(mainStore);
const computedTheme = computed(() => {
    if (darkMode.value) {
        return 'dark';
    }
    return 'light';
});

</script>

<template>
    <v-chart
            ref="chartRef"
            :option="chartOption"
            :theme="computedTheme"
            :autoresize="true"
            :style="`height: ${props.heightInPixels}px;`"
            :group="timeUnit"
    />
</template>


<style>
.body--dark .echarts .data-table {
    background-color: #2d2d2d;
    color: #fff;
}

.body--dark .echarts span {
    background-color: #2d2d2d;
    color: #fff;
}
</style>