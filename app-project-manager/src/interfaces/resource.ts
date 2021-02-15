import { CostCenter } from "./costCenter";
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

export interface IPersonnelResource extends IResource 
{
  function: EEmployeeFunctions;
  assignee: Employee
}

export class PersonnelResource implements IPersonnelResource
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

export interface IExternalCostResource extends IResource
{
  costCenter: CostCenter;
}

export class ExternalCostResource implements IExternalCostResource
{
  title: string
  plan: number
  costCenter: CostCenter

  actual: number = 0
  deviation: string = ''

  constructor(
    _title: string,
    _plan: number,
    _costCenter: CostCenter
  )
  {
    this.title = _title
    this.plan = _plan
    this.costCenter = _costCenter
  }
}