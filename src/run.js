const TwitterService = require('./services/twitter');

(async () => {
  const friendsResponse = await TwitterService.getFriends();

  const friendsScreenNames = friendsResponse.users.map(friend => {
    return friend.screen_name;
  });

  const tweetsResponse = await TwitterService.getTweetsFromScreenNames(friendsScreenNames);

  const tweetsText = tweetsResponse.statuses.map((tweet)=>{
    return tweet.text;
  });

  const cleanedTweets = tweetsText.map((tweet) => {
    return tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
  });

  console.log(cleanedTweets);
})();
