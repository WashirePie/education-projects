import { Type } from "class-transformer";
import { Activity } from "./activity";
import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { EMilestoneState, Milestone } from "./milestone";
import { EProjectState, Project } from "./project";
import { IResource } from "./resource";

/**
 * Encapsulates a phase of a project
 *
 * @export
 * @class Phase
 */
export class Phase {
  /**
   * Creates an instance of Phase.
   * @param {string} title
   * @memberof Phase
   */
  constructor(title: string) {
    this._title = title

    this._activities = []
    this._milestones = []
    this._documents = []
    this._startDate = new Date()
    this._endDate = this._startDate
    this._state = EProjectState.PLANNING
    this._phaseMilestone = new Milestone('Phasemilestone', [])

    this._approvalDate = null
  }

  /**
   * Title
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Phase
   */
  private _title: string;
  public get title(): string { return this._title; }

  /**
   * Date on which this phase was approved
   *
   * @type {(Date | null)}
   * @memberof Phase
   */
  private _approvalDate: Date | null;
  public get approvalDate(): Date | null { return this._approvalDate; }
  public set approvalDate(v: Date | null) { this._approvalDate = v; }

  /**
   * Get the state of this. Other getters are available.
   * @isPlanned - @isFinished - 
   *
   * @readonly
   * @property
   * @type {EProjectState}
   * @memberof Phase
   */
  private _state: EProjectState
  public get state(): EProjectState { return this._state }
  public get isPlanned(): boolean { return this._state != EProjectState.PLANNING }
  public get isFinished(): boolean { return this.progress >= 100 }

  /**
   * Gets the progress, based on assigned activities
   *
   * @readonly
   * @property
   * @type {number}
   * @memberof Phase
   */
  public get progress(): number {
    return this._activities.length ? (this._activities.map(a => a.progress).reduce((a, c) => a + c) / this._activities.length) : 0
  }

  /**
   * Get projected end date of this. Computed by looking at assigned activities
   *
   * @readonly
   * @property
   * @type {Date}
   * @memberof Phase
   */
  private _endDate: Date;
  public get endDate(): Date {
    this._endDate = this._activities.length ? this._activities.reduce((a, c) => a.endDate > c.endDate ? a : c).endDate : this.startDate
    return this._endDate;
  }


  /**
   * Phasemilestone
   *
   * @readonly
   * @property
   * @type {Milestone}
   * @memberof Phase
   */
  @Type(() => Milestone)
  private _phaseMilestone: Milestone;
  public get phaseMilestone(): Milestone { return this._phaseMilestone; }

  /**
   * Activities
   *
   * @readonly
   * @property
   * @type {Array<Activity>}
   * @memberof Phase
   */
  @Type(() => Activity)
  private _activities: Array<Activity>;
  public get activities(): Array<Activity> { return this._activities; }

  /**
   * Adds a new activity to this. Only allowed in planning state
   * 
   * @method addActivity
   * @param title 
   * @param startDate 
   * @param endDate 
   * @param resources 
   * @param responsibility 
   * @param documents
   * @memberof Phase 
   */
  public addActivity(title: string, startDate: Date, endDate: Date, resources: Array<IResource>, responsibility: Employee, documents: Array<DocumentRef> = []) {
    let error = null
    const newId = this._activities.length.toString()

    if (startDate > endDate) error = new Error('Start date must be before end date')
    if (startDate < this.startDate) error = new Error('Start date cannot be before phase start date')
    if (!resources.length) error = new Error('An activity needs at least one resource assigned')

    if (error) throw error

    const newActivity = new Activity(newId, title, startDate, endDate, resources, responsibility, documents)

    if (this.phaseMilestone.activities.includes(newActivity.aId)) throw new Error('Activity with this ID already exists!') // Sanity check

    this.phaseMilestone.activities.push(newActivity.aId)
    this._activities.push(newActivity)
  }

  /**
   * Removes @activity from this
   * 
   * @method removeActivity
   * @param activity 
   * @memberof Phase
   */
  public removeActivity(activity: Activity) {
    const id = activity.aId
    this._activities = this._activities.filter(a => a.aId != id)
    this._phaseMilestone.activities = this._phaseMilestone.activities.filter(i => i != id)
  }

