import { ApproachModel } from './approachModel'
import { DocumentRef } from './document'
import { Employee } from './employee'
import { Phase } from './phase'

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

export class Project 
{
  approvalDate: Date | null = null
  documents: Array<DocumentRef> = []

  constructor(
    title: string,
    id: string,
    model: ApproachModel, 
    description: string,
    startDate: Date,
    priority: EProjectPriority,
    projectLead: Employee
  )
  {
    this._title = title
    this._id = id
    this._model = model
    this._description = description
    this._priority = priority
    this._projectLead = projectLead
    this._startDate = startDate
    this._endDate = startDate

    this._phases = this.model.scaffold()
    this._phases.forEach(p => p.setStartDate(this.startDate, this))

    this._progress = 0
    this._state = EProjectState.PLANNING
  }

  private _title : string;
  public get title() : string {
    return this._title;
  }
  
  private _id : string;
  public get id() : string {
    return this._id;
  }
  
  private _model : ApproachModel;
  public get model() : ApproachModel {
    return this._model;
  }
  
  private _description : string;
  public get description() : string {
    return this._description;
  }  

  private _phases : Array<Phase>;
  public get phases() : Array<Phase> {
    return this._phases;
  }
  
  private _projectLead : Employee;
  public get projectLead() : Employee {
    return this._projectLead;
  }

  private _startDate : Date;
  public get startDate() : Date {
    return this._startDate;
  }
  
  private _priority : EProjectPriority;
  public get priority() : EProjectPriority {
    return this._priority;
  }

  private _progress: number
  public get progress() : number
  {
     this._progress = (this.phases.map(p => p.progress).reduce((a, c) => a + c) / this.phases.length) | 0
     return this._progress
  }

  private _state: EProjectState
  public get state() : EProjectState
  {
    return this._state
  }
  
  private _endDate : Date;
  public get endDate() : Date {
    this._endDate = this.phases.reduce((a, c) => a.endDate > c.endDate ? a : c).endDate
    return this._endDate;
  }

  public plan() 
  {
    const phasesArePlanned = this.phases.every(p => p.state == EProjectState.WAITING)
    
    if (!phasesArePlanned)
    {
      this._state = EProjectState.PLANNING
      throw new Error('Not all phases are planned')
    }    
    // TODO: Continue
    // if (phasesArePlanned)
    //   this._state = EProjectState.WAITING
    // else
    // const phasesArePlanned = this.phases.every(p => p.state = EProjectState.WAITING)

    // if (phasesArePlanned) 
    //   this._state = EProjectState.WAITING
    // if (this._state == EProjectState.PLANNING && this.approvalDate)
    //   this._state = EProjectState.EXECUTION
    // if (this._state == EProjectState.EXECUTION && new Date() >= this.endDate && this.progress >= 100)
    //   this._state = EProjectState.FINISHED
    
  }
}