const TwitterService = require('./services/twitter');
const Markov = require('markov-strings').default;

(async () => {
  try {
    const friendsResponse = await TwitterService.getFriends();

    const friendsScreenNames = friendsResponse.users.map(friend => {
      return friend.screen_name;
    });

    const tweetsResponse = await TwitterService.getTweetsFromScreenNames(
      friendsScreenNames
    );

    const tweetsText = tweetsResponse.statuses.map(tweet => {
      return tweet.text;
    });

    const cleanedTweets = tweetsText.map(tweet => {
      return tweet
        .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
        .replace(
          /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
          ''
        );
    });

    const filteredTweets = cleanedTweets.filter(tweet => {
      return tweet.length >= 100;
    });

    console.log(filteredTweets);

    const options = {
      maxTries: 2000,
      filter: result => {
        return (
          result.string.split(' ').length >= 5 && result.string.endsWith('.')
        );
      }
    };

    const markov = new Markov(filteredTweets, { stateSize: 1 });
    markov.buildCorpus();
    const result = markov.generate(options);
    console.log(result.string);
  } catch (error) {
    console.log(error);
  }
})();
