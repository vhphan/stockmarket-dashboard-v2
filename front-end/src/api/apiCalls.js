import {api} from "@/plugins/http.js";

export const checkApi = () => {
    return api().get(`/`);
};

const apiRoutes = {
    getIntraDayPrices: '/getIntraDayPrices',

}

export const apiGet = (routeName, params) => {
    return api().get(apiRoutes[routeName], params);
}