import { Type } from 'class-transformer'
import { MessageBoxReturnValue } from 'electron/main'
import { ApproachModel } from './approachModel'
import { DocumentRef } from './document'
import { Employee } from './employee'
import { Phase } from './phase'

export const enum EProjectState {
  PLANNING = 'Planning',
  WAITING = 'Awaiting approval',
  CANCELLED = 'Cancelled',
  DENIED = 'Denied',
  EXECUTION = 'Execution',
  FINISHED = 'Finished'
}

export enum EProjectPriority {
  HIGH = 'High',
  ABOVE_AVERAGE = 'Above average',
  NORMAL = 'Normal',
  BELOW_AVERAGE = 'Below average',
  LOW = 'Low'
}

/**
 * Root Class. Encapsulates a project
 *
 * @export
 * @class Project
 */
export class Project {
  /**
   * Creates an instance of Project.
   * @param {string} title
   * @param {string} id
   * @param {ApproachModel} model
   * @param {string} description
   * @param {Date} startDate
   * @param {EProjectPriority} priority
   * @param {Employee} projectLead
   * @memberof Project
   */
  constructor(
    title: string,
    id: string,
    model: ApproachModel,
    description: string,
    startDate: Date,
    priority: EProjectPriority,
    projectLead: Employee
  ) {
    this._title = title
    this._pId = id
    this._model = model
    this._description = description
    this._priority = priority
    this._projectLead = projectLead
    this._startDate = startDate
    this._endDate = startDate

    // This will fail when casting to this class, since the constructor is called before the Obj's properties are set
    try {
      this._phases = this.model.scaffold()
      this._phases.forEach(p => p.setStartDate(this.startDate, this))
    } catch (error) { /* Ignore */ }

    this._documents = []
    this._state = EProjectState.PLANNING
    this._approvalDate = null
  }

  /**
   * Title
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Project
   */
  private _title: string;
  public get title(): string { return this._title; }

  /**
   * Unique identifier
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Project
   */
  private _pId: string;
  public get pId(): string { return this._pId; }

  /**
   * Approval date of this
   *
   * @property
   * @type {(Date | null)}
   * @memberof Project
   */
  private _approvalDate: Date | null;
  public get approvalDate(): Date | null { return this._approvalDate; }
  public set approvalDate(v: Date | null) { this._approvalDate = v; }

  /**
   * Model
   *
   * @readonly
   * @property
   * @type {ApproachModel}
   * @memberof Project
   */
  @Type(() => ApproachModel)
  private _model: ApproachModel;
  public get model(): ApproachModel { return this._model; }

  /**
   * Description
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Project
   */
  private _description: string;
  public get description(): string { return this._description; }

  /**
   * Phases
   *
   * @readonly
   * @property
   * @type {Array<Phase>}
   * @memberof Project
   */
  @Type(() => Phase)
  /* @ts-ignore */
  private _phases: Array<Phase>;
  public get phases(): Array<Phase> { return this._phases; }

  /**
   * Employess
   *
   * @private
   * @property
   * @type {Employee}
   * @memberof Project
   */
  @Type(() => Employee)
  private _projectLead: Employee;
  public get projectLead(): Employee { return this._projectLead; }

  /**
   * Startdate
   *
   * @readonly
   * @property
   * @type {Date}
   * @memberof Project
   */
  private _startDate: Date;
  public get startDate(): Date { return this._startDate; }

  /**
   * Priority
   *
   * @readonly
   * @property
   * @type {EProjectPriority}
   * @memberof Project
   */
  private _priority: EProjectPriority;
  public get priority(): EProjectPriority { return this._priority; }

  /**
   * Gets the progress, based on assigned phases
   *
   * @readonly
   * @type {number}
   * @memberof Project
   */
  public get progress(): number { return this._phases.length ? (this._phases.map(p => p.progress).reduce((a, c) => a + c) / this._phases.length) : 0 }

