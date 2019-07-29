import {CreateNodecgInstance, CreateNodecgConstructor} from 'ts-nodecg/browser';
import {Configschema} from '../nodecg/generated/configschema';
import {ReplicantMap} from '../nodecg/replicants';
import {MessageMap} from '../nodecg/messages';

export interface FontFaceSet {
	status: 'loading' | 'loaded';
	ready: Promise<FontFaceSet>;
	check(font: string, text?: string): boolean;
	load(font: string, text?: string): Promise<void>;
}

declare global {
	const nodecg: CreateNodecgInstance<
		'rtainjapan-layouts',
		Configschema,
		ReplicantMap,
		MessageMap
	>;
	const NodeCG: CreateNodecgConstructor<
		'rtainjapan-layouts',
		Configschema,
		ReplicantMap,
		MessageMap
	>;
	interface Document {
		fonts: FontFaceSet;
	}
}
