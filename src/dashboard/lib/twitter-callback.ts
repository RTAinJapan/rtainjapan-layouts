import nodecg from '../../lib/nodecg';

export const twitterCallback = () => {
	const storage = localStorage.getItem('twitter-callback');
	localStorage.removeItem('twitter-callback');
	if (!storage) {
		return;
	}

	const params = new URLSearchParams(storage);
	nodecg.sendMessage('twitter:loginSuccess', {
		oauthToken: params.get('oauth_token'),
		oauthVerifier: params.get('oauth_verifier'),
	});
};
