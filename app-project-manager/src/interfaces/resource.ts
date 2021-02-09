import { CostCenter } from "./costCenter";
import { Employee, EmployeeFunction } from "./employee";

export interface Resource
{
  plan: number;
  actual: number;
  deviation: string;
}

export interface PersonnelResource extends Resource 
{
  function: EmployeeFunction;
  assignee: Employee
}

export interface ExternalCostResource extends Resource
{
  costCenter: CostCenter;
}