(function(d) {
	const config = {
		kitId: nodecg.bundleConfig.adobe.kitId,
		scriptTimeout: 3000,
		async: true
	};
	const h = d.documentElement;
	const t = setTimeout(() => {
		h.className =
			h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
	}, config.scriptTimeout);
	const tk = d.createElement('script');
	let f = false;
	const s = d.getElementsByTagName('script')[0];
	let a;

	h.className += ' wf-loading';
	tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
	tk.async = true;

	const readyFunc = function() {
		/* global Typekit */
		a = this.readyState;
		if (f || (a && a !== 'complete' && a !== 'loaded')) {
			return;
		}
		f = true;
		clearTimeout(t);
		try {
			Typekit.load(config);
		} catch (err) {
			throw new Error('Failed to load font.');
		}
	};
	tk.onload = readyFunc;
	tk.onreadystatechange = readyFunc;
	s.parentNode.insertBefore(tk, s);
})(document);
