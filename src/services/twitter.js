const Twitter = require('twitter');
const { twitterConfig } = require('../config/config');

const client = new Twitter(twitterConfig);

const getFriends = (params = {}) => {
  return client.get('friends/list', params);
};

const getTweetsFromScreenNames = screenNames => {
  const screenNamesText = screenNames.join(', OR from:');
  return client.get('search/tweets', {
    q: `from:${screenNamesText}`,
    count: 10
  });
};

module.exports = { getFriends, getTweetsFromScreenNames };
