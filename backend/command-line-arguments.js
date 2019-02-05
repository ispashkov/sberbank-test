const commandLineArgs = require('command-line-args');

const settings = [
  { name: 'port', type: Number, defaultValue: 8080 },
  { name: 'host', type: String, defaultValue: '127.0.0.1' },
  { name: 'generationIntervalInMills', type: Number, defaultValue: 2000 },
  { name: 'maxQuotePrice', type: Number, defaultValue: 500 },
  { name: 'minQuotePrice', type: Number, defaultValue: 100 },
];

module.exports = commandLineArgs(settings);