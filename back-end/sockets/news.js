"use strict";


const Alpaca = require("@alpacahq/alpaca-trade-api");
require('dotenv').config();
const API_KEY = process.env.ALPACA_LIVE_API_KEY;
const API_SECRET = process.env.ALPACA_LIVE_SECRET;

class DataStream {
    constructor({apiKey, secretKey}) {

        this.alpaca = new Alpaca({
            keyId: apiKey,
            secretKey,
        });

        const socket = this.alpaca.news_stream;

        socket.onConnect(function () {
            console.log("Connected");
            socket.subscribeForNews(['MSFT', 'AAPL', 'FB', 'GOOG', 'AMZN']);

        });

        socket.onError((err) => {
            console.log(err);
        });


        socket.onStateChange((state) => {
            console.log(state);
        });

        socket.onDisconnect(() => {
            console.log("Disconnected");
        });

        socket.onNews((news) => {
                console.log(news);
            }
        );

        socket.connect();

    }
}

let stream = new DataStream({
    apiKey: API_KEY,
    secretKey: API_SECRET,
});