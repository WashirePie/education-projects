import { Activity } from "./activity";


export enum EMilestoneState {
  open = 'open',
  continued = 'continued',
  cancelled = 'cancelled',
  reworked = 'reworked'
}

/**
 * Specifies a phase-assignable milestone
 *
 * @export
 * @class Milestone
 */
export class Milestone {
  /**
   * Creates an instance of Milestone.
   * @param {string} name
   * @param {Array<Activity['aId']>} watch
   * @memberof Milestone
   */
  constructor(name: string, watch: Array<Activity['aId']>) {
    this._name = name
    this._activities = watch

    this._state = EMilestoneState.open
  }

  /**
    * Name
    *
    * @readonly
    * @property
    * @type {string}
    * @memberof Milestone
    */
  private _name: string;
  public get name(): string { return this._name; }

  /**
   * Watched activity ids
   *
   * @property
   * @type {Array<Activity['aId']>}
   * @memberof Milestone
   */
  private _activities: Array<Activity['aId']>;
  public get activities(): Array<Activity['aId']> { return this._activities; }
  public set activities(v: Array<Activity['aId']>) { this._activities = v; }

  /**
   * State
   *
   * @property
   * @type {EMilestoneState}
   * @memberof Milestone
   */
  private _state: EMilestoneState;
  public get state(): EMilestoneState { return this._state; }
  public set state(v: EMilestoneState) { this._state = v }

  /**
   * IsEvaluated
   *
   * @readonly
   * @property
   * @type {boolean}
   * @memberof Milestone
   */
  public get isEvaluated(): boolean { return this.state != EMilestoneState.open }
}