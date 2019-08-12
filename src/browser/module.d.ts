declare module '*.png' {
	const path: string;
	export default path;
}
declare module '*.gif' {
	const path: string;
	export default path;
}
declare module '*.webm' {
	const path: string;
	export default path;
}

declare module '*.css' {
	const classes: Record<string, string>;
	export default classes;
}
