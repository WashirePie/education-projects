import { ApproachModel } from './approachModel'
import { DocumentRef } from './document'
import { Employee } from './employee'
import { Phase } from './phase'

export const enum EProjectState
{
  PLANNING = 'Planning',
  WAITING = 'Awaiting approval',
  CANCELLED = 'Cancelled',
  DENIED = 'Denied',
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

    this._documents = []
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

  public get progress() : number
  {
    return this._phases.length ? (this._phases.map(p => p.progress).reduce((a, c) => a + c) / this._phases.length) : 0
  }

  private _state: EProjectState
  public get state() : EProjectState
  {
    return this._state
  }
  public get isExecuting(): boolean        { return this._state == EProjectState.EXECUTION }
  public get isDenied(): boolean           { return this._state == EProjectState.DENIED }
  public get isCancelled(): boolean        { return this._state == EProjectState.CANCELLED }
  public get isFinished(): boolean         { return this._state == EProjectState.FINISHED }
  public get isAwaitingApproval(): boolean { return this._state == EProjectState.WAITING }
  
  private _endDate : Date;
  public get endDate() : Date {
    this._endDate = this.phases.reduce((a, c) => a.endDate > c.endDate ? a : c).endDate
    return this._endDate;
  }

  private _documents : Array<DocumentRef>;
  public get documents() : Array<DocumentRef> {
    return this._documents;
  }
  public async addDocuments()
  {
    // Remove dupes
    let selected: Array<DocumentRef> = await DocumentRef.promptSelection()
    this._documents = [...this._documents, ...selected].filter((v,i,a) => a.findIndex(t => (t.path === v.path)) === i)
  }
  public removeDocument(doc: DocumentRef)
  {
    this._documents = this._documents.filter(d => d.path != doc.path)
  }

  public plan() 
  {
    const phasesArePlanned = this.phases.every(p => p.state == EProjectState.WAITING)
    
    if (!phasesArePlanned)
    {
      this._state = EProjectState.PLANNING
      throw new Error('Not all phases are planned')
    }    

    this._state = EProjectState.WAITING
  }

  public approve(doApprove: boolean = true) 
  {
    if (!doApprove) this._state = EProjectState.DENIED
    else {
      this._state = EProjectState.EXECUTION
      this._phases.forEach(p => p.approvalDate = new Date())
      this.approvalDate = new Date()
    }
  }

  public cancel()
  {
    this._state = EProjectState.CANCELLED
  }
}