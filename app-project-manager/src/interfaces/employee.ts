export interface EmployeeFunction
{
  name: string,
  note?: string
}

export interface Employee 
{
  name: string,
  lastName: string,
  workload: number,
  possibleFunctions: Array<EmployeeFunction>
}