  /**
   * Get the state of this. Other getters are available
   * @isExecuting - @isDenied - @isCancelled - @isFinished - @isAwaitingApproval
   * 
   * @readonly
   * @property
   * @type {EProjectState}
   * @memberof Project
   */
  private _state: EProjectState
  public get state(): EProjectState { return this._state }
  public get isExecuting(): boolean { return this._state == EProjectState.EXECUTION }
  public get isDenied(): boolean { return this._state == EProjectState.DENIED }
  public get isCancelled(): boolean { return this._state == EProjectState.CANCELLED }
  public get isFinished(): boolean { return this._state == EProjectState.FINISHED }
  public get isAwaitingApproval(): boolean { return this._state == EProjectState.WAITING }

  /**
   * Get projected end date of this. Computed by looking at assigned phases
   *
   * @readonly
   * @property
   * @type {Date}
   * @memberof Phase
   */
  private _endDate: Date;
  public get endDate(): Date {
    this._endDate = this.phases.reduce((a, c) => a.endDate > c.endDate ? a : c).endDate
    return this._endDate;
  }

  /**
   * Assigned Documents
   *
   * @property
   * @type {Array<DocumentRef>}
   * @memberof Project
   */
  @Type(() => DocumentRef)
  private _documents: Array<DocumentRef>;
  public get documents(): Array<DocumentRef> { return this._documents; }

  /**
   * Invoke a selection dialog and assign the selected documents
   * to this
   * 
   * @async
   * @method addDocuments
   * @memberof Project
   */
  public async addDocuments() {
    // Remove dupes
    let selected: Array<DocumentRef> = await DocumentRef.promptSelection()
    this._documents = [...this._documents, ...selected].filter((v, i, a) => a.findIndex(t => (t.path === v.path)) === i)
  }

  /**
   * Remove @doc from this
   * 
   * @method removeDocument
   * @param {DocumentRef} doc
   * @memberof Project
   */
  public removeDocument(doc: DocumentRef) {
    this._documents = this._documents.filter(d => d.path != doc.path)
  }


  /**
   * Validates this according to the "Planning" rules
   * 
   * @method plan
   * @memberof Project
   */
  public plan() {
    const phasesArePlanned = this.phases.every(p => p.state == EProjectState.WAITING)

    if (!phasesArePlanned) {
      this._state = EProjectState.PLANNING
      throw new Error('Not all phases are planned')
    }

    this._state = EProjectState.WAITING
  }

  /**
   * Approves this project - this makes a project "executable"
   * or "denied"
   * 
   * @method approve
   * @param doApprove {boolean}
   * @memberof Project
   */
  public async approve() {
    const res: MessageBoxReturnValue = await window.dialog.showMessageBox({
      buttons: ['Accept', 'Deny', 'Cancel'],
      type: 'question',
      message: `Approve or deny the execution of Project '${this._title}' (${this._pId})`
    })

    if (res.response != 2) {
      const doApprove = res.response == 0 ? true : false

      if (!doApprove) this._state = EProjectState.DENIED
      else {
        this._state = EProjectState.EXECUTION
        this._phases.forEach(p => p.approvalDate = new Date())
        this.approvalDate = new Date()
      }
    }
  }
  public async approveProgrammatically(doApprove: boolean = true) {
    if (!doApprove) this._state = EProjectState.DENIED
    else {
      this._state = EProjectState.EXECUTION
      this._phases.forEach(p => p.approvalDate = new Date())
      this.approvalDate = new Date()
    }
  }
  /**
   * Cancels this project
   * 
   * @method cancel
   * @memberof Project
   */
  public cancel() {
    this._state = EProjectState.CANCELLED
  }

  /**
   * Manages this project. Checks for completion by peeking the assigned
   * phases' states
   * 
   * @method manage
   * @memberof Project
   */
  public manage() {
    const phasesAreFinished = this.phases.every(p => p.isFinished)

    if (phasesAreFinished) {
      this._state = EProjectState.FINISHED
    }
  }
}