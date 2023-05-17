
<script setup>

import SectorsChart from "@/components/SectorsChart.vue";
import SectorsBarChart from "@/components/SectorsBarChart.vue";
import MarketNews from "@/components/MarketNews.vue";
</script>


<template>

    <div class="row">
        <div class="col-12 col-md-8" style="border: #535bf2 1px solid">
            <sectors-chart/>
        </div>
        <div class="col-12 col-md-4" style="border: #535bf2 1px solid">
            <sectors-bar-chart />
        </div>
    </div>
    <div>
        <market-news />
    </div>

</template>

<style scoped>

</style>