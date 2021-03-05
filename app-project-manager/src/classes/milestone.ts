import { Activity } from "./activity";


export enum EMilestoneState {
  open = 'open',
  continued = 'continued',
  cancelled = 'cancelled',
  reworked = 'reworked'
}

export class Milestone {
  constructor(name: string, watch: Array<Activity['aId']>) {
    this._name = name
    this._activities = watch

    this._state = EMilestoneState.open
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }

  private _activities: Array<Activity['aId']>;
  public get activities(): Array<Activity['aId']> {
    return this._activities;
  }
  public set activities(v: Array<Activity['aId']>) {
    this._activities = v;
  }

  private _state: EMilestoneState;
  public get state(): EMilestoneState {
    return this._state;
  }
  public set state(v: EMilestoneState) {
    this._state = v
  }

  public get isEvaluated(): boolean { return this.state != EMilestoneState.open }
}