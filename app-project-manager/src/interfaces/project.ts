import { ApproachModel } from './approachModel'
import { DocumentRef } from './document'
import { Employee } from './employee'
import { Phase } from './phase'
import { PersonnelResource } from './resource'

export interface IProject
{
  title: string;
  id: string;
  model: ApproachModel;
  progress: number;
  phases: Array<Phase>;
  projectLead: Employee;
  startDate: Date;
  endDate: Date;
  approvalDate: Date | null;
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

export enum EProjectPriority
{
  HIGH = 'High',
  ABOVE_AVERAGE = 'Above average',
  NORMAL = 'Normal',
  BELOW_AVERAGE = 'Below average',
  LOW = 'Low'
}

export class Project implements IProject 
{
  title: string
  id: string
  model: ApproachModel
  phases: Array<Phase>
  projectLead: Employee
  startDate: Date
  endDate: Date
  priority: EProjectPriority
  description: string
  
  state: EProjectState = EProjectState.PLANNING
  progress: number = 0
  approvalDate: Date | null = null
  documents: Array<DocumentRef> = []

  constructor(
    _title: string,
    _id: string,
    _model: ApproachModel, 
    _description: string,
    _startDate: Date,
    _priority: EProjectPriority,
    _projectLead: Employee
  )
  {
    this.title = _title
    this.id = _id
    this.model = _model
    this.description = _description
    this.priority = _priority
    this.projectLead = _projectLead
    this.startDate = _startDate
    this.endDate = _startDate

    this.phases = this.model.scaffold()
  }
}