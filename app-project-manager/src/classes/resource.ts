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

export class Resource {
  constructor(title: string, plan: number) {
    this._title = title
    this._plan = plan
    this._actual = 0
    this._deviation = ''
  }

  private _title: string;
  public get title(): string {
    return this._title;
  }

  private _deviation: string;
  public get deviation(): string {
    return this._deviation;
  }
  public set deviation(v: string) {
    this._deviation = v;
  }

  private _plan: number;
  public get plan(): number {
    return this._plan;
  }
  public set plan(v: number) {
    this._plan = v
  }

  private _actual: number;
  public get actual(): number {
    return this._actual;
  }
  public set actual(v: number) {
    let value = <unknown>v

    v = parseFloat(<string>value) | 0
    this._actual = v > 1e6 ? 1e6 : v < 0 ? 0 : v
  }
  public get percent(): number { return 100 / this._plan * this._actual }
}

export class PersonnelResource extends Resource implements IResource {
  constructor(title: string, plan: number, func: EEmployeeFunctions, assignee: Employee) {
    super(title, plan)

    this._func = func
    this._assignee = assignee
  }

  public get unit(): string {
    return "hours"
  }

  private _func: EEmployeeFunctions;
  public get func(): EEmployeeFunctions {
    return this._func;
  }
  public set func(v: EEmployeeFunctions) {
    this._func = v;
  }

  @Type(() => Employee)
  private _assignee: Employee;
  public get assignee(): Employee {
    return this._assignee;
  }

  public toPlanString(): string {
    return `'${this.title}' - ${this.plan} ${this.unit} - ${this.assignee.fullName}`
  }
  public getSummary(): string {
    return `Used ${this.actual} ${this.unit} of ${this.plan} ${this.unit}`
  }
}

export class ExternalCostResource extends Resource implements IResource {

  constructor(title: string, plan: number, costType: CostType) {
    super(title, plan)
    this._costType = costType
  }

  public get unit() {
    return '$'
  }

  @Type(() => CostType)
  private _costType: CostType;
  public get costType(): CostType {
    return this._costType;
  }

  public toPlanString(): string {
    return `'${this.title}' - ${this.unit}${this.plan} - ${this.costType.title}`
  }
  public getSummary(): string {
    return `Used ${this.unit}${this.actual} of ${this.unit}${this.plan}`
  }
}