const {writeFile} = require("fs");
const {saveJsonAndSend} = require("#src/controllers/utils");
const alpha = require('alphavantage')({ key: process.env.ALPHA_VANTAGE_API_KEY });



const getIntraDayPrices = async (req, res) => {
    const symbol = req.query.symbol;
    const data = await alpha.data.intraday(symbol, 'compact', 'json', '5min');
    const jsonResult = {
        data,
        success: true,
    };
    saveJsonAndSend(req, res, jsonResult);
}

const getDailyPrices = async (req, res) => {
    const symbol = req.query.symbol;
    const data = await alpha.data.daily_adjusted(symbol, 'compact', 'json');
    const jsonResult = {
        data,
        success: true,
    };
    saveJsonAndSend(req, res, jsonResult);
}

module.exports = {
    getIntraDayPrices,
    getDailyPrices,
}