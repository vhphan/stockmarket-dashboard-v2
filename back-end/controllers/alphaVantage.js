const {writeFile} = require("fs");
const alpha = require('alphavantage')({ key: process.env.ALPHA_VANTAGE_API_KEY });

function saveResultToJSON(req, jsonResult) {
    // save result to file
    const jsonFileName = req.url.replace('/', '').replace('?', '_').replaceAll('&', '_') + '.json';
    const jsonFile = global.__appDir + '/data/' + jsonFileName;
    writeFile(jsonFile, JSON.stringify(jsonResult, null, 2), (err) => {
        if (err) throw err;
    }, () => {
        console.log(`Data written to file ${jsonFile}`);
    });
}

const getIntraDayPrices = async (req, res) => {
    const symbol = req.query.symbol;
    const data = await alpha.data.intraday(symbol, 'compact', 'json', '5min');
    const jsonResult = {
        data,
        success: true,
    };
    saveResultToJSON(req, jsonResult);
    res.json(jsonResult);
}

module.exports = {
    getIntraDayPrices,
}