const express = require('express');
const router = express.Router();
const mainController = require('#src/controllers/main');
const finnhubController = require('#src/controllers/finnhub');
const alpacaController = require('#src/controllers/alpaca');
const alphaVantageController = require('#src/controllers/alphaVantage');
const scraperController = require('#src/controllers/scrapers');
const apiCache = require('apicache-plus');
const asyncHandler = require("#src/middlewares/async");
const errorHandler = require("#src/middlewares/error");

// router.use(apiCache('10 minutes'));

const onlyStatus200 = (req, res) => res.statusCode === 200;
const fifteenMinutesCache = apiCache.middleware('15 minutes', onlyStatus200);
const oneHourCache = apiCache.middleware('1 hour', onlyStatus200);
const oneDayCache = apiCache.middleware('1 day', onlyStatus200);

router.use(errorHandler);


if (process.env.NODE_ENV === 'development') {
    router.use(mainController.devModeStaticApi);
}
router.get('/', mainController.index);

router.get('/getBars', fifteenMinutesCache, asyncHandler(alpacaController.getBars));
router.get('/getBarsMultipleSymbols', fifteenMinutesCache, asyncHandler(alpacaController.getBarsMultipleSymbols));
router.get('/getMajorIndexes', fifteenMinutesCache, asyncHandler(alpacaController.getMajorIndexes));
router.get('/getAssetInfo', fifteenMinutesCache, asyncHandler(alpacaController.getAssetInfo));
router.get('/getActiveAssets', oneDayCache, asyncHandler(alpacaController.getActiveAssets));

router.get('/getTopGainers', fifteenMinutesCache, asyncHandler(scraperController.getTopGainers));
router.get('/getTopLosers', fifteenMinutesCache, asyncHandler(scraperController.getTopLosers));

router.get('/getMarketNews', fifteenMinutesCache, asyncHandler(finnhubController.getMarketNews));
router.get('/getStockSymbols', fifteenMinutesCache, asyncHandler(finnhubController.getStockSymbols));
router.get('/getCompanyProfile', fifteenMinutesCache, asyncHandler(finnhubController.getCompanyProfile));
router.get('/stockQuote', fifteenMinutesCache, asyncHandler(finnhubController.getStockQuote));

router.get('/getIntraDayPrices', oneHourCache, asyncHandler(alphaVantageController.getIntraDayPrices));
router.get('/getBarsMultipleSymbols', oneHourCache, asyncHandler(alpacaController.getBarsMultipleSymbols));

finnhubController.init();
alpacaController.init();

module.exports = router;
