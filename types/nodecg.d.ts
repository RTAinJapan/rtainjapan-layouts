import {Configschema} from './schemas/configschema';

export interface NodeCG {
	Replicant<T = never>(
		name: string,
		options?: {defaultValue: T}
	): Replicant<T>;
	sendMessage<T = never, U = never>(message: string, data?: T): Promise<U>;
	listenFor<T = never>(
		message: string,
		handler: (data: T, cb: ListenForCbObj) => void
	): void;
	log: Logger;
	Logger: new (label: string) => Logger;
	bundleName: string;
	config: NodeCGConfig;
	bundleConfig: Configschema;
}

export interface Replicant<T> {
	value: T;
	on(event: 'change', handler: (newVal: T, oldVal: T) => void): void;
	removeListener(
		event: 'change',
		handler: (newVal: T, oldVal: T) => void
	): void;
}

export interface Logger {
	info(...args: any[]): void;
	warn(...args: any[]): void;
	error(...args: any[]): void;
}

export interface NodeCGConfig {
	baseURL: string;
	login: {
		enabled: boolean;
		twitch: {
			enabled: boolean;
			scope: string;
			clientID: string;
		};
	};
}

export type ListenForCbObj = HandledListenForCb | UnhandledListenForCb;

interface HandledListenForCb {
	handled: true;
}

interface UnhandledListenForCb {
	(...args: any[]): void;
	handled: false;
}
