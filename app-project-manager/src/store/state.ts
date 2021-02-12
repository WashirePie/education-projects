import { ApproachModel } from "@/interfaces/approachModel";
import { CostCenter, ICostCenter } from "@/interfaces/costCenter";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/interfaces/employee";
import { EProjectPriority, EProjectState, Project } from "@/interfaces/project";

export type ProjectManagerState =
{
  employeeFunctions: Array<IEmployeeFunction>
  employees: Array<Employee>
  approachModels: Array<ApproachModel>
  costCenters: Array<CostCenter>
  projects: Array<Project>
  newProject: Project | null
}

/* TODO: Will be taken from db */
// Sample Data
const employeeFunctions = <Array<IEmployeeFunction>>[
  { name: EEmployeeFunctions.Developer,     note: 'Available for developer functions' },
  { name: EEmployeeFunctions.Designer,      note: 'Available for designer functions' },
  { name: EEmployeeFunctions.ProjectLead,   note: 'Available as project lead' },
  { name: EEmployeeFunctions.Administrator, note: 'Available for administrative functions' }
]

const costCenterOne   = new CostCenter('Education',             'CC000')
const costCenterTwo   = new CostCenter('Software Development',  'CC200')
const costCenterThree = new CostCenter('Software Testing',      'CC210')
const costCenterFour  = new CostCenter('Software Documentation','CC220')

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

  costCenters: <Array<CostCenter>>[
    costCenterOne,
    costCenterTwo,
    costCenterThree,
    costCenterFour,
  ],

  projects: <Array<Project>>[
    projectOne, 
    projectTwo, 
    projectThree,
  ],

  newProject: null,
}