import { CostCenter } from "./costCenter";
import { Employee, IEmployeeFunction } from "./employee";

export interface IResource
{
  plan: number;
  actual: number;
  deviation: string;
}

export interface IPersonnelResource extends IResource 
{
  function: IEmployeeFunction;
  assignee: Employee
}

export class PersonnelResource implements IPersonnelResource
{
  plan: number
  function: IEmployeeFunction
  assignee: Employee
  
  actual: number = 0
  deviation: string = ''

  constructor(
    _plan: number,
    _function: IEmployeeFunction,
    _assignee: Employee
  )
  {
    this.plan = _plan
    this.function = _function
    this.assignee = _assignee
  }
}

export interface IExternalCostResource extends IResource
{
  costCenter: CostCenter;
}

export class ExternalCostResource implements IExternalCostResource
{
  plan: number;
  costCenter: CostCenter;

  actual: number = 0
  deviation: string = ''

  constructor(
    _plan: number,
    _costCenter: CostCenter
  )
  {
    this.plan = _plan
    this.costCenter = _costCenter
  }
}