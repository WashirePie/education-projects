import { Activity } from "./activity";
import { DocumentRef } from "./document";
import { Milestone } from "./milestone";
import { EProjectPriority, EProjectState } from "./project";

export interface IPhase
{
  title: string;
  progress: number;
  activities: Array<Activity>;
  phaseMilestone: Milestone;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
  approvalDate: Date | null;
  state: EProjectState;
  documents: Array<DocumentRef>;
}

export class Phase implements IPhase
{
  title: string
  
  progress: number = 0
  startDate: Date = new Date()
  endDate: Date = new Date(); 
  approvalDate: Date | null = null
  state: EProjectState = EProjectState.PLANNING
  documents: Array<DocumentRef> = []
  phaseMilestone: Milestone = new Milestone('Phasemilestone', this.endDate, [])
  milestones: Array<Milestone> = []

  constructor(
    _title: string,
  )
  {
    this.title = _title
    this._activities = []
  }

  private _activities : Array<Activity>;
  public get activities() : Array<Activity> 
  {
    return this._activities;
  }
  addActivity(activity: Activity)
  {
    this.phaseMilestone.activities.push(activity.id)
    this._activities.push(activity)
  }
  
}