import argparse
import json
from typing import Literal

import yfinance as yf


def parse_args():
    parser = argparse.ArgumentParser(description='Get news for a ticker.')
    parser.add_argument('--ticker', type=str, help='ticker to get news for')
    parser.add_argument('--limit', type=int, default=10, help='number of news items to get')

    args = parser.parse_args()
    return args


def main():
    args = parse_args()
    ticker_name = args.ticker
    get_ticker_news(ticker_name, ticker_name)


def get_ticker_news(ticker_name: str, return_type: Literal['path', 'object']) -> str | list[dict]:
    ticker = yf.Ticker(ticker_name)
    news = ticker.news
    filename = f'bot/data/news/headlines/{ticker_name}.json'
    json.dump(news, open(filename, 'w'), indent=4)
    if return_type == 'path':
        return filename
    return news


if __name__ == '__main__':
    main()
