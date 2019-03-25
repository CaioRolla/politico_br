const Twitter = require('twitter');
const { twitterConfig } = require('../config/config');

const client = new Twitter(twitterConfig);


module.exports = { getAccount };