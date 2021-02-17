import { ApproachModel } from "@/interfaces/approachModel";
import { CostType, ICostType } from "@/interfaces/costType";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/interfaces/employee";
import { Phase } from "@/interfaces/phase";
import { EProjectPriority, EProjectState, Project } from "@/interfaces/project";

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

const costTypeOne   = new CostType('Outsourced Development', 'CC000')
const costTypeTwo   = new CostType('Outsourced Design',     'CC200')
const costTypeThree = new CostType('Outsourced Testing',    'CC210')
const costTypeFour  = new CostType('Consultancy Work',      'CC220')

const HERMES: ApproachModel = new ApproachModel('HERMES', ['Initialization', 'Concept', 'Realization', 'Introduction'] )
const IPDRCE: ApproachModel = new ApproachModel('IPDRCE', ['Inform', 'Plan', 'Decide', 'Realize', 'Control', 'Evaluate'] )

const employeeMax: Employee = new Employee('Max', 'Muster', 'Development',    '#99999', 40, [employeeFunctions[0], employeeFunctions[3]])
const employeeBob: Employee = new Employee('Bob', 'Muster', 'Administration', '#99998', 30, [employeeFunctions[2], employeeFunctions[3]])
const employeeEve: Employee = new Employee('Eve', 'Muster', 'Product Design', '#99997', 42, [employeeFunctions[1]])
const employeeJil: Employee = new Employee('Jil', 'Muster', 'Development',    '#99996', 10, [employeeFunctions[0], employeeFunctions[2], employeeFunctions[3]])

const projectOne   = new Project('Sample Project',  'P999', HERMES, 'A very basic sample Project', new Date(), EProjectPriority.NORMAL, employeeBob)
const projectTwo   = new Project('Another Project', 'P998', IPDRCE, 'Another basic sample Project', new Date(), EProjectPriority.HIGH, employeeJil)
const projectThree = new Project('A third Project',  'P997', HERMES, 'A third basic sample Project', new Date(), EProjectPriority.LOW, employeeBob)

projectOne.state = EProjectState.EXECUTION
projectOne.progress = 68

projectTwo.state = EProjectState.FINISHED
projectTwo.progress = 100

projectThree.state = EProjectState.CANCELLED
projectThree.progress = 23

const sampleProjectToBePlanned = new Project(
  'Sample Project', 
  'P444', 
  IPDRCE, 
  'A sample project in the planning state. Used to implement the <Planner> component.', 
  new Date(),
  EProjectPriority.ABOVE_AVERAGE, 
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