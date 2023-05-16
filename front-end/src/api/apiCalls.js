import {api} from "@/plugins/http.js";

export const checkApi = () => {
    return api().get(`/`);
};

export const apiRoutes = {
    getIntraDayPrices: '/getIntraDayPrices',
    getDailyPrices: '/getDailyPrices',
    getStockQuote: '/getStockQuote',
    getTopGainers: '/getTopGainers',
    getTopLosers: '/getTopLosers',
    getBarsMultipleSymbols: '/getBarsMultipleSymbols',

}

export const apiGet = (routePath, params) => {
    return api().get(routePath, params);
}