<script setup>
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted} from "vue";
import {useApiArray} from "@/composables/api.js";
import TopMovers from "@/components/TopMovers.vue";

const props = defineProps({
    symbols: {
        type: Array,
        default: () => [
            'MSFT',
            'AAPL',
            'AMZN',
            'GOOG',
            'META',
            'TSLA',
            'NVDA',
            'PYPL',
            'ADBE',
            'NFLX',
            'CMCSA',
            'PEP',
            'COST',
            'TMUS',
            'AVGO',
            'TXN',
            'CHTR',
            'QCOM',
            'INTC',
            'AMGN',
            'SBUX',
            'AMD',
            'INTU',
            'ISRG',
            'ZM',
        ],
    },

});

const apiArray = props.symbols.map((symbol) => {
    return apiGet(apiRoutes.getStockQuote, {symbol});
});

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

const numberOfValidDataPoints = computed(() => {
    // each data point is valid if it is an object with success property = true;
    const validDataPoints = dataArray.filter((data) => {
        if (!data.value) {
            return false;
        }

        return data.value.success;
    });
    return validDataPoints.length;


});

const validDataArray = computed(() => {
    if (numberOfValidDataPoints.value === 0) {
        return [];
    }
    return dataArray.filter((data) => data.value && data.value.success);
});

const tickersPriceChange = computed(() => {

    if (!validDataArray.value) {
        return [];
    }

    if (numberOfValidDataPoints.value === 0 || !validDataArray.value.map) {
        return [];
    }

    return validDataArray.value.map((d) => {
        const {data} = d.value;
        return {
            symbol: data.symbol,
            priceChange: data.c - data.pc,
        };
    });
});


</script>

<template>

    <div class="scroll-left">
        <p>

        <span
                v-for="ticker in tickersPriceChange"
                :key="ticker.symbol"
        >
            {{ ticker.symbol }}:

            <span :style="`color: ${ticker.priceChange>=0? '#00fc00': '#ff4848'}`">
                 &nbsp;{{ticker.priceChange>0?'+':''}}{{ ticker.priceChange.toFixed(2) }}
            </span>
            &emsp;
            &emsp;
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
        </span>
        </p>

    </div>

</template>

<style>

.scroll-left {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: black;
    color: white;
    border: 1px solid blue;
}

.scroll-left p {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    line-height: 50px;
    text-align: center;
    /* Starting position */
    transform: translateX(100%);
    /* Apply animation to this element */
    animation: scroll-left 15s linear infinite;
}

/* Move it (define the animation) */
@keyframes scroll-left {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(-100%);
    }
}

</style>