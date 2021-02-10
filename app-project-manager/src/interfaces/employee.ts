export interface EmployeeFunction
{
  name: string,
  note?: string
}

export interface Employee 
{
  name: string,
  lastName: string,
  department: string,
  id: string,
  workload: number,
  possibleFunctions: Array<EmployeeFunction>
}