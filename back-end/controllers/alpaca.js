const Alpaca = require("@alpacahq/alpaca-trade-api");
const {logger} = require("#src/middlewares/logger");
const moment = require("moment");
const _ = require("lodash");
const {schedule} = require("node-cron");

const updateAlpacaData = async () => {
    try {
        const alpaca = global.__alpaca;
        logger.info('updating alpaca data');
        global.__clock = await alpaca.getClock();
        global.__calendar = !global.__isDev ? await alpaca.getCalendar() : require('../data/calendar.json');
        logger.info('alpaca data updated');
    } catch (e) {
        logger.error(e.message);
    }
};

const init = async function () {
    try {

        if (!global.__alpacaCron) {
            // update alpaca data on startup
            logger.info('initializing alpaca cron');

            await updateAlpacaData();

            global.__alpacaCron = schedule('*/10 * * * *', () => {
                    updateAlpacaData().then(r => {
                        logger.info('alpaca data updated via cron');
                    });
                },
            );

        }

        if (!global.__alpaca) {
            logger.info('initializing alpaca api');
            const API_KEY = process.env.ALPACA_LIVE_API_KEY;
            const API_SECRET = process.env.ALPACA_LIVE_SECRET;

            global.__alpaca = new Alpaca({
                keyId: API_KEY,
                secretKey: API_SECRET,
            });
            logger.info('Successfully initialized alpaca api');
        }

    } catch (e) {
        logger.error(e.message);
    }
};

async function getLastNTradingDays(numberOfDays) {

    if (!global.__clock || !global.__calendar) {
        logger.error("clock or tradingDays is not defined");
        await updateAlpacaData();
    }

    const clock = global.__clock;
    const tradingDays = global.__calendar;

    const i = _.findLastIndex(
        tradingDays,
        (d) => d.date <= moment(clock).format("YYYY-MM-DD")
    );

    return tradingDays.slice(i - (numberOfDays - 1), i + 1);

}

async function getDataFromAsyncGenerator(generator) {
    const data = [];
    for await (const d of generator) {
        data.push(d);
    }
    return data;
}

async function getBarsFromAlpaca({symbol, numberOfDays = 10, timeframe = "1Day"}) {

    const alpaca = global.__alpaca;
    const lastNTradingDays = await getLastNTradingDays(numberOfDays);

    const bars = alpaca.getBarsV2(symbol, {
        start: lastNTradingDays.shift().date,
        // end: last10TradingDays.pop().date,
        timeframe: timeframe,
        adjustment: "all",
    });
    return await getDataFromAsyncGenerator(bars);

}

async function getBarsMultipleSymbolsFromAlpaca({symbols, numberOfDays = 10, timeframe = "1Day"}) {
    const alpaca = global.__alpaca;
    const lastNTradingDays = await getLastNTradingDays(numberOfDays);

    const bars = alpaca.getMultiBarsAsyncV2(symbols, {
        start: lastNTradingDays.shift().date,
        // end: last10TradingDays.pop().date,
        timeframe: timeframe,
        adjustment: "all",
    });
    return await getDataFromAsyncGenerator(bars);
}

async function getMajorIndexesFromAlpaca() {
    const alpaca = global.__alpaca;
    // const lastNTradingDays = getLastNTradingDays(5);

    return (await getDataFromAsyncGenerator(await alpaca.getSnapshots(
            // ["SPY", "DIA", "IWM", "VTI", "MDY", "DBC"],
            [
                "SPY",
                "QQQ",
                "IWM",
                "DIA",
                "VTI",
                "MDY",
                "DBC",
                "FEZ",
                "OEF",
                "IWF",
                "IWD",
                "PFF",
                "VOO",
                "IJH",
                "IWO",
                "IWN",
                "ACWI",
                "IEMG",
            ]
        ))
    );
}


const getBars = async (req, res) => {
    // timeframe: '1Min' | '5Min' | '15Min' | '1H' | '1D',
    const {symbol, numberOfDays, timeframe} = req.query;
    const data = await getBarsFromAlpaca({
        symbol: symbol || 'SPY',
        numberOfDays: numberOfDays || 10,
        timeframe: timeframe || '1Day',
    });
    res.json({
        data,
        success: true,
    });
};


const getMajorIndexes = async (req, res) => {
    const data = await getMajorIndexesFromAlpaca();
    res.json({
        data,
        success: true,
    });
};


const getAssetInfo = async (req, res) => {
    const alpaca = global.__alpaca;
    const symbol = req.query.symbol;
    const data = (await alpaca.getAsset(symbol));
    res.json({
        data,
        success: true,
    });
};

const getActiveAssets = async (req, res) => {
    const alpaca = global.__alpaca;
    const exchange = req.query.exchange || 'NASDAQ';
    logger.info(`getting active assets for exchange ${exchange} from ALPACA API...`);
    const data = (await alpaca.getAssets({status: 'active'})).filter(asset => asset.exchange === exchange).map(asset => {
        return {
            value: asset.symbol,
            label: `${asset.symbol} - ${asset.name}`,
        };
    });
    res.json({
        data,
        success: true,
    });
};

const getBarsMultipleSymbols = async (req, res) => {
    const {symbols, numberOfDays, timeframe} = req.query;
    const data = await getBarsMultipleSymbolsFromAlpaca({
        symbols,
        numberOfDays,
        timeframe,
    });
    res.json({
        data,
        success: true,
    });
};

const getBarsMultipleSymbolsDaily = async (req, res) => {
    const {symbols, numberOfDays} = req.query;
    const data = await getBarsMultipleSymbolsFromAlpaca({
        symbols,
        numberOfDays,
    });
    res.json({
        data,
        success: true,
    });
};


module.exports = {
    init,

    getBars,
    getMajorIndexes,
    updateAlpacaData,
    getBarsMultipleSymbols,

    getDataFromAsyncGenerator,

    getAssetInfo,
    getActiveAssets,
    getBarsMultipleSymbolsDaily,

};