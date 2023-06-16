const axios = require("axios");
const cheerio = require("cheerio");

async function scraperYahooFinance(url) {
    const html = await axios.get(url,
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }
    );
    const cheerio = require('cheerio');
    const $ = cheerio.load(html.data);
    const results = [];

    const tableRows = $('table tbody tr');
    tableRows.each((index, row) => {

        const result = {};
        const tds = $(row).find('td');
        tds.each((index, td) => {
                // use aria label as key
                const key = $(td).attr('aria-label');
                // use inner text as value
                result[key] = $(td).text();
            }
        );
        results.push(result);
    });
    return results;
}

const getTopGainers = async (req, res) => {
    // scrape yahoo finance for top gainers
    const data = await scraperYahooFinance('https://finance.yahoo.com/gainers');
    res.json({
        data,
        success: true,
        time: new Date(),
    });
};

const getTopLosers = async (req, res) => {
    // scrape yahoo finance for top losers
    const data = await scraperYahooFinance('https://finance.yahoo.com/losers');
    res.json({
        data,
        success: true,
        time: new Date(),
    });
};

module.exports = {
    scraperYahooFinance,
    getTopGainers,
    getTopLosers,
};