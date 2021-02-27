import { CostType } from "./costType";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "./employee";

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
  function: EEmployeeFunctions
  assignee: Employee
  readonly unit: string = "hours"

  constructor(title: string, plan: number, _function: EEmployeeFunctions, _assignee: Employee) {
    super(title, plan)
    if (_assignee.possibleFunctions.some(f => f.name == _function)) {
      this.function = _function
      this.assignee = _assignee
    }
    else throw new Error(`Assignee is not capable of doing work of type '${_function}'`)
  }

  public toPlanString = (): string => `'${this.title}' - ${this.plan} ${this.unit} - ${this.assignee.fullName}`
  public getSummary = (): string => `Used ${this.actual} ${this.unit} of ${this.plan} ${this.unit}`
}

export class ExternalCostResource extends Resource implements IResource {
  costType: CostType
  readonly unit: string = "$"

  constructor(title: string, plan: number, _costType: CostType) {
    super(title, plan)
    this.costType = _costType
  }


  public toPlanString = (): string => `'${this.title}' - ${this.unit}${this.plan} - ${this.costType.title}`
  public getSummary = (): string => `Used ${this.unit}${this.actual} of ${this.unit}${this.plan}`
}