import {api} from "@/plugins/http.js";

export const checkApi = () => {
    return api().get(`/`);
};

export const apiRoutes = {
    getIntraDayPrices: '/getIntraDayPrices',
    getStockQuote: '/stockQuote',
    getTopGainers: '/getTopGainers',
    getTopLosers: '/getTopLosers',

}

export const apiGet = (routePath, params) => {
    return api().get(routePath, params);
}