import nodecg from '../../lib/nodecg';
import {Checklist} from '../../../types/schemas/checklist';
import {Schedule} from '../../../types/schemas/schedule';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {NextRun} from '../../../types/schemas/nextRun';
import {TimeObject} from '../../lib/time-object';

export const stopwatchRep = nodecg.Replicant<TimeObject>('stopwatch');
export const checklistCompleteRep = nodecg.Replicant('checklistComplete');
export const scheduleRep = nodecg.Replicant<Schedule>('schedule');
export const currentRunRep = nodecg.Replicant<CurrentRun>('currentRun');
export const nextRunRep = nodecg.Replicant<NextRun>('nextRun');
export const checklistRep = nodecg.Replicant<Checklist>('checklist');
