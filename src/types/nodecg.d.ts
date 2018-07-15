import { Configschema } from "./configschema";

export interface NodeCG {
	Replicant<T = never>(name: string, options?: {defaultValue: T}): Replicant<T>;
	sendMessage<T = never, U = never>(message: string, data: T): Promise<U>;
	listenFor<T = never>(message: string, handler: (data: T, cb?: () => void) => void): void;
	log: Logger;
	Logger: new (label: string) => Logger;
	bundleName: string;
	config: NodeCGConfig;
	bundleConfig: Configschema;
}

export interface Replicant<T> {
	value: T;
	on(event: 'change', handler: (newVal: T, oldVal: T) => void): void
}

export interface Logger {
	info(...args: any[]): void;
	warn(...args: any[]): void;
	error(...args: any[]): void;
}

export interface NodeCGConfig {
	login: {
		enabled: boolean;
		twitch: {
			enabled: boolean;
			scope: string;
			clientID: string;
		};
	}
}
