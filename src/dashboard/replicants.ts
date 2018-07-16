import nodecg from '../lib/nodecg';
import {Checklist} from '../types/schemas/checklist';

export const checklistRep = nodecg.Replicant<Checklist>('checklist');
