declare interface Window {
	__REACT_DEVTOOLS_GLOBAL_HOOK__: any;
}

if (process.env.NODE_ENV === 'development') {
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
		window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}
