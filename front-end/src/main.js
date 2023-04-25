import {createApp} from 'vue';
import {Dialog, LoadingBar, Notify, Quasar} from 'quasar';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue';
import router from "./router/index.js";
import {createPinia} from "pinia";

const pinia = createPinia();
const myApp = createApp(App);
myApp.use(Quasar, {
    plugins: [Notify, LoadingBar, Dialog], // import Quasar plugins and add here
    config: {
        notify: {},
        loadingBar: {
            color: 'warning',
            size: '10px',
            position: 'bottom'
        },
    },
    animations: 'all'
});

myApp.use(router);

// Assumes you have a <div id="app"></div> in your index.html
myApp.use(pinia);

myApp.mount('#app');