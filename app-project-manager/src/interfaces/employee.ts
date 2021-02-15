export const enum EEmployeeFunctions
{
  Developer = "Developer",
  Designer = "Designer",
  Administrator = "Administratior",
  ProjectLead = 'Project Lead',
}

export interface IEmployeeFunction
{
  name: EEmployeeFunctions,
  note?: string
}


export interface IEmployee 
{
  name: string,
  lastName: string,
  department: string,
  id: string,
  workload: number,
  possibleFunctions: Array<IEmployeeFunction>
}

export class Employee implements IEmployee
{
  name: string
  lastName: string
  department: string
  id: string
  workload: number
  possibleFunctions: Array<IEmployeeFunction>

  constructor(
    _name: string,
    _lastName: string,
    _department: string,
    _id: string,
    _workload: number,
    _possibleFunctions: Array<IEmployeeFunction>
  )
  {
    this.name = _name
    this.lastName = _lastName
    this.department = _department
    this.id = _id
    this.workload = _workload
    this.possibleFunctions = _possibleFunctions
  }
}
