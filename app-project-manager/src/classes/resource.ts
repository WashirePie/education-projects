import { Type } from "class-transformer";
import { CostType } from "./costType";
import { EEmployeeFunctions, Employee } from "./employee";

export interface IResource {
  title: string;
  plan: number;
  actual: number;
  deviation: string;
  percent: number
  readonly unit: string;
  toPlanString(): string;
  getSummary(): string;
}

export enum EResourceTypes {
  externalCost = 'EXTERNAL_COST',
  personnel = 'PERSONNEL'
}

/**
 * Base class for a assignable resource
 */
export class Resource {
  /**
   * Creates an instance of Resource.
   * @param {string} title
   * @param {number} plan
   * @memberof Resource
   */
  constructor(title: string, plan: number) {
    this._title = title
    this._plan = plan
    this._actual = 0
    this._deviation = ''
  }

  /**
   * Title
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Resource
   */
  private _title: string;
  public get title(): string { return this._title; }

  /**
   * Deviation
   *
   * @property
   * @type {string}
   * @memberof Resource
   */
  private _deviation: string;
  public get deviation(): string { return this._deviation; }
  public set deviation(v: string) { this._deviation = v; }

  /**
   * 'Plan' Value
   *
   * @property
   * @type {number}
   * @memberof Resource
   */
  private _plan: number;
  public get plan(): number { return this._plan; }
  public set plan(v: number) { this._plan = v }

  /**
   * 'Actual' Value
   *
   * @property
   * @type {number}
   * @memberof Resource
   */
  private _actual: number;
  public get actual(): number { return this._actual; }
  public set actual(v: number) {
    let value = <unknown>v
    v = parseFloat(<string>value) | 0
    this._actual = v > 1e6 ? 1e6 : v < 0 ? 0 : v
  }

  /**
   * Get current resource usage as a percentage
   *
   * @readonly
   * @property
   * @type {number}
   * @memberof Resource
   */
  public get percent(): number { return 100 / this._plan * this._actual }
}

/**
 * Specifies a personnel resource
 *
 * @export
 * @class PersonnelResource
 * @extends {Resource}
 * @implements {IResource}
 */
export class PersonnelResource extends Resource implements IResource {
  /**
   * Creates an instance of PersonnelResource.
   * @param {string} title
   * @param {number} plan
   * @param {EEmployeeFunctions} func
   * @param {Employee} assignee
   * @memberof PersonnelResource
   */
  constructor(title: string, plan: number, func: EEmployeeFunctions, assignee: Employee) {
    super(title, plan)

    this._func = func
    this._assignee = assignee
  }

  /**
    * Unit
    *
    * @readonly
    * @type {string}
    * @memberof PersonnelResource
    */
  public get unit(): string { return "hours" }

  /**
   * Function - defines a required capabilitiy for an assignee
   *
   * @property
   * @type {EEmployeeFunctions}
   * @memberof PersonnelResource
   */
  private _func: EEmployeeFunctions;
  public get func(): EEmployeeFunctions { return this._func; }
  public set func(v: EEmployeeFunctions) { this._func = v; }

  /**
   * Assignee
   *
   * @readonly
   * @property
   * @type {Employee}
   * @memberof PersonnelResource
   */
  @Type(() => Employee)
  private _assignee: Employee;
  public get assignee(): Employee { return this._assignee; }

  /**
   * Format this to a human readable 'Plan' string
   * 
   * @method toPlanString
   * @returns {string}
   * @memberof PersonnelResource
   */
  public toPlanString(): string {
    return `'${this.title}' - ${this.plan} ${this.unit} - ${this.assignee.fullName}`
  }

  /**
   * Format this to a human readable summary string
   * 
   * @method getSummary
   * @returns {string}
   * @memberof PersonnelResource
   */
  public getSummary(): string {
    return `Used ${this.actual} ${this.unit} of ${this.plan} ${this.unit}`
  }
}

/**
 * Specifies an external cost resource
 *
 * @export
 * @class ExternalCostResource
 * @extends {Resource}
 * @implements {IResource}
 */
export class ExternalCostResource extends Resource implements IResource {
  /**
   * Creates an instance of ExternalCostResource.
   * @param {string} title
   * @param {number} plan
   * @param {CostType} costType
   * @memberof ExternalCostResource
   */
  constructor(title: string, plan: number, costType: CostType) {
    super(title, plan)
    this._costType = costType
  }

  /**
   * Unit
   *
   * @readonly
   * @memberof ExternalCostResource
   */
  public get unit() { return '$' }

  /**
   * Cost type
   *
   * @readonly
   * @property
   * @type {CostType}
   * @memberof ExternalCostResource
   */
  @Type(() => CostType)
  private _costType: CostType;
  public get costType(): CostType { return this._costType; }

  /**
   * Format this to a human readable 'Plan' string
   * 
   * @method toPlanString
   * @returns {string}
   * @memberof ExternalCostResource
   */
  public toPlanString(): string {
    return `'${this.title}' - ${this.unit}${this.plan} - ${this.costType.title}`
  }

  /**
   * Format this to a human readable summary string
   * 
   * @method getSummary
   * @returns {string}
   * @memberof ExternalCostResource
   */
  public getSummary(): string {
    return `Used ${this.unit}${this.actual} of ${this.unit}${this.plan}`
  }
}