declare module '*.png' {
	const path: string;
	export default path;
}

declare module '*.gif' {
	const path: string;
	export default path;
}

declare interface Window {
	__REACT_DEVTOOLS_GLOBAL_HOOK__: unknown;
}

declare module 'google-spreadsheet';
