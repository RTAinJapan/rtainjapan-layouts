import nodecg from '../../lib/nodecg';

export const twitterCallback = () => {
	const storage = sessionStorage.getItem('twitter-callback');
	sessionStorage.removeItem('twitter-callback');
	if (!storage) {
		return;
	}

	const params = new URLSearchParams(storage);
	nodecg.sendMessage('twitterOauth', {
		oauthToken: params.get('oauth_token'),
		oauthVerifier: params.get('oauth_verifier'),
	});
};
