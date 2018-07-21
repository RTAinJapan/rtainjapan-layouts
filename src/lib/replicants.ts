import nodecg from './nodecg';
import {Checklist} from '../../types/schemas/checklist';
import {Schedule} from '../../types/schemas/schedule';
import {CurrentRun} from '../../types/schemas/currentRun';
import {NextRun} from '../../types/schemas/nextRun';
import {TimeObject} from './time-object';
import {Twitter} from '../../types/schemas/twitter';

export const stopwatchRep = nodecg.Replicant<TimeObject>('stopwatch');
export const checklistCompleteRep = nodecg.Replicant<boolean>(
	'checklistComplete'
);
export const scheduleRep = nodecg.Replicant<Schedule>('schedule');
export const currentRunRep = nodecg.Replicant<CurrentRun>('currentRun');
export const nextRunRep = nodecg.Replicant<NextRun>('nextRun');
export const checklistRep = nodecg.Replicant<Checklist>('checklist');
export const twitterRep = nodecg.Replicant<Twitter>('twitter');
