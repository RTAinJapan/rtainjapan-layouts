import appRootPath from "app-root-path";
import {TwitterApi} from "twitter-api-v2";

const twitterConfig = appRootPath.require(
	"../../cfg/rtainjapan-layouts.json",
).twitter;

const twitterApi = new TwitterApi(twitterConfig.bearer);

twitterApi.v2.tweets("1426216461366747138").then((data) => {
	console.log(JSON.stringify(data));
});
