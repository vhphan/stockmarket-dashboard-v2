# %%
import os
from datetime import datetime

# %%
from alpaca.data.historical import CryptoHistoricalDataClient, StockHistoricalDataClient
from alpaca.data.requests import CryptoBarsRequest, StockBarsRequest
from alpaca.data.requests import StockLatestQuoteRequest
from alpaca.data.timeframe import TimeFrame

# %%
from dotenv import load_dotenv

load_dotenv('bot/.env')

# %%
# no keys required for crypto data
crypto_client = CryptoHistoricalDataClient()

request_params = CryptoBarsRequest(
    symbol_or_symbols=[
        "BTC/USD",
        "ETH/USD",
        "LTC/USD",
        "BCH/USD",
        "XRP/USD",
    ],
    timeframe=TimeFrame.Day,
    start=datetime(2022, 1, 1)
)

bars = crypto_client.get_crypto_bars(request_params)

# %%
# secret_key, api_key = os.getenv('ALPACA_PAPER_SECRET'), os.getenv('ALPACA_PAPER_API_KEY')
# stock_client = StockHistoricalDataClient(api_key, secret_key)
#
# # %%
# multisymbol_request_params = StockLatestQuoteRequest(symbol_or_symbols=["SPY", "GLD", "TLT"])
#
# latest_multisymbol_quotes = stock_client.get_stock_latest_quote(multisymbol_request_params)

# %%


