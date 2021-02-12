import { ApproachModel } from './approachModel'
import { DocumentRef } from './document'
import { Employee } from './employee'
import { Phase } from './phase'
import { PersonnelResource } from './resource'

export interface Project
{
  title: string;
  id: string;
  model: ApproachModel;
  progress: number;
  phases: Array<Phase>;
  projectLead: Employee;
  startDate: Date;
  endDate: Date;
  approvalDate: Date;
  state: EProjectState;
  priority: EProjectPriority;
  documents: Array<DocumentRef> | null;
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