const alpha = require('alphavantage')({ key: process.env.ALPHA_VANTAGE_API_KEY });

const getIntraDayPrices = async (req, res) => {
    const symbol = req.query.symbol;
    // alpha.data.intraday(symbol, outputsize, datatype, interval);
    const data = await alpha.data.intraday(symbol, 'compact', 'json', '5min');
    res.json({
        data,
        success: true,
    });
}

module.exports = {
    getIntraDayPrices,
}