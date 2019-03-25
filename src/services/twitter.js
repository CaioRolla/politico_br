const Twitter = require('twitter');
const { twitterConfig } = require('../config/config');

const client = new Twitter(twitterConfig);

const getFriendsIds = (params = {}) => {
  return client.get('friends/ids', params);
};

module.exports = { getFriendsIds };
