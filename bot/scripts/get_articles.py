import argparse
import time

import backoff
import requests
from bs4 import BeautifulSoup
from loguru import logger

from bot.scripts.get_news import get_ticker_news


def parse_args():
    # Add a tickers argument to the parser. Tickers are ticker names separated by commas`
    parser = argparse.ArgumentParser(description='Get news articles for a ticker.')
    parser.add_argument('--tickers', type=str, help='tickers to get news for. Comma-separated')
    return parser.parse_args()


# create a generator yielding successive wait times in seconds. Successive wait times are
# 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, ...
# The generator is used to wait between retries.
def wait_gen():
    n = 1
    while True:
        yield n
        n *= 2


@backoff.on_exception(lambda: backoff.expo(4, 2), requests.exceptions.HTTPError, max_time=60, logger=logger,
                      max_tries=5)
def get_request_soup(url):
    logger.info(f'trying {url}')
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'}
    logger.info(f'waiting 2 seconds before getting {url}')
    time.sleep(2)
    logger.info(f'getting {url}')
    res = requests.get(url, headers=headers)
    logger.info(f'got {res.status_code} for {url}')
    res.raise_for_status()
    return BeautifulSoup(res.content, 'html.parser')


def scrape_articles(tickers: list[str]) -> None:
    for ticker in tickers:
        headlines = get_ticker_news(ticker, 'object')
        logger.info(f'Got {len(headlines)} headlines for {ticker}')
        for headline in headlines:
            url = headline['link']
            soup = get_request_soup(url)
            soup_select = soup.select('.caas-body > p')
            logger.info(f'Got {len(soup_select)} paragraphs for {url}')
            article = '\n'.join([p.get_text(strip=True) for p in soup_select])
            filename = f'bot/data/news/articles/{ticker}_{headline["providerPublishTime"]}.txt'
            with open(filename, 'w') as f:
                f.write('ticker: ' + ticker + '\n')
                f.write('headline: ' + headline['title'] + '\n')
                f.write('url: ' + url + '\n')
                f.write(article)
                logger.info(f'Wrote article to {filename}')


def main():
    args = parse_args()
    tickers = args.tickers.split(',')
    scrape_articles(tickers)


if __name__ == '__main__':
    scrape_articles(['AAPL', 'MSFT', 'TSLA'])
