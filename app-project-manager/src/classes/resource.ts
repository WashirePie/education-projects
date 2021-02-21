import { CostType } from "./costType";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "./employee";

export interface IResource
{
  title: string,
  plan: number;
  actual: number;
  deviation: string;
}

export enum EResourceTypes
{
  externalCost = 'EXTERNAL_COST',
  personnel = 'PERSONNEL'
}

export class PersonnelResource implements IResource
{
  title: string
  plan: number
  function: EEmployeeFunctions
  assignee: Employee
  
  actual: number = 0
  deviation: string = ''

  constructor(
    _title: string,
    _plan: number,
    _function: EEmployeeFunctions,
    _assignee: Employee
  )
  {
    if (_assignee.possibleFunctions.some(f => f.name == _function))
    {
      this.title = _title
      this.plan = _plan
      this.function = _function
      this.assignee = _assignee
    }
    else throw new Error(`Assignee is not capable of doing work of type '${_function}'`)
  }
}

export class ExternalCostResource implements IResource
{
  title: string
  plan: number
  costType: CostType

  actual: number = 0
  deviation: string = ''

  constructor(
    _title: string,
    _plan: number,
    _costType: CostType
  )
  {
    this.title = _title
    this.plan = _plan
    this.costType = _costType
  }
}