const TwitterService = require('./services/twitter');
const Markov = require('markov-strings').default;

(async function run(stateSize = 3) {
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

    const filteredTweets = cleanedTweets.filter(tweet => tweet.length >= 50);

    const options = {
      maxTries: 99999,
      filter: result => {
        return (
          result.string.split(' ').length >= 3 &&
          result.string.split(' ').length < 250 &&
          !result.string.endsWith('…')  
        );
      }
    };

    const markov = new Markov(filteredTweets, { stateSize });
    markov.buildCorpus();
    const result = markov.generate(options);
    console.log(result.tries, result.string.length, result.string);
  } catch (error) {
    if (stateSize - 1 > 0) {
      run(stateSize - 1);
    }
    console.log(error);
  }
})(3);


