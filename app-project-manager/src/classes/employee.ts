import { Type } from "class-transformer"

export const enum EEmployeeFunctions {
  Developer = "Developer",
  Designer = "Designer",
  Administrator = "Administratior",
  ProjectLead = 'Project Lead',
}

export interface IEmployeeFunction {
  name: EEmployeeFunctions,
  note?: string
}

export class Employee {
  constructor(
    name: string,
    lastName: string,
    department: string,
    id: string,
    workload: number,
    possibleFunctions: Array<EEmployeeFunctions>
  ) {
    this._name = name
    this._lastName = lastName
    this._department = department
    this._eId = id
    this._workload = workload
    this._possibleFunctions = possibleFunctions
  }

  private _eId: string;
  public get eId(): string {
    return this._eId;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }

  private _lastName: string;
  public get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this.name} ${this.lastName}`
  }

  private _department: string;
  public get department(): string {
    return this._department;
  }

  private _workload: number;
  public get workload(): number {
    return this._workload;
  }

  private _possibleFunctions: Array<EEmployeeFunctions>;
  public get possibleFunctions(): Array<EEmployeeFunctions> {
    return this._possibleFunctions;
  }
}
