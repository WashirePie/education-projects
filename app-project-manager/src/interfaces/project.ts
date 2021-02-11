import { ApproachModel } from './approachModel'
import { DocumentRef } from './document'
import { Phase } from './phase'
import { PersonnelResource } from './resource'

export interface Project
{
  title: string;
  id: string;
  model: ApproachModel;
  progress: number;
  phases: Array<Phase>;
  projectLead: PersonnelResource;
  startDate: Date;
  endDate: Date;
  approvalDate: Date;
  state: EProjectState;
  priority: EProjectPriority;
  documents: Array<DocumentRef>;
  description: string;
}

export const enum EProjectState
{
  PLANNING = 'Planning',
  WAITING = 'Awaiting approval',
  CANCELLED = 'Cancelled',
  EXECUTION = 'Execution',
  FINISHED = 'Finished'
}

export const enum EProjectPriority
{
  HIGH = 'High',
  ABOVE_AVERAGE = 'Above average',
  NORMAL = 'Normal',
  BELOW_AVERAGE = 'Below average',
  LOW = 'Low'
}

const emptyProject: Project = {
  title: '',
  id: '',
  model: {} as ApproachModel,
  progress: 0,
  phases: [{} as Phase],
  projectLead: {} as PersonnelResource,
  startDate: {} as Date,
  endDate: {} as Date,
  approvalDate: {} as Date,
  state: EProjectState.PLANNING,
  priority: EProjectPriority.HIGH,
  documents: [{} as DocumentRef],
  description: ''
}

/**
 * @summary Helper function to do runtime Typechecking. It's <b>only</b> used in conjunction with
 * Vuex. Vuex TS support is too involved for such a small project
 * @param {any} [obj] Object to be checked
 * @returns {boolean} True if typecheck succeeded
 */
export const isProject = (obj: any): obj is Project => Object.keys(obj).every(k => Object.keys(emptyProject).includes(k))