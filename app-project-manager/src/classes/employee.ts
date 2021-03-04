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
  name: string
  lastName: string
  department: string
  id: string
  workload: number
  possibleFunctions: Array<EEmployeeFunctions>

  constructor(
    _name: string,
    _lastName: string,
    _department: string,
    _id: string,
    _workload: number,
    _possibleFunctions: Array<EEmployeeFunctions>
  ) {
    this.name = _name
    this.lastName = _lastName
    this.department = _department
    this.id = _id
    this.workload = _workload
    this.possibleFunctions = _possibleFunctions
  }

  get fullName(): string {
    return `${this.name} ${this.lastName}`
  }
}
