// import {promisify} from "util";
// import {logger} from "#src/middlewares/logger";
// import finnhub from "finnhub";
const {promisify} = require("util");
const {logger} = require("#src/middlewares/logger");
const finnhub = require("finnhub");


const init = function () {
    try {
        if (global.__finnhubClient) return;
        logger.info('initializing finnhub api');
        const api_key = finnhub.ApiClient.instance.authentications['api_key'];
        api_key.apiKey = process.env.FINNHUB_API_KEY; // Replace this
        global.__finnhubClient = new finnhub.DefaultApi();
        logger.info('Successfully initialized finnhub api');
    } catch (e) {
        logger.error(e.message);
    }
};

const getMarketNews = async (req, res) => {
    const finnhubClient = global.__finnhubClient;
    const data = await promisify(finnhubClient.marketNews.bind(finnhubClient))('general', {});
    res.json({
        data,
        success: true,
    });
};

const getStockSymbols = async (req, res) => {
    const mic = req.query.mic || 'XNAS';
    const finnhubClient = global.__finnhubClient;
    const data = await promisify(finnhubClient.stockSymbols.bind(finnhubClient))('US', {mic});
    res.json({
            data: data.map(d => ({
                symbol: d.symbol,
                description: d.description,
            })),
            success: true,
        }
    );
};

const getCompanyProfile = async (req, res) => {
    const symbol = req.query.symbol;
    const finnhubClient = global.__finnhubClient;
    const data = await promisify(finnhubClient.companyProfile2.bind(finnhubClient))({symbol});
    res.json({
            data,
            success: true,
        }
    );
};

module.exports = {
    init,
    getMarketNews,
    getStockSymbols,
    getCompanyProfile,
}