import { Activity } from "./activity";


export enum EMilestoneState {
  open = 'open',
  continued = 'continued',
  cancelled = 'cancelled',
  reworked = 'reworked'
}

export class Milestone {
  name: string
  activities: Array<Activity['id']>
  state: EMilestoneState = EMilestoneState.open

  constructor(_name: string, watch: Array<Activity['id']>) {
    this.name = _name
    this.activities = watch
  }

  public get isEvaluated(): boolean { return this.state != EMilestoneState.open }
}