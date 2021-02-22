import { Activity } from "./activity";
import { DocumentRef } from "./document";
import { Employee } from "./employee";
import { Milestone } from "./milestone";
import { EProjectState, Project } from "./project";
import { IResource } from "./resource";

export class Phase
{
  approvalDate: Date | null = null

  constructor(
    title: string,
  )
  {
    this._title = title

    this._activities = []
    this._milestones = []
    this._documents = []
    this._progress = 0
    this._startDate = new Date()
    this._endDate = this._startDate
    this._state = EProjectState.PLANNING
    this._phaseMilestone = new Milestone('Phasemilestone', this.endDate, [])
  }
  
  private _title : string;
  public get title() : string {
    return this._title;
  }

  private _state: EProjectState
  public get state() : EProjectState
  {
    return this._state
  }

  private _progress: number
  public get progress() : number
  {
     this._progress = this._activities.length ? (this._activities.map(a => a.progress).reduce((a, c) => a + c) / this._activities.length) : 0
     return this._progress
  }

  private _endDate : Date;
  public get endDate() : Date {
    this._endDate = this._activities.length ? this._activities.reduce((a, c) => a.endDate > c.endDate ? a : c).endDate : this.startDate
    return this._endDate;
  }
  
  private _phaseMilestone : Milestone;
  public get phaseMilestone() : Milestone {
    return this._phaseMilestone;
  }
  
  private _activities : Array<Activity>;
  public get activities() : Array<Activity> 
  {
    return this._activities;
  }
  addActivity(title: string, startDate: Date, endDate: Date, resources: Array<IResource>, responsibility: Employee, documents: Array<DocumentRef> = [])
  {  
    let error = null
    const newId = this._activities.length.toString()

    if (startDate > endDate)        error = new Error('Start date must be before end date')
    if (startDate < this.startDate) error = new Error('Start date cannot be before phase start date')
    if (!resources.length)          error = new Error('An activity needs at least one resource assigned')
   
    if (error) throw error    
    
    const newActivity = new Activity(newId, title, startDate, endDate, resources, responsibility, documents)
    
    if (this.phaseMilestone.activities.includes(newActivity.id)) throw new Error ('Activity with this ID already exists!') // Sanity check

    this.phaseMilestone.activities.push(newActivity.id)
    this._activities.push(newActivity)
  }
  public removeActivity(activity: Activity)
  {
    const id = activity.id
    this._activities = this._activities.filter(a => a.id != id)
    this._phaseMilestone.activities = this._phaseMilestone.activities.filter(i => i != id)
  }
  
  private _startDate : Date;
  public get startDate() : Date {
    return this._startDate;
  }
  public setStartDate(startDate: Date, parent: Project)
  {
    let error = null
    if (startDate < parent.startDate) error = new Error('Start date cannot be before project start date')

    if (error) throw error    

    this._startDate = startDate
  }

  private _milestones : Array<Milestone>;
  public get milestones() : Array<Milestone> {
    return this._milestones;
  }
  public addMilestone(name: string, reviewDate: Date, watch: Array<string>)
  {
    let error = null
    const activitiesExist = this._activities.some(a => watch.includes(a.id))
    // const reviewDateIsLegal = this._activities.every(a => a.endDate < reviewDate)

    // TODO: Use this?
    // if (!reviewDateIsLegal) error = new Error('Review date must after any end date of the selected activities') // Just a design restriction
    if (!activitiesExist)   error = new Error('Not all of the selected activities exist in this phase') // Sanity check
    if (!watch.length)      error = new Error('A milestone needs at least one activity reference assigned')
   
    if (error) throw error    
    
    const newMilestone = new Milestone(name, reviewDate, watch)

    if (this._milestones.some(m => m.name == newMilestone.name)) throw new Error('Milestone with this ID already exists!') // Sanity check

    this._milestones.push(newMilestone)
  }
  public removeMilestone(milestone: Milestone)
  {
    this._milestones = this._milestones.filter(m => m.name != milestone.name)
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

  public plan(parent: Project)
  {
    let error = null
    if (!this.activities.length) error = new Error('A phase needs at least one activity')
    
    this._state = error ? EProjectState.PLANNING : EProjectState.WAITING
    
    if (error) throw error
  }
}