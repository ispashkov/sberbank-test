const stocks = require('./stocks');
const express = require('express');
const cors = require('cors');
const app = express();
const {
  host,
  port,
  generationIntervalInMills,
  maxQuotePrice,
  minQuotePrice
} = require('./command-line-arguments');

const EVENT_STREAM_MEDIA_TYPE = 'text/event-stream';
const APPLICATION_JSON_MEDIA_TYPE = 'application/json';

app.use(cors());

app.get('/stocks/', (req, res) => {
  res.json(stocks);
});

app.get('/quotes/', (req, res) => {
  switch (req.accepts([APPLICATION_JSON_MEDIA_TYPE, EVENT_STREAM_MEDIA_TYPE])) {
    case APPLICATION_JSON_MEDIA_TYPE:
      return sendQuotesJson(res);
    case EVENT_STREAM_MEDIA_TYPE:
      return sendQuotesStream(req, res, generationIntervalInMills);
    default:
      return res.sendStatus(415);
  }
});

function sendQuotesJson(res) {
  res.json(
    quotes(minQuotePrice, maxQuotePrice)
  );
}

const quotes = (minPrice, maxPrice) => stocks.map(stock => ({
    ...stock,
    currency: 'USD',
    price: nextPrice(minPrice, maxPrice)
  })
);

function nextPrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function sendQuotesStream(req, res, emissionIntervalInMills) {
  res.writeHead(200, {
    'Content-Type': EVENT_STREAM_MEDIA_TYPE,
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const interval = setInterval(() => {
    quotes(minQuotePrice, maxQuotePrice).forEach(quote => sendEventStreamData(res, quote));
  }, emissionIntervalInMills);

  req.on('close', () => clearInterval(interval));
}

function sendEventStreamData(res, data) {
  res.write('data: ' + JSON.stringify(data) + '\n\n');
}

app.listen(port, host, () => {
  console.log(`Server started on ${host}:${port}.`)
});
