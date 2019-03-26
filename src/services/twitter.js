const Twitter = require('twitter');
const { twitterConfig } = require('../config/config');

const client = new Twitter(twitterConfig);

const getFriends = (params = {}) => {
  return client.get('friends/list', params);
};

const getTweetsFromScreenNames = screenNames => {
  const screenNamesText = screenNames.join(', OR from:');
  //let results = [];
  return client.get('search/tweets', {
    q: `from:${screenNamesText}`,
    count: 100
  });
};

const postTweet = (tweet) => {
  return client.post('statuses/update', {status: tweet});
}

module.exports = { getFriends, getTweetsFromScreenNames, postTweet };
