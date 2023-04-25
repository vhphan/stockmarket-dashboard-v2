// FILE: vite.config.js
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { basePath } from "./src/config/constants.js";
import { fileURLToPath, URL } from "url";
// https://vitejs.dev/config/
function getBuild() {
    const now = new Date();
    const padTwo = (val) => (val > 9 ? "" : "0") + val;
    const nowMonth = now.getMonth() + 1;
    const nowDay = now.getDate();
    const verBuildDate = now.getFullYear() + padTwo(nowMonth) + padTwo(nowDay);
    const verBuildTime = padTwo(now.getHours()) + padTwo(now.getMinutes()) + padTwo(now.getSeconds());
    return { verBuildDate, verBuildTime };
}

export default ({ mode }) => {
    const { verBuildDate, verBuildTime } = getBuild();
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
    // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

    return defineConfig({
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        plugins: [
            vue({
                template: { transformAssetUrls }
            }),
            quasar({
                sassVariables: 'src/quasar-variables.sass'
            }),
        ],
        server: {
            port: 3369,
        },
        base: basePath,
        define: {
            '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
            '__APP_BUILD__': `${verBuildDate}.${verBuildTime.slice(0, 4)}`,
        },
    });
}
