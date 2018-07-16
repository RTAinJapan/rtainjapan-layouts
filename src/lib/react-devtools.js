if (process.env.NODE_ENV === 'development') {
	console.log('enabling react devtools...');
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
		window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}
