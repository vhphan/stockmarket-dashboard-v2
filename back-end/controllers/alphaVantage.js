const {writeFile} = require("fs");
const {saveJsonAndSend} = require("#src/controllers/utils");
const axios = require("axios");
const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
const alpha = require('alphavantage')({ key: apiKey });



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

const getNewsSentiment = async (req, res) => {
    //  use axios to fetch   https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=apiKey
    const tickers = req.query.tickers;
    const data = (await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${apiKey}`)).data;
    const jsonResult = {
        data,
        success: true,
    }
    saveJsonAndSend(req, res, jsonResult);
}

module.exports = {
    getIntraDayPrices,
    getDailyPrices,
    getNewsSentiment,
}