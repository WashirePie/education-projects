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

/**
 * Specifies an employee
 *
 * @export
 * @class Employee
 */
export class Employee {
  /**
   * Creates an instance of Employee.
   * @param {string} name
   * @param {string} lastName
   * @param {string} department
   * @param {string} id
   * @param {number} workload
   * @param {Array<EEmployeeFunctions>} possibleFunctions
   * @memberof Employee
   */
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

  /**
   * Unique identifier
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Employee
   */
  private _eId: string;
  public get eId(): string { return this._eId; }

  /**
   * Name
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Employee
   */
  private _name: string;
  public get name(): string { return this._name; }

  /**
   * Lastname
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Employee
   */
  private _lastName: string;
  public get lastName(): string { return this._lastName; }

  /**
   * Fullname
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Employee
   */
  get fullName(): string { return `${this.name} ${this.lastName}` }

  /**
   * Department
   *
   * @readonly
   * @property
   * @type {string}
   * @memberof Employee
   */
  private _department: string;
  public get department(): string { return this._department; }

  /**
   * Workload - in hours per week
   *
   * @readonly
   * @property
   * @type {number}
   * @memberof Employee
   */
  private _workload: number;
  public get workload(): number { return this._workload; }

  /**
   * Possible functions. List of functions this employee can occupy
   *
   * @private
   * @property
   * @type {Array<EEmployeeFunctions>}
   * @memberof Employee
   */
  private _possibleFunctions: Array<EEmployeeFunctions>;
  public get possibleFunctions(): Array<EEmployeeFunctions> {
    return this._possibleFunctions;
  }
}
