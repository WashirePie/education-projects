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

const emptyEmployee: Employee = {
  name: '',
  lastName: '',
  department: '',
  id: '',
  workload: 0,
  possibleFunctions: [{} as EmployeeFunction]
}

/**
 * @summary Helper function to do runtime Typechecking. It's <b>only</b> used in conjunction with
 * Vuex. Vuex TS support is too involved for such a small project
 * @param {any} [obj] Object to be checked
 * @returns {boolean} True if typecheck succeeded
 */
export const isEmployee = (obj: any): obj is Employee => Object.keys(obj).every(k => Object.keys(emptyEmployee).includes(k))