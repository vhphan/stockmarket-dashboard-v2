import {createFetch} from "@vueuse/core";
import {colorTrace} from "@/utils/myFunctions.js";
import {triggerNegative} from "@/utils/notifications.js";

export function getBaseUrl() {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_BASE_URL_PROD_NODE;
    }
    return import.meta.env.VITE_API_BASE_URL_DEV_NODE;
}

class MyFetch {
    constructor(baseUrl) {

        this.baseUrl = baseUrl;
        this.useFetchOptions = {
            immediate: false,

            onFetchError(ctx) {
                // ctx.data can be null when 5xx response
                console.error(ctx);
                return ctx;
            },

        };

        this.myUseFetch = createFetch({

            baseUrl,
            options: this.useFetchOptions,

        });


    }

    errorHandling(error, statusCode) {

        colorTrace(error, 'red');

        triggerNegative({
            message: error.message,
            position: 'center',
        });

        const errorMessage = data.data?.message || error.statusText;

        triggerNegative({
            message: errorMessage,
        });

        if (statusCode !== 200) {
            triggerNegative({
                message: `Something went wrong. Status code ${statusCode}`,
            });
        }

    }

    get(url, params = {}) {

        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                        searchParams.append(key + '[]', v);
                    }
                );
                continue;
            }
            searchParams.append(key, value);
        }

        const query = searchParams.toString();

        let fetcher = this.myUseFetch(url + '?' + query);

        const {
            statusCode,
            // abort,
            // canAbort,
            isFetching,
            error,
            data,
        } = fetcher.get().json();

        if (error.value) {
            this.errorHandling(error.value, statusCode.value);
        }

        return {isFetching, error, data, execute: fetcher.execute};

    }

}

const BASE_URL_NODE = getBaseUrl();

export const api = () => new MyFetch(BASE_URL_NODE + '/api/v1');

