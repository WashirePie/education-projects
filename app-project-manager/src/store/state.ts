import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/classes/employee";
import { Phase } from "@/classes/phase";
import { EProjectPriority, Project } from "@/classes/project";
import { ExternalCostResource, PersonnelResource } from "@/classes/resource";

export type ProjectManagerState =
{
  employeeFunctions: Array<IEmployeeFunction>
  employees: Array<Employee>
  approachModels: Array<ApproachModel>
  costTypes: Array<CostType>
  projects: Array<Project>
  projectToBePlanned: Project | null
  phaseToBePlanned: Phase | null
}

// TODO: Take data from db
// TODO: Move sample data to 'setupTests.ts'
/*
 * ----------------------------- Sample Data -----------------------------
 */
const employeeFunctions: Array<IEmployeeFunction> = [
  { name: EEmployeeFunctions.Developer,     note: 'Available for developer functions' },
  { name: EEmployeeFunctions.Designer,      note: 'Available for designer functions' },
  { name: EEmployeeFunctions.ProjectLead,   note: 'Available as project lead' },
  { name: EEmployeeFunctions.Administrator, note: 'Available for administrative functions' }
]

const costTypeOne   = new CostType('Outsourced Development', 'CT000')
const costTypeTwo   = new CostType('Outsourced Design',      'CT200')
const costTypeThree = new CostType('Outsourced Testing',     'CT210')
const costTypeFour  = new CostType('Consultancy Work',       'CT220')

const HERMES: ApproachModel = new ApproachModel('HERMES', ['Initialization', 'Concept', 'Realization', 'Introduction'] )
const IPDRCE: ApproachModel = new ApproachModel('IPDRCE', ['Inform', 'Plan', 'Decide', 'Realize', 'Control', 'Evaluate'] )

const employeeMax: Employee = new Employee('Max', 'Muster', 'Development',    '#99999', 40, [employeeFunctions[0], employeeFunctions[3]])
const employeeBob: Employee = new Employee('Bob', 'Muster', 'Administration', '#99998', 30, [employeeFunctions[2], employeeFunctions[3]])
const employeeEve: Employee = new Employee('Eve', 'Muster', 'Product Design', '#99997', 42, [employeeFunctions[1]])
const employeeJil: Employee = new Employee('Jil', 'Muster', 'Development',    '#99996', 10, [employeeFunctions[0], employeeFunctions[2], employeeFunctions[3]])

const projectOne   = new Project('Sample Project',  'P999', HERMES, 'A very basic sample Project', new Date(), EProjectPriority.NORMAL, employeeBob)
const projectTwo   = new Project('Another Project', 'P998', IPDRCE, 'Another basic sample Project', new Date(), EProjectPriority.HIGH, employeeJil)
const projectThree = new Project('A third Project',  'P997', HERMES, 'A third basic sample Project', new Date(), EProjectPriority.LOW, employeeBob)

const sampleProjectToBePlanned = new Project(
  'Sample Project', 
  'P444', 
  IPDRCE, 
  'A sample project in the planning state. Used to implement the <Planner> component.', 
  new Date(),
  EProjectPriority.ABOVE_AVERAGE, 
  employeeJil
)

sampleProjectToBePlanned.phases[0].addActivity(
  'Sample Activity',
  new Date(),
  new Date(),
  [
    new PersonnelResource('Make Timetable', 40, EEmployeeFunctions.Administrator, employeeMax),
    new ExternalCostResource('Rewiev Timetable', 500, costTypeFour)
  ],
  employeeJil
)

/*
 * ----------------------------- /Sample Data -----------------------------
 */


export const state: ProjectManagerState = {
  /* 'employeeFunctions' are hardcoded and immutable. This could easily be moved to a database. */
  employeeFunctions,

  employees: <Array<Employee>>[
    employeeMax,
    employeeBob,
    employeeEve,
    employeeJil,
  ],

  approachModels: <Array<ApproachModel>>[ 
    HERMES, 
    IPDRCE,
  ],

  costTypes: <Array<CostType>>[
    costTypeOne,
    costTypeTwo,
    costTypeThree,
    costTypeFour,
  ],

  projects: <Array<Project>>[
    projectOne, 
    projectTwo, 
    projectThree,
  ],

  projectToBePlanned: sampleProjectToBePlanned,
  phaseToBePlanned: null,
}