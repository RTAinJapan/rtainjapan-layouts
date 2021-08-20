import appRootPath from "app-root-path";
import Twit from "twit";

const twitterConfig = appRootPath.require(
	"../../cfg/rtainjapan-layouts.json",
).twitter;

const twit = new Twit({
	consumer_key: twitterConfig.consumerKey,
	consumer_secret: twitterConfig.consumerSecret,
	access_token: twitterConfig.accessToken,
	access_token_secret: twitterConfig.accessTokenSecret,
});

twit.get("statuses/show/1426216461366747138").then(({data}) => {
	console.log(JSON.stringify(data));
});
