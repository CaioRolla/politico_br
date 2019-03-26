const TwitterService = require('./services/twitter');
const Markov = require('markov-strings').default;

setInterval(() => {
  run(1);
}, 1000 * 60 * 60);

async function run(stateSize = 3) {
  try {
    // Get every "following". Let's call it "friends".
    const friendsResponse = await TwitterService.getFriends();

    // Extract the friends screen names (@name)
    const friendsScreenNames = friendsResponse.users.map(
      friend => friend.screen_name
    );

    // Based on those screen names, search for tweets
    const tweetsResponse = await TwitterService.getTweetsFromScreenNames(
      friendsScreenNames
    );

    // Extract only the tweets text from the response.
    const tweetsText = tweetsResponse.statuses.map(tweet => tweet.text);

    const cleanedTweets = tweetsText.map(tweet => {
      return tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
      /*.replace(
          /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
          ''
        );*/
    });

    const filteredTweets = cleanedTweets.filter(tweet => tweet.length >= 100);

    const options = {
      maxTries: 99999,
      filter: result => {
        return (
          result.string.trim().split(' ').length >= 3 &&
          result.string.trim().split(' ').length < 200 &&
          !result.string.trim().endsWith('…')
        );
      }
    };

    const markov = new Markov(filteredTweets, { stateSize: stateSize });

    markov.buildCorpus();
    const result = markov.generate(options);

    console.log('tries: ', result.tries);
    console.log('score: ', result.score);
    console.log(result.string);

    await TwitterService.postTweet(result.string);
  } catch (error) {
    if (stateSize + 1 < 4) {
      run(stateSize + 1);
    }
    console.log(error);
  }
}
