<script setup>
import {computed, ref, watch} from "vue";
import {sidebarItems} from "@/router/sidebarItems.js";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/store/mainStore.js";
import {useQuasar} from "quasar";

const drawer = ref(false);
const miniState = ref(false);
const drawerClick = function (e) {
    // if in "mini" state and user
    // click on drawer, we switch it to "normal" mode
    if (miniState.value) {
        miniState.value = false;

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation();
    }
};

const route = useRoute();
const routeName = computed(() => route.name);

const mainStore = useMainStore();
const {darkMode} = storeToRefs(mainStore);
const $q = useQuasar();
watch(darkMode, (value) => {
    $q.dark.set(value);
}, {immediate: true});
</script>


<template>
    <div class="q-pa-md">
        <q-layout view="hHh Lpr lff">
            <q-header elevated>
                <q-toolbar>
                    <q-btn flat @click="drawer = !drawer" round dense icon="menu"/>
                    <q-toolbar-title>Header</q-toolbar-title>
                    <q-space/>
                    <q-toggle
                        v-model="darkMode" label="Dark Mode" dense
                        color="warning"
                    />
                </q-toolbar>
            </q-header>

            <q-drawer
                    v-model="drawer"
                    show-if-above
                    class="bg-primary text-white"
                    :mini="!drawer || miniState"
                    @click.capture="drawerClick"

                    :width="200"
                    :breakpoint="500"
                    bordered

            >
                <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
                    <!--                    <q-tabs-->
                    <!--                            vertical-->
                    <!--                            inline-label-->
                    <!--                            shrink-->
                    <!--                            stretch-->
                    <!--                            align="left"-->
                    <!--                    >-->
                    <!--                        <q-route-tab :to="`${basePath}page1`" label="Page One" icon="inbox"/>-->
                    <!--                        <q-route-tab :to="`${basePath}page2`" label="Page Two" icon="star"/>-->


                    <!--                    </q-tabs>-->

                    <q-list padding
                    >
                        <q-item
                            v-for="item in sidebarItems"
                            clickable v-ripple :to=item.to class="text-white">

                            <q-item-section avatar>
                                <q-icon :name="item.icon"/>
                            </q-item-section>

                            <q-item-section :class="{active: item.routeName===routeName}">
                                {{ item.label }}
                            </q-item-section>
                        </q-item>


                    </q-list>
                </q-scroll-area>

                <!--
                  in this case, we use a button (can be anything)
                  so that user can switch back
                  to mini-mode
                -->
                <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
                    <q-btn
                            dense
                            round
                            unelevated
                            color="accent"
                            icon="chevron_left"
                            @click="miniState = true"
                    />
                </div>
            </q-drawer>

            <q-page-container>
                <q-page class="q-px-lg q-py-md">
                    <router-view/>
                </q-page>
            </q-page-container>
        </q-layout>
    </div>
</template>
<style>

.q-mini-drawer-hide {
    transition: all .3s ease-in-out;
}

.q-drawer--standard {
    transition: all 1s ease-in-out;
}

.q-drawer--mini {
    transition: all 1s ease-in-out;
}

.active {
    /*    double underline the text*/
    text-decoration: underline;
    text-decoration-style: double;
    text-decoration-color: #37ffd4;
    /*    make text bold */
    font-weight: bold;
    /*    make font bigger */
    font-size: 1.5em;
}

</style>