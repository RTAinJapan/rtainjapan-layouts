import {EventEmitter} from "node:events";
import streamDeck from "@elgato/streamdeck";
import {io, type Socket} from "socket.io-client";
import type {CurrentRun, Timer} from "./replicants";

/**
 * Connection configuration for the NodeCG instance, persisted in the plugin's
 * global settings.
 */
export type NodeCgConfig = {
	url: string;
	bundleName: string;
	key?: string;
};

/** Replicants the plugin observes to drive its key state. */
const WATCHED = ["timer", "current-run"] as const;
type WatchedName = (typeof WATCHED)[number];

const isWatched = (name: string): name is WatchedName =>
	(WATCHED as readonly string[]).includes(name);

const sameConfig = (a: NodeCgConfig, b: NodeCgConfig): boolean =>
	a.url === b.url && a.bundleName === b.bundleName && a.key === b.key;

/**
 * Single shared bridge between the plugin and NodeCG.
 *
 * Responsibilities:
 *  - maintain a (re)connecting `socket.io` connection to NodeCG,
 *  - observe the `timer` and `current-run` replicants (ReplicantObserver),
 *  - relay timer messages via NodeCG's `message` channel ({@link dispatch}).
 *
 * Rather than re-implementing NodeCG's replicant operation engine, the observer
 * re-reads the full value whenever an operation is broadcast (or on demand via
 * {@link reload}); this is robust against missed events and trivially cheap for
 * a localhost connection.
 *
 * Emits:
 *  - `"change"` when an observed replicant value changes,
 *  - `"status"` when the connection state changes.
 */
class NodeCgClient extends EventEmitter {
	#socket: Socket | undefined;
	#config: NodeCgConfig | undefined;
	#timer: Timer | null = null;
	#currentRun: CurrentRun | null = null;
	#connected = false;

	constructor() {
		super();
		// One subscription per action × event; raise the ceiling to avoid the
		// default 10-listener warning.
		this.setMaxListeners(64);
	}

	get connected(): boolean {
		return this.#connected;
	}

	get timer(): Timer | null {
		return this.#timer;
	}

	get currentRun(): CurrentRun | null {
		return this.#currentRun;
	}

	/** Returns the runner name for the given slot, or `undefined` when empty. */
	runnerName(index: number): string | undefined {
		return this.#currentRun?.runners?.[index]?.name || undefined;
	}

	/**
	 * Applies a new connection configuration, reconnecting only when it differs
	 * from the active one.
	 */
	configure(config: NodeCgConfig): void {
		if (this.#config && sameConfig(this.#config, config)) {
			return;
		}
		this.#config = config;
		this.#connect();
	}

	#connect(): void {
		if (this.#socket) {
			this.#socket.removeAllListeners();
			this.#socket.disconnect();
			this.#socket = undefined;
		}
		const config = this.#config;
		if (!config?.url) {
			return;
		}

		streamDeck.logger.info(
			`Connecting to NodeCG at ${config.url} (bundle: ${config.bundleName})`,
		);
		const socket = io(config.url, {
			transports: ["websocket", "polling"],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			...(config.key
				? {auth: {token: config.key}, query: {key: config.key}}
				: {}),
		});
		this.#socket = socket;

		socket.on("connect", () => {
			this.#connected = true;
			streamDeck.logger.info("Connected to NodeCG");
			this.emit("status");
			void this.#subscribeAll();
		});
		socket.on("disconnect", (reason) => {
			this.#connected = false;
			streamDeck.logger.warn(`Disconnected from NodeCG: ${reason}`);
			this.emit("status");
		});
		socket.on("connect_error", (error: Error) => {
			streamDeck.logger.warn(`NodeCG connection error: ${error.message}`);
		});
		// NodeCG broadcasts incremental operations; we only use them as a hint to
		// re-read the affected replicant's full value.
		socket.on(
			"replicant:operations",
			(data: {namespace: string; name: string}) => {
				if (data.namespace === config.bundleName && isWatched(data.name)) {
					void this.#read(data.name);
				}
			},
		);
	}

	async #subscribeAll(): Promise<void> {
		await Promise.all(WATCHED.map((name) => this.#declare(name)));
		this.emit("change");
	}

	/** Joins the replicant's room and reads its initial value. */
	#declare(name: WatchedName): Promise<void> {
		const socket = this.#socket;
		const namespace = this.#config?.bundleName;
		if (!socket || !namespace) {
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			socket.emit("joinRoom", `replicant:${namespace}:${name}`, () => {
				socket.emit(
					"replicant:declare",
					{name, namespace, opts: {}},
					(error: unknown, result?: {value: unknown}) => {
						if (!error && result) {
							this.#apply(name, result.value);
						}
						resolve();
					},
				);
			});
		});
	}

	/** Re-reads a replicant's full value and notifies listeners. */
	#read(name: WatchedName): Promise<void> {
		const socket = this.#socket;
		const namespace = this.#config?.bundleName;
		if (!socket || !namespace) {
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			socket.emit(
				"replicant:read",
				{name, namespace},
				(error: unknown, value: unknown) => {
					if (!error) {
						this.#apply(name, value);
						this.emit("change");
					}
					resolve();
				},
			);
		});
	}

	#apply(name: WatchedName, value: unknown): void {
		if (name === "timer") {
			this.#timer = (value as Timer) ?? null;
		} else {
			this.#currentRun = (value as CurrentRun) ?? null;
		}
	}

	/** Re-synchronises observed replicants (manual fallback for missed events). */
	async reload(): Promise<void> {
		if (!this.#connected) {
			this.#connect();
			return;
		}
		await Promise.all(WATCHED.map((name) => this.#read(name)));
	}

	/**
	 * Sends a NodeCG message (equivalent to `nodecg.sendMessage`).
	 *
	 * The timer message handlers (`startTimer`, `completeRunner`, …) do not
	 * acknowledge messages, and the dashboard sends them fire-and-forget. So we
	 * emit without waiting for an acknowledgement that would never arrive (doing
	 * so previously left every press hanging). The result is reflected through
	 * the observed `timer` / `current-run` replicants instead. Rejects only when
	 * not connected.
	 */
	dispatch(messageName: string, content?: unknown): Promise<void> {
		const socket = this.#socket;
		const bundleName = this.#config?.bundleName;
		if (!socket || !this.#connected || !bundleName) {
			return Promise.reject(new Error("NodeCG is not connected"));
		}
		socket.emit("message", {messageName, bundleName, content});
		return Promise.resolve();
	}
}

/** Shared, process-wide NodeCG bridge used by every action. */
export const nodecg = new NodeCgClient();