  /**
   * StartDate
   *
   * @readonly
   * @property
   * @type {Date}
   * @memberof Phase
   */
  private _startDate: Date;
  public get startDate(): Date { return this._startDate; }

  /**
   * Sets the start date of this. Checks for validity on parent project.
   * 
   * @method setStartDate
   * @param startDate 
   * @param parent
   * @memberof Phase
   */
  public setStartDate(startDate: Date, parent: Project) {
    let error = null
    if (startDate < parent.startDate) error = new Error('Start date cannot be before project start date')

    if (error) throw error

    this._startDate = startDate
  }

  /**
   * Milestones
   *
   * @readonly
   * @property
   * @type {Array<Milestone>}
   * @memberof Phase
   */
  @Type(() => Milestone)
  private _milestones: Array<Milestone>;
  public get milestones(): Array<Milestone> { return this._milestones; }

  /**
   * Adds a new milestone to this. Only allowed in planning state
   * 
   * @method addMilestone
   * @param name 
   * @param watch 
   * @memberof Phase
   */
  public addMilestone(name: string, watch: Array<string>) {
    let error = null
    const activitiesExist = this._activities.some(a => watch.includes(a.aId))

    if (!activitiesExist) error = new Error('Not all of the selected activities exist in this phase') // Sanity check
    if (!watch.length) error = new Error('A milestone needs at least one activity reference assigned')

    if (error) throw error

    const newMilestone = new Milestone(name, watch)

    if (this._milestones.some(m => m.name == newMilestone.name)) throw new Error('Milestone with this ID already exists!') // Sanity check

    this._milestones.push(newMilestone)
  }

  /**
   * Removes @milestone from this
   * 
   * @method removeMilestone
   * @param milestone 
   * @memberof Phase
   */
  public removeMilestone(milestone: Milestone) {
    this._milestones = this._milestones.filter(m => m.name != milestone.name)
  }

  /**
   * Get all assigned activities of this
   * 
   * @method getMilestoneActivities
   * @param milestone 
   * @returns {Array<Activit>} All assigned activities
   * @memberof Phase
   */
  public getMilestoneActivities(milestone: Milestone): Array<Activity> {
    return this._activities.filter(a => milestone.activities.includes(a.aId))
  }

  /**
   * Check if @milestone is evaluatable
   * 
   * @method getMilestoneEvaluatable
   * @param milestone 
   * @returns {boolean} true, if milestone is evaluatable
   * @memberof Phase
   */
  public getMilestoneEvaluatable(milestone: Milestone): boolean {
    const activities = this.getMilestoneActivities(milestone)
    const activitiesFinished = activities.every(a => a.isFinished)
    const someResourcesUsedUp = activities.some(a => a.resources.some(r => r.actual >= r.plan))

    return (activitiesFinished || someResourcesUsedUp) && !milestone.isEvaluated
  }

  /**
   * Set @milestone to @state
   * 
   * @method setMilestoneState
   * @param milestone 
   * @param state 
   * @memberof Phase
   */
  public setMilestoneState(milestone: Milestone, state: EMilestoneState) {
    if (state == EMilestoneState.continued)
      milestone.state = EMilestoneState.continued
    else if (state == EMilestoneState.reworked) {
      const activities = this.getMilestoneActivities(milestone)
      activities.forEach(a => {
        a.resources.forEach(r => {
          if (r.actual >= r.plan) r.plan = Math.round((r.actual * 1.1) * 100) / 100
        })
      })
      milestone.state = EMilestoneState.reworked
    }
    else if (state == EMilestoneState.cancelled) {
      milestone.state = EMilestoneState.cancelled
    }
  }

  /**
   * Assigned Documents
   *
   * @property
   * @type {Array<DocumentRef>}
   * @memberof Activity
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
   * @memberof Activity
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
   * @memberof Activity
   */
  public removeDocument(doc: DocumentRef) {
    this._documents = this._documents.filter(d => d.path != doc.path)
  }

  /**
   * Validates this according to the "Planning" rules
   * 
   * @method plan 
   * @param parent
   * @memberof Phase
   */
  public plan(parent: Project) {
    let error = null
    if (!this.activities.length) error = new Error('A phase needs at least one activity')

    this._state = error ? EProjectState.PLANNING : EProjectState.WAITING

    if (error) throw error
  }
}